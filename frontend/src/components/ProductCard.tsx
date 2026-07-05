import React from 'react';
import { Star, ShoppingCart, Eye, Sparkles, Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCompare, compareList } = useStore();
  const isCompared = compareList.some(p => p.id === product.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="neo-card flex flex-col h-full group relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] m-2">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Chips */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isRecommended && (
            <div className="bg-primary/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-xl animate-pulse">
              <Sparkles size={12} />
              AI PICK
            </div>
          )}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-xl">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            {product.rating}
          </div>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <Link to={`/product/${product.id}`}>
            <Button variant="secondary" size="sm" className="rounded-full w-12 h-12 p-0 bg-white/20 hover:bg-white/40 border-white/30 text-white">
              <Eye size={20} />
            </Button>
          </Link>
          <Button 
            onClick={() => addToCompare(product)}
            disabled={isCompared}
            variant="secondary" 
            size="sm" 
            className={`rounded-full w-12 h-12 p-0 bg-white/20 hover:bg-white/40 border-white/30 text-white ${isCompared ? 'opacity-50 grayscale' : ''}`}
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>
      
      <div className="p-6 pt-2 flex flex-col flex-1">
        <div className="space-y-1 mb-4">
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">{product.brand}</p>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.aiReasoning && (
            <p className="text-[11px] text-slate-500 italic line-clamp-2 leading-relaxed">
              "{product.aiReasoning}"
            </p>
          )}
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div>
             <span className="text-2xl font-black text-slate-900 dark:text-white">
               ${product.price.toFixed(2)}
             </span>
          </div>
          <Button variant="primary" size="sm" className="rounded-xl px-4 h-10 font-bold gap-2">
            <ShoppingCart size={16} />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
