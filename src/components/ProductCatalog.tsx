
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

const ProductCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract categories from products
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price');

      if (error) {
        throw error;
      }

      // Transform the data and add default images and categories
      const transformedProducts: Product[] = (data || []).map((product, index) => ({
        id: product.id,
        name: product.name || 'Unknown Product',
        price: product.price || '0',
        description: product.description || '',
        category: getCategoryFromName(product.name),
        image: getDefaultImage(index)
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine category from product name
  const getCategoryFromName = (name: string): string => {
    if (!name) return 'Other';
    const lowerName = name.toLowerCase();
    if (lowerName.includes('whiskey') || lowerName.includes('whisky')) return 'Whiskey';
    if (lowerName.includes('vodka')) return 'Vodka';
    if (lowerName.includes('gin')) return 'Gin';
    if (lowerName.includes('cognac') || lowerName.includes('brandy')) return 'Cognac';
    if (lowerName.includes('beer') || lowerName.includes('lager')) return 'Beer';
    if (lowerName.includes('champagne') || lowerName.includes('prosecco')) return 'Champagne';
    if (lowerName.includes('wine')) return 'Wine';
    if (lowerName.includes('rum')) return 'Rum';
    if (lowerName.includes('tequila')) return 'Tequila';
    return 'Spirits';
  };

  // Helper function to get default images based on category
  const getDefaultImage = (index: number): string => {
    const images = [
      "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582553352566-7b4cdcc2379c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1612528443702-f6741f70a049?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1558642891-54be180ea339?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1549796014-6aa0e2eaaa43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ];
    return images[index % images.length];
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <section id="products" className="py-24 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif text-rose-600">
              Premium Collection
            </h2>
            <div className="w-16 h-px bg-barrush-copper mx-auto mb-8"></div>
            <p className="text-xl text-barrush-platinum/90 max-w-3xl mx-auto mb-12 leading-relaxed">
              Loading our curated selection...
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-glass-effect border-barrush-steel/30">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-8">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-24 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif text-rose-600">
              Premium Collection
            </h2>
            <p className="text-xl text-red-400">{error}</p>
            <Button onClick={fetchProducts} className="mt-4 bg-rose-600 hover:bg-rose-500">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif text-rose-600">
            Premium Collection
          </h2>
          <div className="w-16 h-px bg-barrush-copper mx-auto mb-8"></div>
          <p className="text-xl text-barrush-platinum/90 max-w-3xl mx-auto mb-12 leading-relaxed">
            Curated selection of the world's finest spirits and premium beverages
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <Input 
                placeholder="Search our collection..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="bg-glass-effect border-barrush-steel/40 text-barrush-platinum placeholder:text-barrush-smoke h-14 text-lg backdrop-blur-md" 
              />
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(category => (
                <Badge 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "outline"} 
                  onClick={() => setSelectedCategory(category)} 
                  className="cursor-pointer hover:bg-rose-600 transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {filteredProducts.map(product => (
            <Card 
              key={product.id} 
              className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden"
            >
              <div 
                className="h-64 bg-cover bg-center relative overflow-hidden" 
                style={{
                  backgroundImage: `url(${product.image})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/60 to-transparent group-hover:from-barrush-midnight/40 transition-all duration-300"></div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-3 font-serif text-red-200">
                  {product.name}
                </h3>
                <Badge className="bg-barrush-steel/60 text-barrush-platinum mb-4 px-3 py-1">
                  {product.category}
                </Badge>
                {product.description && (
                  <p className="text-barrush-platinum/80 mb-4 text-sm line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-barrush-platinum">
                    KES {typeof product.price === 'string' ? parseFloat(product.price).toLocaleString() : product.price}
                  </span>
                  <Button className="text-barrush-midnight font-bold px-6 py-3 transition-all duration-300 hover:scale-105 bg-rose-600 hover:bg-rose-500">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center mt-16">
            <p className="text-barrush-platinum/70 text-lg">
              No products found matching your search criteria.
            </p>
          </div>
        )}
        
        <div className="text-center mt-16">
          <div className="bg-glass-effect border border-barrush-steel/30 rounded-xl p-8 max-w-2xl mx-auto backdrop-blur-md">
            <p className="text-barrush-platinum/90 text-lg">
              <strong className="text-barrush-copper bg-slate-50">Growing Collection:</strong> Our catalog expands weekly with 
              premium selections sourced for the modern connoisseur.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
