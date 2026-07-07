"""ChromaDB manager for handling vector storage and retrieval of product embeddings."""

import json
import os
from pathlib import Path
from typing import List, Dict, Any, Optional

try:
    import chromadb
    from chromadb.config import Settings
except ImportError:
    chromadb = None
    Settings = None


CHROMA_DB_PATH = Path(__file__).resolve().parent / '.chroma'
COLLECTION_NAME = 'products'


class ChromaDBManager:
    """Manages ChromaDB vector storage for product embeddings."""

    def __init__(self, persist_dir: Optional[str] = None):
        """Initialize ChromaDB manager.
        
        Args:
            persist_dir: Directory to persist ChromaDB data. Defaults to .chroma
        """
        if chromadb is None:
            raise RuntimeError('ChromaDB is not installed. Install it with: pip install chromadb')
        
        self.persist_dir = persist_dir or str(CHROMA_DB_PATH)
        os.makedirs(self.persist_dir, exist_ok=True)
        
        # Initialize ChromaDB client with persistence
        settings = Settings(
            chroma_db_impl='duckdb+parquet',
            persist_directory=self.persist_dir,
            anonymized_telemetry=False
        )
        self.client = chromadb.Client(settings)
        
        # Get or create collection
        try:
            self.collection = self.client.get_collection(name=COLLECTION_NAME)
        except Exception:
            self.collection = self.client.create_collection(
                name=COLLECTION_NAME,
                metadata={'hnsw:space': 'cosine'}
            )

    def upsert_products(self, products: List[Dict[str, Any]], embeddings: List[List[float]]) -> None:
        """Upsert products with their embeddings into ChromaDB.
        
        Args:
            products: List of product dictionaries
            embeddings: List of embeddings corresponding to products
        """
        if len(products) != len(embeddings):
            raise ValueError('Number of products and embeddings must match')
        
        ids = [str(p.get('id', i)) for i, p in enumerate(products)]
        metadatas = [
            {
                'name': p.get('name', ''),
                'brand': p.get('brand', ''),
                'category': p.get('category', ''),
                'price': str(p.get('price', '')),
                'image': p.get('image', ''),
                'isRecommended': str(p.get('isRecommended', False))
            }
            for p in products
        ]
        
        # Create documents for full-text search
        documents = [
            f"{p.get('name', '')} {p.get('brand', '')} {p.get('category', '')} {p.get('description', '')}".strip()
            for p in products
        ]
        
        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )

    def search(
        self,
        query_embedding: List[float],
        n_results: int = 6,
        category_filter: Optional[str] = None
    ) -> Dict[str, Any]:
        """Search for similar products using embeddings.
        
        Args:
            query_embedding: Query embedding vector
            n_results: Number of results to return
            category_filter: Optional category to filter by
            
        Returns:
            Dictionary with search results
        """
        where = None
        if category_filter:
            where = {'category': category_filter}
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where,
            include=['embeddings', 'documents', 'distances', 'metadatas']
        )
        
        # Format results
        products = []
        if results['ids'] and len(results['ids']) > 0:
            for i, id_ in enumerate(results['ids'][0]):
                metadata = results['metadatas'][0][i]
                distance = results['distances'][0][i]
                # Convert cosine distance to similarity (0-1)
                similarity = 1 - (distance / 2)
                
                products.append({
                    'id': id_,
                    'name': metadata.get('name', ''),
                    'brand': metadata.get('brand', ''),
                    'category': metadata.get('category', ''),
                    'price': metadata.get('price', ''),
                    'image': metadata.get('image', ''),
                    'isRecommended': metadata.get('isRecommended', '') == 'True',
                    'similarity': round(similarity, 4)
                })
        
        return {
            'results': products,
            'count': len(products)
        }

    def text_search(self, query_text: str, n_results: int = 6) -> Dict[str, Any]:
        """Search for products using text query (metadata search).
        
        Args:
            query_text: Text query to search for
            n_results: Number of results to return
            
        Returns:
            Dictionary with search results
        """
        # Simple text search through metadata
        all_results = self.collection.get(include=['documents', 'metadatas'])
        
        query_lower = query_text.lower()
        scored_results = []
        
        for i, (id_, doc, metadata) in enumerate(zip(
            all_results['ids'],
            all_results['documents'],
            all_results['metadatas']
        )):
            score = 0
            searchable_text = f"{doc or ''} {metadata.get('name', '')} {metadata.get('brand', '')}".lower()
            
            # Scoring based on matches
            if query_lower in searchable_text:
                score += 10
            
            for word in query_lower.split():
                if len(word) > 2 and word in searchable_text:
                    score += 5
            
            if score > 0:
                scored_results.append((id_, metadata, score))
        
        # Sort by score and return top results
        scored_results.sort(key=lambda x: x[2], reverse=True)
        products = [
            {
                'id': id_,
                'name': metadata.get('name', ''),
                'brand': metadata.get('brand', ''),
                'category': metadata.get('category', ''),
                'price': metadata.get('price', ''),
                'image': metadata.get('image', ''),
                'isRecommended': metadata.get('isRecommended', '') == 'True'
            }
            for id_, metadata, _ in scored_results[:n_results]
        ]
        
        return {
            'results': products,
            'count': len(products)
        }

    def get_collection_info(self) -> Dict[str, Any]:
        """Get information about the collection."""
        count = self.collection.count()
        return {
            'collection': COLLECTION_NAME,
            'count': count,
            'persist_dir': self.persist_dir
        }

    def clear_collection(self) -> None:
        """Clear all data from the collection."""
        self.client.delete_collection(name=COLLECTION_NAME)
        self.collection = self.client.create_collection(
            name=COLLECTION_NAME,
            metadata={'hnsw:space': 'cosine'}
        )
