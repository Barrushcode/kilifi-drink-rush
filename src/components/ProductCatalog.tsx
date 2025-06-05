
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

  // Premium alcohol products with proper bottle images
  const sampleProducts: Product[] = [
    { 
      id: 1, 
      name: "Johnnie Walker Black Label", 
      price: 3500, 
      category: "Whiskey", 
      image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
    },
    { 
      id: 2, 
      name: "Grey Goose Vodka", 
      price: 2800, 
      category: "Vodka", 
      image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
    },
    { 
      id: 3, 
      name: "Hennessy VS Cognac", 
      price: 4200, 
      category: "Cognac", 
      image: "https://images.unsplash.com/photo-1582553352566-7b4cdcc2379c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
    },
    { 
      id: 4, 
      name: "Bombay Sapphire Gin", 
      price: 3200, 
      category: "Gin", 
      image: "https://images.unsplash.com/photo-1612528443702-f6741f70a049?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
    },
    { 
      id: 5, 
      name: "Tusker Premium Lager", 
      price: 2400, 
      category: "Beer", 
      image: "https://images.unsplash.com/photo-1558642891-54be180ea339?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
    },
    { 
      id: 6, 
      name: "Dom Pérignon Champagne", 
      price: 8500, 
      category: "Champagne", 
      image: "https://images.unsplash.com/photo-1549796014-6aa0e2eaaa43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
    },
  ];

  const categories = ['All', 'Whiskey', 'Vodka', 'Gin', 'Cognac', 'Beer', 'Champagne', 'Wine'];

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-barrush-charcoal via-black to-barrush-charcoal relative">
      <div className="absolute inset-0 opacity-5 bg-wood-texture"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-barrush-gold mb-6 font-serif">
            Premium Collection
          </h2>
          <div className="w-24 h-0.5 bg-barrush-gold mx-auto mb-8"></div>
          <p className="text-xl text-barrush-cream/90 max-w-3xl mx-auto mb-12 leading-relaxed">
            Curated selection of the world's finest spirits, wines, and premium beverages
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <Input
                placeholder="Search our collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/40 border-barrush-gold/30 text-barrush-cream placeholder:text-barrush-cream/50 h-14 text-lg backdrop-blur-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer px-6 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category 
                      ? "bg-barrush-gold text-black hover:bg-barrush-gold/90" 
                      : "border-barrush-gold/40 text-barrush-gold hover:bg-barrush-gold/20 hover:border-barrush-gold"
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {filteredProducts.map(product => (
            <Card 
              key={product.id}
              className="bg-gradient-to-b from-barrush-burgundy/20 to-black/60 border-barrush-gold/30 border-2 hover:border-barrush-gold transition-all duration-500 hover:scale-105 backdrop-blur-sm group overflow-hidden"
            >
              <div 
                className="h-64 bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url(${product.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-barrush-gold mb-3 font-serif">
                  {product.name}
                </h3>
                <Badge className="bg-barrush-burgundy/60 text-barrush-cream mb-4 px-3 py-1">
                  {product.category}
                </Badge>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-barrush-cream">
                    KES {product.price.toLocaleString()}
                  </span>
                  <Button 
                    className="bg-barrush-gold hover:bg-barrush-gold/90 text-black font-bold px-6 py-3 transition-all duration-300 hover:scale-105"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-barrush-gold/10 via-barrush-burgundy/20 to-barrush-gold/10 border border-barrush-gold/30 rounded-xl p-8 max-w-2xl mx-auto backdrop-blur-sm">
            <p className="text-barrush-cream/90 text-lg">
              <strong className="text-barrush-gold">Expanding Collection:</strong> Our catalog grows weekly with 
              rare finds and premium selections sourced globally for the discerning connoisseur.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
