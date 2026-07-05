export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  image: string;
  description?: string;
  category?: string;
  isRecommended?: boolean;
  aiReasoning?: string;
  specs?: Record<string, string>;
  reviews?: string[];
  aiSummary?: {
    pros: string[];
    cons: string[];
    verdict: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestedProducts?: Product[];
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}
