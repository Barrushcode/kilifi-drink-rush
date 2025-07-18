
export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

export interface UseOptimizedProductsParams {
  searchTerm: string;
  selectedCategory: string;
  currentPage: number;
  itemsPerPage: number;
}

export interface UseOptimizedProductsReturn {
  products: GroupedProduct[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  refetch: () => void;
}

export interface RawProduct {
  Title: string | null;
  Description: string | null;
  Price: number;
  Category: string | null;
}

import { GroupedProduct } from '@/utils/productGroupingUtils';
export type { GroupedProduct };
