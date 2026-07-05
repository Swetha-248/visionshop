import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Search, Image as ImageIcon, Sparkles, Zap, Shield, BarChart, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import { productService } from '../services/apiService';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative px-6 pt-24 md:pt-40 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-40 blur-[130px]">
          <div className="absolute top-0 left-0 w-80 h-80 bg-primary rounded-full animate-pulse" />
          <div className="absolute bottom-40 right-0 w-[400px] h-[400px] bg-accent rounded-full animate-pulse delay-1000" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl px-6 py-2.5 rounded-full text-sm font-black border border-white/20 shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <Sparkles size={18} className="text-primary animate-float" />
            <span className="relative tracking-widest uppercase">The Future of Shopping is Here</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
          >
            Find Anything <br /> 
            <span className="text-primary italic font-serif">Instantly</span> With AI.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl text-slate-500 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Upload an image or ask naturally. Our multimodal AI understands intent, context, and style to find what you're looking for (exactly).
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8"
          >
            <form onSubmit={handleSearch} className="relative w-full max-w-xl group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex: 'White sneakers under $150'..."
                className="relative w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.2rem] px-8 py-6 pl-16 shadow-2xl focus:border-primary focus:outline-none transition-all text-xl font-medium"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={28} />
            </form>
            
            <Link to="/assistant">
              <Button size="lg" className="rounded-[2rem] h-[76px] px-10 gap-3 text-xl font-black shadow-3xl shadow-primary/30 btn-gradient">
                <ImageIcon size={24} />
                Visual Search
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16 px-4">
          <div className="space-y-2">
            <div className="text-primary font-black uppercase tracking-[0.3em] text-xs">For You</div>
            <h2 className="text-5xl font-black">Trending Now</h2>
            <p className="text-slate-400 text-lg">AI-selected products matching your recent behavior.</p>
          </div>
          <Button variant="ghost" className="font-black gap-2 h-12 text-lg">View All <ArrowRight size={20} /></Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1,2,3,4].map(i => <div key={i} className="aspect-[4/5] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[2.5rem]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* AI Intelligence Block */}
      <section className="px-6 relative">
        <div className="max-w-7xl mx-auto bg-slate-900 dark:bg-slate-950 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] -z-10" />
           <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-accent/10 blur-[120px] -z-10" />
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                 <div className="inline-flex items-center gap-3 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-black shadow-2xl shadow-primary/40">
                    <Sparkles size={20} className="animate-float" />
                    BORN FROM INTELLIGENCE
                 </div>
                 <h2 className="text-6xl md:text-7xl font-black leading-[1.1] tracking-tight">
                    Beyond Simple <br />
                    <span className="text-primary italic">Search.</span>
                 </h2>
                 <p className="text-slate-400 text-2xl font-light leading-relaxed">
                    VisionShop AI doesn't just match keywords. It understands your style, summarizes thousands of reviews in seconds, and provides honest side-by-side comparisons.
                 </p>
                 <div className="flex flex-wrap gap-6">
                    <Link to="/assistant">
                      <Button size="lg" className="h-16 px-10 rounded-2xl font-black text-lg btn-gradient">Try Assistant</Button>
                    </Link>
                    <Link to="/compare">
                      <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl font-black text-lg border-2 border-white/20 text-white hover:bg-white/5">Compare Tools</Button>
                    </Link>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6 relative">
                 {[
                   { icon: <ImageIcon size={32} />, title: 'Visual DNA', sub: 'Upload any photo to find exact or stylistic matches.' },
                   { icon: <Zap size={32} />, title: 'Insta-Summary', sub: 'Summarize 1000+ reviews into pros/cons in 0.2s.' },
                   { icon: <BarChart size={32} />, title: 'Smart Matrix', sub: 'Side-by-side comparison with AI reasoning.' },
                   { icon: <Shield size={32} />, title: 'Verified Trust', sub: 'Transparent labels for all AI-generated content.' }
                 ].map((feat, i) => (
                   <motion.div 
                     whileHover={{ y: -5 }}
                     key={i} 
                     className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-lg space-y-4 hover:border-primary/50 transition-colors cursor-default"
                   >
                      <div className="text-primary">{feat.icon}</div>
                      <h3 className="text-xl font-bold">{feat.title}</h3>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{feat.sub}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-indigo-600 to-primary rounded-[4rem] p-16 md:p-32 text-white relative overflow-hidden shadow-3xl shadow-primary/40">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[130px]" />
          <div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight">Start shopping <br /> at the speed of thought.</h2>
            <p className="text-white/70 text-2xl font-light max-w-2xl mx-auto italic">
              Join 50,000+ shoppers who saved an average of 45 minutes per purchase.
            </p>
            <Link to="/assistant">
              <Button size="lg" className="h-20 px-16 text-2xl font-black bg-white text-primary hover:bg-slate-50 rounded-3xl shadow-2xl">
                 Experience AI Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
