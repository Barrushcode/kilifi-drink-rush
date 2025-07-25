import React from 'react';
import { useOptimizedProducts } from '@/hooks/useOptimizedProducts';
import GroupedProductCard from '@/components/GroupedProductCard';
import { Loader } from 'lucide-react';

const TequilaProductsSection: React.FC = () => {
  const { products, loading, error } = useOptimizedProducts({
    searchTerm: '',
    selectedCategory: 'Tequila',
    currentPage: 1,
    itemsPerPage: 12
  });

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-barrush-slate to-barrush-midnight">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif text-barrush-platinum mb-4">
              Premium Tequila Collection
            </h2>
            <div className="w-24 h-0.5 bg-neon-pink mx-auto mb-6"></div>
            <p className="text-lg text-barrush-platinum/80 max-w-2xl mx-auto">
              Discover our exclusive tequila selection with special discounted prices
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-neon-pink" />
            <span className="ml-2 text-barrush-platinum">Loading tequila products...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null; // Don't show section if no tequila products or error
  }

  return (
    <section className="py-20 bg-gradient-to-b from-barrush-slate to-barrush-midnight">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-serif text-barrush-platinum mb-4">
            Premium Tequila Collection
          </h2>
          <div className="w-24 h-0.5 bg-neon-pink mx-auto mb-6"></div>
          <p className="text-lg text-barrush-platinum/80 max-w-2xl mx-auto">
            Discover our exclusive tequila selection with special discounted prices
          </p>
          <div className="mt-4 inline-block bg-neon-pink/20 border border-neon-pink rounded-full px-4 py-2">
            <span className="text-neon-pink font-semibold text-sm">🔥 Special Discounted Prices</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6 xl:gap-8 max-w-full mx-auto pb-8 lg:pb-12">
          {products.map(product => (
            <GroupedProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TequilaProductsSection;