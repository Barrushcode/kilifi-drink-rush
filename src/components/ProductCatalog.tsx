
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

const ProductCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sample products - in real implementation, this would come from Excel upload
  const sampleProducts: Product[] = [
    { id: 1, name: "Johnnie Walker Black Label", price: 3500, category: "Whiskey", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3" },
    { id: 2, name: "Absolut Vodka", price: 2800, category: "Vodka", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3" },
    { id: 3, name: "Hennessy VS", price: 4200, category: "Cognac", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3" },
    { id: 4, name: "Bombay Sapphire Gin", price: 3200, category: "Gin", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3" },
    { id: 5, name: "Tusker Beer (24 Pack)", price: 2400, category: "Beer", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3" },
    { id: 6, name: "Jameson Irish Whiskey", price: 3800, category: "Whiskey", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3" },
  ];

  const categories = ['All', 'Whiskey', 'Vodka', 'Gin', 'Cognac', 'Beer', 'Wine'];

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="products" className="py-20 bg-barrush-charcoal">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-6">
            Our Product Catalog
          </h2>
          <p className="text-xl text-barrush-cream max-w-2xl mx-auto mb-8">
            Premium selection of wines, spirits, beers, and mixers
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream placeholder:text-barrush-cream/60"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedCategory === category 
                      ? "bg-barrush-gold text-barrush-charcoal" 
                      : "border-barrush-gold text-barrush-gold hover:bg-barrush-gold hover:text-barrush-charcoal"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredProducts.map(product => (
            <Card 
              key={product.id}
              className="bg-barrush-burgundy/20 border-barrush-burgundy border hover:border-barrush-gold transition-all duration-300 hover:scale-105"
            >
              <div 
                className="h-48 bg-cover bg-center rounded-t-lg"
                style={{ backgroundImage: `url(${product.image})` }}
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-barrush-gold mb-2">
                  {product.name}
                </h3>
                <Badge className="bg-barrush-burgundy text-barrush-cream mb-3">
                  {product.category}
                </Badge>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-barrush-cream">
                    KES {product.price.toLocaleString()}
                  </span>
                  <Button 
                    className="bg-barrush-gold hover:bg-barrush-gold/90 text-barrush-charcoal font-semibold"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-barrush-gold/10 border border-barrush-gold rounded-lg p-6 max-w-md mx-auto">
            <p className="text-barrush-cream">
              <strong className="text-barrush-gold">Coming Soon:</strong> Upload your Excel catalog 
              with 2000+ products for automatic image fetching and display
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
