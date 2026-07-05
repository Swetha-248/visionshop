import axios from 'axios';
import type { Product } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getProducts: async () => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },
  
  getProductById: async (id: string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
  
  searchProducts: async (query: string) => {
    const response = await api.get<Product[]>(`/search?q=${query}`);
    return response.data;
  },
  
  visualSearch: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.post<{ analysis: string; results: Product[] }>('/search/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const aiService = {
  chat: async (message: string) => {
    const response = await api.post<{ response: string; suggestedProducts?: Product[] }>('/chat', { message });
    return response.data;
  },
  
  visualSearch: async () => {
    // In a real app, this might take an image, but for simulated demo we just call the endpoint
    const response = await api.post<{ analysis: string; results: Product[] }>('/search/image');
    return response.data;
  }
};

export default api;
