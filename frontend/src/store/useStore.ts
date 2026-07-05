import { create } from 'zustand';
import type { Product, ChatMessage } from '../types';

interface StoreState {
  wishlist: Product[];
  compareList: Product[];
  chatHistory: ChatMessage[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
}

export const useStore = create<StoreState>((set) => ({
  wishlist: [],
  compareList: [],
  chatHistory: [],
  
  addToWishlist: (product) => set((state) => ({
    wishlist: state.wishlist.some(p => p.id === product.id)
      ? state.wishlist
      : [...state.wishlist, product]
  })),
  
  removeFromWishlist: (id) => set((state) => ({
    wishlist: state.wishlist.filter(p => p.id !== id)
  })),
  
  addToCompare: (product) => set((state) => ({
    compareList: state.compareList.length < 4 && !state.compareList.some(p => p.id === product.id)
      ? [...state.compareList, product]
      : state.compareList
  })),
  
  removeFromCompare: (id) => set((state) => ({
    compareList: state.compareList.filter(p => p.id !== id)
  })),
  
  addChatMessage: (msg) => set((state) => ({
    chatHistory: [...state.chatHistory, msg]
  })),
  
  clearChat: () => set({ chatHistory: [] }),
}));
