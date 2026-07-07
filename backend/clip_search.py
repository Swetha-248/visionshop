import json
import os
import sys
from pathlib import Path

from PIL import Image

try:
    import torch
    from transformers import CLIPModel, CLIPProcessor
except Exception as exc:  # pragma: no cover - runtime fallback
    torch = None
    CLIPModel = None
    CLIPProcessor = None
    MODEL_IMPORT_ERROR = str(exc)
else:
    MODEL_IMPORT_ERROR = None

from chroma_manager import ChromaDBManager

CACHE_DIR = Path(__file__).resolve().parent / '.clip-cache'
MODEL_NAME = 'openai/clip-vit-base-patch32'
EMBEDDING_DIM = 512  # CLIP embedding dimension


def build_fallback_results(products, input_text):
    text = (input_text or '').lower()

    def score(product):
        haystack = (
            f"{product.get('name', '')} {product.get('brand', '')} "
            f"{product.get('category', '')} {product.get('description', '')}"
        ).lower()
        score_value = 0
        if product.get('isRecommended'):
            score_value += 10
        if product.get('category') and product.get('category').lower() in text:
            score_value += 25
        for keyword in ['laptop', 'shoe', 'sneaker', 'headphone', 'camera', 'phone', 'tablet', 'speaker']:
            if keyword in haystack:
                score_value += 5
        if any(word in haystack for word in text.split() if len(word) > 2):
            score_value += 3
        return score_value

    ranked = sorted(products, key=score, reverse=True)
    return ranked[:6]


def load_model():
    if torch is None or CLIPModel is None or CLIPProcessor is None:
        raise RuntimeError(MODEL_IMPORT_ERROR or 'CLIP dependencies are not available')

    model = CLIPModel.from_pretrained(MODEL_NAME, cache_dir=str(CACHE_DIR))
    processor = CLIPProcessor.from_pretrained(MODEL_NAME, cache_dir=str(CACHE_DIR))
    return model, processor


def get_embeddings(model, processor, image_path, products):
    image = Image.open(image_path).convert('RGB')
    texts = [
        f"{p.get('name', '')} {p.get('brand', '')} {p.get('category', '')} {p.get('description', '')}".strip()
        for p in products
    ]

    with torch.no_grad():
        image_inputs = processor(images=image, return_tensors='pt')
        text_inputs = processor(text=texts, return_tensors='pt', padding=True)
        image_features = model.get_image_features(**image_inputs)
        text_features = model.get_text_features(**text_inputs)

    image_features = image_features / image_features.norm(dim=-1, keepdim=True)
    text_features = text_features / text_features.norm(dim=-1, keepdim=True)
    similarities = (image_features @ text_features.T).squeeze(0).cpu().tolist()
    ranked_indices = sorted(range(len(products)), key=lambda idx: similarities[idx], reverse=True)
    ranked_products = [products[idx] for idx in ranked_indices[:6]]
    return ranked_products


def get_query_embedding(model, processor, image_path, input_text):
    """Get embedding for query - either from image or text."""
    if image_path and os.path.exists(image_path):
        # Get image embedding
        image = Image.open(image_path).convert('RGB')
        with torch.no_grad():
            image_inputs = processor(images=image, return_tensors='pt')
            image_features = model.get_image_features(**image_inputs)
        image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        return image_features.squeeze(0).cpu().tolist()
    elif input_text:
        # Get text embedding
        with torch.no_grad():
            text_inputs = processor(text=[input_text], return_tensors='pt', padding=True)
            text_features = model.get_text_features(**text_inputs)
        text_features = text_features / text_features.norm(dim=-1, keepdim=True)
        return text_features.squeeze(0).cpu().tolist()
    else:
        return None


def get_product_embeddings(model, processor, products):
    """Get embeddings for a list of products."""
    texts = [
        f"{p.get('name', '')} {p.get('brand', '')} {p.get('category', '')} {p.get('description', '')}".strip()
        for p in products
    ]
    
    with torch.no_grad():
        text_inputs = processor(text=texts, return_tensors='pt', padding=True)
        text_features = model.get_text_features(**text_inputs)
    
    text_features = text_features / text_features.norm(dim=-1, keepdim=True)
    return text_features.cpu().tolist()


def search_with_chroma(image_path, products, input_text):
    """Search using ChromaDB for semantic similarity."""
    try:
        # Initialize ChromaDB
        chroma = ChromaDBManager()
        
        # Load model
        model, processor = load_model()
        
        # Check if products are already in ChromaDB
        collection_info = chroma.get_collection_info()
        if collection_info['count'] == 0:
            # Embed and store products in ChromaDB
            embeddings = get_product_embeddings(model, processor, products)
            chroma.upsert_products(products, embeddings)
        
        # Get query embedding
        query_embedding = get_query_embedding(model, processor, image_path, input_text)
        if query_embedding is None:
            # Fall back to text search if no embedding available
            result = chroma.text_search(input_text, n_results=6)
            return {
                'results': result['results'],
                'analysis': 'Text-based search was performed in ChromaDB.',
                'mode': 'chroma-text'
            }
        
        # Search in ChromaDB
        result = chroma.search(query_embedding, n_results=6)
        return {
            'results': result['results'],
            'analysis': 'ChromaDB semantic search matched the query to catalog products.',
            'mode': 'chroma-semantic'
        }
    
    except Exception as exc:
        raise RuntimeError(f'ChromaDB search failed: {exc}')


def main():
    image_path = sys.argv[1] if len(sys.argv) > 1 else ''
    products_payload = sys.argv[2] if len(sys.argv) > 2 else '[]'

    products = json.loads(products_payload)
    input_text = ' '.join(sys.argv[3:]).strip()

    if not products:
        result = {
            'results': [],
            'analysis': 'No products were available in the catalog.',
            'mode': 'fallback'
        }
        print(json.dumps(result))
        return

    # Try ChromaDB semantic search first
    try:
        result = search_with_chroma(image_path, products, input_text)
        print(json.dumps(result))
        return
    except Exception as chroma_exc:  # pragma: no cover - fallback to original CLIP
        print(f'ChromaDB error: {chroma_exc}', file=sys.stderr)

    # Fallback to original CLIP-based search
    if not image_path or not os.path.exists(image_path):
        result = {
            'results': build_fallback_results(products, input_text),
            'analysis': 'CLIP image input was not provided, so the catalog fallback was used.',
            'mode': 'fallback'
        }
        print(json.dumps(result))
        return

    try:
        model, processor = load_model()
        ranked_products = get_embeddings(model, processor, image_path, products)
        result = {
            'results': ranked_products,
            'analysis': 'CLIP visual similarity matched the uploaded image to catalog products.',
            'mode': 'clip'
        }
    except Exception as exc:  # pragma: no cover - runtime fallback
        ranked_products = build_fallback_results(products, input_text)
        result = {
            'results': ranked_products,
            'analysis': f'CLIP was unavailable, so the catalog fallback was used: {exc}',
            'mode': 'fallback'
        }

    print(json.dumps(result))


if __name__ == '__main__':
    main()
