
import React, { useState, useEffect, useMemo } from 'react';
import { GroupedProduct } from '@/utils/productGroupingUtils';

interface UseProductFiltersProps {
  products: GroupedProduct[];
  selectedCategory: string;
  actualSearchTerm: string;
}

export const useProductFilters = ({ products, selectedCategory, actualSearchTerm }: UseProductFiltersProps) => {
  // Simple price filtering (client-side for the current page products)
  const priceList = useMemo(() => {
    return products
      .map(product => {
        return product.lowestPrice
          ? typeof product.lowestPrice === 'number'
            ? product.lowestPrice
            : Number(String(product.lowestPrice).replace(/[^\d]/g, ''))
          : 0;
      })
      .filter(price => !isNaN(price) && price > 0)
      .sort((a, b) => a - b);
  }, [products]);

  const minPriceAvailable = priceList.length > 0 ? priceList[0] : 0;
  const maxPriceAvailable = priceList.length > 0 ? priceList[priceList.length - 1] : 100000;
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceAvailable,
    maxPriceAvailable,
  ]);

  // Reset price filter range when category or search changes
  useEffect(() => {
    setPriceRange([minPriceAvailable, maxPriceAvailable]);
  }, [minPriceAvailable, maxPriceAvailable, selectedCategory, actualSearchTerm]);

  // Price filtering (client-side for current page)
  const priceFilteredProducts = useMemo(() => {
    return products.filter(prod => {
      const priceNum = prod.lowestPrice
        ? typeof prod.lowestPrice === 'number'
          ? prod.lowestPrice
          : Number(String(prod.lowestPrice).replace(/[^\d]/g, ''))
        : 0;
      return priceNum >= priceRange[0] && priceNum <= priceRange[1];
    });
  }, [products, priceRange]);

  const showPriceFilter = priceList.length > 1;

  return {
    priceRange,
    setPriceRange,
    minPriceAvailable,
    maxPriceAvailable,
    priceFilteredProducts,
    showPriceFilter
  };
};
