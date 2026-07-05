import React from 'react';
import { X, Plus, Sparkles, Check, Info, Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare } = useStore();
  
  // Extract all unique spec keys from the products in compareList
  const allSpecKeys = Array.from(new Set(
    compareList.flatMap(p => Object.keys(p.specs || {}))
  ));

  if (compareList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center space-y-8">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto text-slate-400">
           <Plus size={48} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black">Your comparison list is empty</h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto">Add up to 4 products to see a side-by-side AI powered analysis and find the perfect match.</p>
        </div>
        <Link to="/">
          <Button size="lg" className="rounded-2xl gap-2 font-black">
            <ArrowLeft size={20} />
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
           <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">
              <Sparkles size={14} />
              AI COMPARISON
           </div>
           <h1 className="text-5xl font-black tracking-tight">Side-by-Side Analysis</h1>
           <p className="text-slate-500 font-medium text-lg">Detailed breakdown to help you decide faster.</p>
        </div>
        <div className="flex gap-4">
           <Link to="/">
             <Button variant="outline" className="rounded-2xl gap-2 h-12 font-bold px-6">
                <Plus size={20} />
                Add more
             </Button>
           </Link>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="relative overflow-x-auto rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900/80 backdrop-blur-xl">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr>
                <th className="p-10 bg-slate-50/50 dark:bg-slate-800/30 w-72 border-r border-slate-100 dark:border-slate-800">
                   <div className="space-y-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Matrix</span>
                     <div className="h-1 w-12 bg-primary rounded-full" />
                   </div>
                </th>
                <AnimatePresence mode="popLayout">
                  {compareList.map(p => (
                    <motion.th 
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-8 relative min-w-[280px] border-r last:border-r-0 border-slate-100 dark:border-slate-800 group/th"
                    >
                      <button 
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all scale-0 group-hover/th:scale-100"
                      >
                         <X size={16} />
                      </button>
                      <div className="space-y-6">
                         <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{p.brand}</p>
                            <h3 className="font-bold text-xl line-clamp-1">{p.name}</h3>
                            <p className="text-3xl font-black mt-2 text-slate-900 dark:text-white">${p.price.toLocaleString()}</p>
                         </div>
                         <Button className="w-full h-12 rounded-2xl font-black gap-2">
                           <ShoppingCart size={18} />
                           Add to Cart
                         </Button>
                      </div>
                    </motion.th>
                  ))}
                </AnimatePresence>
                {compareList.length < 4 && (
                  <th className="p-8 bg-slate-50/20 dark:bg-slate-800/10 border-r last:border-r-0 border-slate-100 dark:border-slate-800">
                     <Link to="/" className="h-full flex flex-col items-center justify-center gap-4 text-slate-400 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] min-h-[400px] hover:border-primary/30 hover:bg-primary/5 transition-all group/add">
                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover/add:scale-110 transition-transform">
                          <Plus size={32} />
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest">Add Device</span>
                     </Link>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="font-medium text-slate-700 dark:text-slate-300">
              <tr>
                 <td className="p-10 font-black bg-slate-50/50 dark:bg-slate-800/30 border-r border-b border-slate-100 dark:border-slate-800 italic uppercase text-xs tracking-widest">
                    Avg. Rating
                 </td>
                 {compareList.map(p => (
                   <td key={p.id} className="p-10 border-r last:border-r-0 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 font-black text-xl text-yellow-500">
                         <Star size={24} className="fill-current" />
                         {p.rating}
                      </div>
                   </td>
                 ))}
                 {compareList.length < 4 && <td className="bg-slate-50/10 p-10 border-b border-slate-100 dark:border-slate-800" />}
              </tr>
              {allSpecKeys.map((key) => (
                <tr key={key} className="group/row hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                   <td className="p-10 font-black bg-slate-50/50 dark:bg-slate-800/30 border-r border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs uppercase tracking-widest">
                      {key}
                   </td>
                   {compareList.map(p => (
                     <td key={p.id} className="p-10 border-r last:border-r-0 border-b border-slate-100 dark:border-slate-800 text-lg">
                        {(p.specs as any)[key] || <span className="text-slate-300">—</span>}
                     </td>
                   ))}
                   {compareList.length < 4 && <td className="bg-slate-50/10 p-10 border-b border-slate-100 dark:border-slate-800" />}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Comparison Insight Section */}
      {compareList.length >= 2 && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl"
        >
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <Sparkles size={200} className="text-primary" />
           </div>
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-3 flex flex-col items-center lg:items-start gap-4">
                 <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-3xl shadow-primary/40">
                    <Sparkles size={48} className="text-white animate-float" />
                 </div>
                 <div className="text-center lg:text-left">
                   <span className="font-black text-[10px] uppercase tracking-[0.3em] text-primary">AI Recommendation Engine</span>
                   <h2 className="text-4xl font-black italic mt-2">The Verdict</h2>
                 </div>
              </div>
              
              <div className="lg:col-span-9 space-y-8 lg:pl-12 lg:border-l border-white/10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all group">
                       <div className="flex items-center gap-3 text-primary font-black uppercase text-xs tracking-widest">
                          <Info size={18} />
                          Best All-Rounder
                       </div>
                       <p className="text-slate-300 text-lg leading-relaxed">
                          Based on specs and reviews, <span className="text-white font-bold">{compareList.sort((a,b) => b.rating - a.rating)[0].name}</span> offers the highest reliability for long-term use.
                       </p>
                    </div>
                    
                    <div className="space-y-4 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-accent/30 transition-all">
                       <div className="flex items-center gap-3 text-accent font-black uppercase text-xs tracking-widest">
                          <Check size={18} />
                          Value Winner
                       </div>
                       <p className="text-slate-300 text-lg leading-relaxed">
                          For those mindful of budget without sacrificing key features, <span className="text-white font-bold">{compareList.sort((a,b) => a.price - b.price)[0].name}</span> is the optimized choice.
                       </p>
                    </div>
                 </div>
                 
                 <div className="pt-4 p-8 bg-primary/10 rounded-3xl border border-primary/20 italic text-xl font-serif text-slate-300">
                    "If you prioritize {Object.keys(compareList[0].specs || {})[0]}, we recommend the {compareList[0].name}. However, the {compareList[1].name} excels in {Object.keys(compareList[1].specs || {})[1] || 'versatility'}. Select based on your primary use-case."
                 </div>
              </div>
           </div>
        </motion.div>
      )}
    </div>
  );
};

export default ComparePage;
