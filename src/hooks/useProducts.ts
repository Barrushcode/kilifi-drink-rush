
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCategoryFromName } from '@/utils/categoryUtils';
import { findMatchingImage } from '@/services/imageMatchingService';
import { groupProductsByBaseName, GroupedProduct } from '@/utils/productGroupingUtils';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

interface ScrapedImage {
  id: number;
  'Product Name': string | null;
  'Image URL 1': string;
  'Image URL 2': string | null;
  'Image URL 3': string | null;
  'Image URL 4': string | null;
  'Image URL 5': string | null;
  'Image URL 6': string | null;
  'Image URL 7': string | null;
  'Image URL 8': string | null;
  'Image URL 9': string | null;
  'Image URL 10': string | null;
}

export const useProducts = () => {
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [productsByOriginalOrder, setProductsByOriginalOrder] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProducts = async () => {
    const allProducts = [];
    let hasMore = true;
    let offset = 0;
    const batchSize = 1000;

    while (hasMore) {
      const { data, error } = await supabase
        .from('allthealcoholicproducts')
        .select('Title, Description, Price')
        .order('Title', { ascending: true })
        .range(offset, offset + batchSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allProducts.push(...data);
        console.log(`📦 Fetched batch ${Math.floor(offset / batchSize) + 1}: ${data.length} products (total so far: ${allProducts.length})`);
        
        if (data.length < batchSize) {
          hasMore = false;
        } else {
          offset += batchSize;
        }
      } else {
        hasMore = false;
      }
    }

    return allProducts;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Starting to fetch products...');
      const [allProductsData, imagesResponse] = await Promise.all([
        fetchAllProducts(),
        supabase
          .from('scraped product images')
          .select('id, "Product Name", "Image URL 1", "Image URL 2", "Image URL 3", "Image URL 4", "Image URL 5", "Image URL 6", "Image URL 7", "Image URL 8", "Image URL 9", "Image URL 10"')
      ]);

      if (imagesResponse.error) {
        console.error('❌ Images fetch error:', imagesResponse.error);
        throw imagesResponse.error;
      }

      const scrapedImages = imagesResponse.data || [];

      const transformedProducts: Product[] = [];
      
      // Process products in batches to avoid overwhelming the AI service
      const batchSize = 50;
      for (let i = 0; i < allProductsData.length; i += batchSize) {
        const batch = allProductsData.slice(i, i + batchSize);
        console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allProductsData.length / batchSize)}`);
        
        const batchPromises = batch.map(async (product, batchIndex) => {
          const globalIndex = i + batchIndex;
          
          if (typeof product.Price !== 'number' || isNaN(product.Price)) {
            console.warn('[🛑 MISSING OR INVALID PRICE]', product.Title, 'Raw:', product.Price);
            return null;
          }

          const productPrice = product.Price;

          if (productPrice < 100 || productPrice > 500000) {
            console.warn('[⚠️ OUT-OF-BOUNDS PRICE]', product.Title, 'Price:', productPrice);
          }

          const description = product.Description || '';
          let category = getCategoryFromName(product.Title || 'Unknown Product', productPrice);

          if (description.toLowerCase().includes('beer')) {
            category = 'Beer';
          }

          // Use the enhanced async image matching
          const { url: productImage } = await findMatchingImage(product.Title || 'Unknown Product', scrapedImages);

          return {
            id: globalIndex + 1,
            name: product.Title || 'Unknown Product',
            price: `KES ${productPrice.toLocaleString()}`,
            description,
            category,
            image: productImage
          };
        });

        const batchResults = await Promise.all(batchPromises);
        transformedProducts.push(...batchResults.filter(Boolean));
      }

      const groupedProducts = groupProductsByBaseName(transformedProducts);
      const groupedProductsOrdered = groupProductsByBaseName(transformedProducts, true);

      console.log(`✨ Successfully processed ${transformedProducts.length} products with AI-enhanced image selection`);
      console.log('🎯 Sample grouped products:', groupedProducts.slice(0, 3));

      setProducts(groupedProducts);
      setProductsByOriginalOrder(groupedProductsOrdered);
    } catch (error) {
      console.error('💥 Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    productsByOriginalOrder,
    loading,
    error,
    refetch: fetchProducts
  };
};
