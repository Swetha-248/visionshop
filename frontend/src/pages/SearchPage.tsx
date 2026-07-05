import React, { useEffect, useState } from 'react';
import { Upload, X, Filter, SlidersHorizontal, Search as SearchIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/apiService';
import type { Product } from '../types';

const SearchPage: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [analysis, setAnalysis] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadCatalogProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
      setAnalysis('Showing products from the catalog. Upload an image to find closer matches.');
    } catch (error) {
      console.error('Error loading products', error);
    }
  };

  useEffect(() => {
    void loadCatalogProducts();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        void handleSearch(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async (file?: File | null) => {
    const activeFile = file ?? selectedFile;

    if (!activeFile) {
      await loadCatalogProducts();
      return;
    }

    setIsSearching(true);

    try {
      const data = await productService.visualSearch(activeFile);
      setProducts(data.results);
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error searching products', error);
      setAnalysis('The search service is unavailable right now. Showing catalog results instead.');
      await loadCatalogProducts();
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        {/* Upload Area */}
        <div className="w-full md:w-1/3 lg:w-1/4 sticky top-24">
          {!image ? (
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 transition-all ${
                dragActive ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                <Upload size={32} />
              </div>
              <div>
                <p className="font-bold">Drag & Drop Image</p>
                <p className="text-sm text-slate-500">or click to browse from device</p>
              </div>
              <input type="file" className="hidden" id="image-upload" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setImage(ev.target?.result as string);
                    void handleSearch(file);
                  };
                  reader.readAsDataURL(file);
                }
              }} />
              <label htmlFor="image-upload" className="w-full">
                <Button variant="outline" className="w-full pointer-events-none">Select File</Button>
              </label>
            </div>
          ) : (
            <div className="relative group rounded-3xl overflow-hidden border-2 border-primary shadow-xl">
              <img src={image} alt="Preview" className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary" onClick={() => {
                  setImage(null);
                  setSelectedFile(null);
                  void loadCatalogProducts();
                }}>
                  <X size={18} className="mr-2" /> Change Image
                </Button>
              </div>
            </div>
          )}

          {image && (
             <Button 
                onClick={() => { void handleSearch(); }}
                isLoading={isSearching}
                className="w-full mt-4 h-14 text-lg"
             >
                <SearchIcon size={20} className="mr-2" /> Search Similar
             </Button>
          )}

          <div className="mt-8 space-y-6 hidden md:block">
             <h3 className="font-bold text-lg flex items-center gap-2">
                <Filter size={20} />
                Filters
             </h3>
             <div className="space-y-4">
                {['Price Range', 'Brand', 'Category', 'Rating'].map((f) => (
                   <div key={f} className="pb-4 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-medium mb-2">{f}</p>
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full" />
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">
              {isSearching ? 'Analyzing Image...' : (image ? 'Similar Products Found' : 'All Products')}
            </h1>
            <div className="flex gap-2">
               <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                  <SlidersHorizontal size={16} />
               </Button>
               <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm px-4 py-2 focus:ring-0">
                  <option>Sort by: Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
               </select>
            </div>
          </div>

          {analysis && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{analysis}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isSearching ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-3xl aspect-[4/5] animate-pulse" />
              ))
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
