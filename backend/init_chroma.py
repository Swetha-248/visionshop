#!/usr/bin/env python3
"""Initialize ChromaDB with product embeddings from the product catalog."""

import json
import sys
from pathlib import Path

try:
    import torch
    from transformers import CLIPModel, CLIPProcessor
except ImportError as exc:
    print(f'Error: Required dependencies are not installed: {exc}')
    print('Install them with: pip install torch transformers pillow chromadb')
    sys.exit(1)

from chroma_manager import ChromaDBManager, COLLECTION_NAME

CACHE_DIR = Path(__file__).resolve().parent / '.clip-cache'
MODEL_NAME = 'openai/clip-vit-base-patch32'
PRODUCTS_JSON = Path(__file__).resolve().parent / 'data' / 'products.json'


def load_model():
    """Load CLIP model and processor."""
    print('Loading CLIP model...')
    model = CLIPModel.from_pretrained(MODEL_NAME, cache_dir=str(CACHE_DIR))
    processor = CLIPProcessor.from_pretrained(MODEL_NAME, cache_dir=str(CACHE_DIR))
    print('✓ Model loaded')
    return model, processor


def get_product_embeddings(model, processor, products):
    """Generate embeddings for products."""
    print(f'Generating embeddings for {len(products)} products...')
    
    texts = [
        f"{p.get('name', '')} {p.get('brand', '')} {p.get('category', '')} {p.get('description', '')}".strip()
        for p in products
    ]
    
    with torch.no_grad():
        text_inputs = processor(text=texts, return_tensors='pt', padding=True)
        text_features = model.get_text_features(**text_inputs)
    
    text_features = text_features / text_features.norm(dim=-1, keepdim=True)
    embeddings = text_features.cpu().tolist()
    
    print(f'✓ Generated {len(embeddings)} embeddings')
    return embeddings


def load_products():
    """Load products from JSON file."""
    if not PRODUCTS_JSON.exists():
        print(f'Error: Products file not found at {PRODUCTS_JSON}')
        sys.exit(1)
    
    with open(PRODUCTS_JSON, 'r') as f:
        products = json.load(f)
    
    print(f'✓ Loaded {len(products)} products')
    return products


def main():
    """Initialize ChromaDB with product embeddings."""
    print('=' * 60)
    print('ChromaDB Initialization Script')
    print('=' * 60)
    
    # Load products
    products = load_products()
    
    # Load model
    model, processor = load_model()
    
    # Generate embeddings
    embeddings = get_product_embeddings(model, processor, products)
    
    # Initialize ChromaDB and upsert
    print('Initializing ChromaDB...')
    chroma = ChromaDBManager()
    
    # Clear existing data if any
    try:
        chroma.clear_collection()
        print('✓ Cleared existing collection')
    except Exception:
        pass  # Collection might not exist yet
    
    # Upsert products
    print('Upserting products into ChromaDB...')
    chroma.upsert_products(products, embeddings)
    
    # Verify
    info = chroma.get_collection_info()
    print(f'✓ Successfully stored {info["count"]} products in ChromaDB')
    print(f'  Collection: {info["collection"]}')
    print(f'  Storage: {info["persist_dir"]}')
    
    print('\n' + '=' * 60)
    print('Initialization complete! ChromaDB is ready for semantic search.')
    print('=' * 60)


if __name__ == '__main__':
    main()
