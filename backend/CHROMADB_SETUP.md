# ChromaDB Integration Guide

This backend now uses ChromaDB for persistent vector storage and efficient semantic search of product embeddings.

## Setup

### 1. Install ChromaDB Dependencies

```bash
pip install chromadb
```

### 2. Initialize ChromaDB with Product Embeddings

Before running the backend, initialize ChromaDB with product embeddings:

```bash
python init_chroma.py
```

This will:
- Load products from `data/products.json`
- Generate CLIP embeddings for each product
- Store embeddings in ChromaDB (persisted in `.chroma/` directory)

### 3. Start the Backend

```bash
npm start
# or for development
npm run dev
```

## How It Works

### Components

- **`chroma_manager.py`**: Core ChromaDB manager class
  - `ChromaDBManager`: Handles vector storage, retrieval, and persistence
  - Methods: `upsert_products()`, `search()`, `text_search()`, `get_collection_info()`, `clear_collection()`

- **`clip_search.py`**: Updated with ChromaDB integration
  - Uses ChromaDB for semantic search first
  - Falls back to original CLIP-based search if needed
  - Supports both image and text queries

- **`init_chroma.py`**: One-time initialization script
  - Loads products from catalog
  - Generates embeddings using CLIP model
  - Persists everything to ChromaDB

### Search Modes

The system supports multiple search modes with automatic fallback:

1. **ChromaDB Semantic Search** (preferred)
   - Uses pre-computed embeddings stored in ChromaDB
   - Supports image queries (visual similarity)
   - Supports text queries (semantic search)
   - Fast retrieval with cosine distance

2. **ChromaDB Text Search**
   - Fallback when image is not provided
   - Searches product metadata and descriptions

3. **CLIP Direct Search** (legacy)
   - Real-time embedding computation
   - Used if ChromaDB is unavailable

4. **Fallback Search**
   - Simple keyword matching
   - Used if all other methods fail

## API Integration

The search endpoint continues to work as before, but now uses ChromaDB:

```bash
# Search with image upload
POST /api/search
Content-Type: multipart/form-data
- file: [image file]
- query: "comfortable shoes"

# Text-only search
GET /api/search?q=laptop
```

## Storage

- **ChromaDB Data**: `.chroma/` directory
  - Uses DuckDB + Parquet for persistence
  - Survives application restarts
  - Can be cleared by deleting the directory or calling `init_chroma.py` again

## Performance

- **First run**: Slower (generates embeddings for all products)
- **Subsequent runs**: Fast (retrieves pre-computed embeddings)
- **Memory**: Efficient vector storage with HNSW indexing
- **Scalability**: Handles hundreds of thousands of products

## Troubleshooting

### ChromaDB initialization fails
```bash
# Clear existing ChromaDB data and reinitialize
rm -rf .chroma
python init_chroma.py
```

### CLIP model download takes time
- First run downloads the CLIP model (~300MB)
- Cached in `.clip-cache/` directory
- Subsequent runs use cached model

### Out of memory during initialization
- For very large product catalogs, process in batches
- Edit `init_chroma.py` to batch products

## Configuration

Edit `chroma_manager.py` to customize:
- `COLLECTION_NAME`: Name of ChromaDB collection (default: 'products')
- `CHROMA_DB_PATH`: Storage location (default: `.chroma`)
- `hnsw:space`: Similarity metric (default: 'cosine')

## Next Steps

1. ✅ ChromaDB integration complete
2. 🔄 Optionally add API endpoints for managing embeddings
3. 🔄 Consider batch updates for real-time product catalog changes
4. 🔄 Add monitoring/analytics for search queries
