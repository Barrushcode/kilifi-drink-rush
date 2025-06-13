
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCategoryFromName } from '@/utils/categoryUtils';
import { findMatchingImage } from '@/services/imageMatchingService';

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
  const [products, setProducts] = useState<Product[]>([]);
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
        .order('Price', { ascending: false })
        .range(offset, offset + batchSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allProducts.push(...data);
        console.log(`📦 Fetched batch ${Math.floor(offset / batchSize) + 1}: ${data.length} products (total so far: ${allProducts.length})`);
        
        // If we got less than batchSize, we've reached the end
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
      
      console.log('🚀 Fetching ALL products from your complete inventory...');
      
      // Fetch all products using pagination and scraped images in parallel
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

      console.log(`🎉 Successfully fetched ALL ${allProductsData.length} products from your complete inventory`);
      console.log(`🖼️ Successfully fetched ${imagesResponse.data?.length} images with quality filtering enabled`);

      const scrapedImages = imagesResponse.data || [];

      // Transform the products data and match with high-quality images
      const transformedProducts: Product[] = allProductsData.map((product, index) => {
        const productPrice = Number(product.Price) || 0;
        const category = getCategoryFromName(product.Title || 'Unknown Product', productPrice);
        const { url: productImage, matchLevel } = findMatchingImage(product.Title || 'Unknown Product', scrapedImages);
        
        if (index < 10) { // Log first 10 for debugging
          console.log(`📊 Product: "${product.Title}" | Price: ${productPrice} | Category: ${category} | Image Quality: ${matchLevel}`);
        }
        
        return {
          id: index + 1,
          name: product.Title || 'Unknown Product',
          price: `KES ${productPrice.toLocaleString()}`,
          description: product.Description || 'Quality selection for every taste',
          category,
          image: productImage
        };
      });

      console.log(`✨ Successfully processed ALL ${transformedProducts.length} products with enhanced clean image matching`);
      setProducts(transformedProducts);
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
    loading,
    error,
    refetch: fetchProducts
  };
};
