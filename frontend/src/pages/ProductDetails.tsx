import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Star, ShieldCheck, Truck, RefreshCcw, Sparkles, Plus, Heart, Check, X, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';
import { productService } from '../services/apiService';
import { motion } from 'framer-motion';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [productData, allProducts] = await Promise.all([
          productService.getProductById(id),
          productService.getProducts()
        ]);
        setProduct(productData);
        setRelated(allProducts.filter((item: Product) => item.id !== id).slice(0, 4));
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl relative group">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-primary transition-all hover:scale-105">
                <img src={product.image} alt="Thumb" className="w-full h-full object-cover opacity-60 hover:opacity-100" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">
              <Sparkles size={14} />
              {product.brand}
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">{product.name}</h1>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-600 px-4 py-1.5 rounded-full font-black text-lg">
                  <Star size={18} className="fill-current" />
                  {product.rating}
               </div>
               <span className="text-slate-400 font-medium italic underline underline-offset-4 decoration-dotted font-serif">Verified AI Sentiment: Positive</span>
            </div>
          </div>

          <p className="text-xl text-slate-500 leading-relaxed font-light">
            {product.description}
          </p>

          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-black text-slate-900 dark:text-white">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-slate-400 line-through text-xl">${(product.price * 1.2).toFixed(2)}</span>
          </div>

          <div className="flex flex-wrap gap-4">
             <Button size="lg" className="flex-[2] h-16 text-lg rounded-2xl font-black btn-gradient">Add to Cart</Button>
             <Button variant="outline" size="lg" className="flex-1 h-16 text-lg rounded-2xl gap-2 font-bold border-2">
                <Plus size={20} />
                Compare
             </Button>
             <button className="w-16 h-16 flex items-center justify-center border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all hover:scale-110 active:scale-95 shadow-sm">
                <Heart size={24} className="text-slate-400 hover:text-red-500 fill-current transition-colors" />
             </button>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6">
             {[
               { icon: <Truck size={22} />, text: 'Express Delivery', sub: 'Tomorrow, Oct 24' },
               { icon: <ShieldCheck size={22} />, text: 'Warranty', sub: '2-Year Protection' },
               { icon: <RefreshCcw size={22} />, text: 'Returns', sub: '30-Day Policy' },
               { icon: <Sparkles size={22} />, text: 'AI Optimized', sub: 'Smart Reasoning' }
             ].map((item, i) => (
               <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
                  <div className="text-primary mt-1">{item.icon}</div>
                  <div>
                    <div className="text-sm font-bold">{item.text}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{item.sub}</div>
                  </div>
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* AI Review Summary Section */}
      {product.aiSummary && (
        <section className="relative">
          <div className="absolute inset-0 bg-primary/5 blur-[120px] -z-10 rounded-full scale-75" />
          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-2xl border border-primary/20 rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <Sparkles size={300} className="text-primary" />
            </div>
            
            <div className="relative z-10 space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-xs font-black tracking-[0.1em] shadow-lg shadow-primary/20">
                    <Sparkles size={16} />
                    AI INTELLIGENCE
                  </div>
                  <h2 className="text-4xl font-black">Review Sentiment Analysis</h2>
                </div>
                <div className="text-right">
                  <div className="text-primary text-5xl font-black">94%</div>
                  <div className="text-slate-400 text-sm font-bold">Positive Sentiment Score</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Pros */}
                <div className="space-y-6">
                  <h3 className="text-lg font-black flex items-center gap-2 text-green-500">
                    <Check className="bg-green-500/10 rounded-full p-1" size={24} />
                    PROS
                  </h3>
                  <ul className="space-y-4">
                    {product.aiSummary.pros.map((pro, i) => (
                      <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="space-y-6">
                  <h3 className="text-lg font-black flex items-center gap-2 text-red-500">
                    <X className="bg-red-500/10 rounded-full p-1" size={24} />
                    CONS
                  </h3>
                  <ul className="space-y-4">
                    {product.aiSummary.cons.map((con, i) => (
                      <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Verdict */}
                <div className="lg:pl-8 lg:border-l border-slate-100 dark:border-slate-800 space-y-6">
                  <h3 className="text-lg font-black flex items-center gap-2 text-primary">
                    <ArrowRight className="bg-primary/10 rounded-full p-1" size={24} />
                    THE VERDICT
                  </h3>
                  <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
                    <p className="text-xl font-serif italic text-slate-700 dark:text-slate-200 leading-relaxed">
                      "{product.aiSummary.verdict}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-10">
         <div className="space-y-10">
            <h3 className="text-3xl font-black italic">Specifications</h3>
            <div className="grid gap-6">
               {product.specs && Object.entries(product.specs).map(([label, value], i) => (
                 <div key={i} className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-6 group">
                    <span className="text-primary text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{label}</span>
                    <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</span>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="bg-slate-900 rounded-[3rem] p-12 text-white space-y-8 relative overflow-hidden group shadow-2xl">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/20 blur-[100px] group-hover:bg-primary/30 transition-all" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-4xl font-black leading-tight italic">Ask AI about <br /> this product</h3>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Found a technical detail missing? Want to know if it fits your specific setup? Our assistant is ready to help.
              </p>
              <div className="relative pt-4">
                 <input 
                   type="text" 
                   placeholder="Is this compatible with X?" 
                   className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-[1.5rem] px-8 py-6 pr-20 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium"
                 />
                 <button className="absolute right-3 top-[calc(50%+8px)] -translate-y-1/2 w-14 h-14 bg-primary rounded-[1rem] flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all text-white">
                    <Sparkles size={24} />
                 </button>
              </div>
            </div>
         </div>
      </div>

      {/* Related Products */}
      <div className="space-y-12">
         <div className="flex items-end justify-between">
            <h3 className="text-4xl font-black">Related Products</h3>
            <Button variant="ghost" className="font-bold gap-2">View All <ArrowRight size={18} /></Button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
         </div>
      </div>
    </div>
  );
};

export default ProductDetails;
