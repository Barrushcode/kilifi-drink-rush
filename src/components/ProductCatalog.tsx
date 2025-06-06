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
  const sampleProducts: Product[] = [{
    id: 1,
    name: "Johnnie Walker Black Label",
    price: 3500,
    category: "Whiskey",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }, {
    id: 2,
    name: "Grey Goose Vodka",
    price: 2800,
    category: "Vodka",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }, {
    id: 3,
    name: "Hennessy VS Cognac",
    price: 4200,
    category: "Cognac",
    image: "https://images.unsplash.com/photo-1582553352566-7b4cdcc2379c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }, {
    id: 4,
    name: "Bombay Sapphire Gin",
    price: 3200,
    category: "Gin",
    image: "https://images.unsplash.com/photo-1612528443702-f6741f70a049?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }, {
    id: 5,
    name: "Tusker Premium Lager",
    price: 2400,
    category: "Beer",
    image: "https://images.unsplash.com/photo-1558642891-54be180ea339?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }, {
    id: 6,
    name: "Dom Pérignon Champagne",
    price: 8500,
    category: "Champagne",
    image: "https://images.unsplash.com/photo-1549796014-6aa0e2eaaa43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }];
  const categories = ['All', 'Whiskey', 'Vodka', 'Gin', 'Cognac', 'Beer', 'Champagne', 'Wine'];
  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return <section id="products" className="py-24 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative">
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
              <Input placeholder="Search our collection..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-glass-effect border-barrush-steel/40 text-barrush-platinum placeholder:text-barrush-smoke h-14 text-lg backdrop-blur-md" />
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(category => <Badge key={category} variant={selectedCategory === category ? "default" : "outline"} className={`cursor-pointer px-6 py-2 text-sm font-medium transition-all duration-300 ${selectedCategory === category ? "bg-barrush-copper text-barrush-midnight hover:bg-barrush-copper/90" : "border-barrush-steel/40 text-barrush-copper hover:bg-barrush-copper/20 hover:border-barrush-copper"}`} onClick={() => setSelectedCategory(category)}>
                  {category}
                </Badge>)}
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {filteredProducts.map(product => <Card key={product.id} className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
              <div className="h-64 bg-cover bg-center relative overflow-hidden" style={{
            backgroundImage: `url(${product.image})`
          }}>
                <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/60 to-transparent group-hover:from-barrush-midnight/40 transition-all duration-300"></div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-3 font-serif text-red-200">
                  {product.name}
                </h3>
                <Badge className="bg-barrush-steel/60 text-barrush-platinum mb-4 px-3 py-1">
                  {product.category}
                </Badge>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-barrush-platinum">
                    KES {product.price.toLocaleString()}
                  </span>
                  <Button className="text-barrush-midnight font-bold px-6 py-3 transition-all duration-300 hover:scale-105 bg-rose-600 hover:bg-rose-500">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-glass-effect border border-barrush-steel/30 rounded-xl p-8 max-w-2xl mx-auto backdrop-blur-md">
            <p className="text-barrush-platinum/90 text-lg">
              <strong className="text-barrush-copper bg-slate-50">Growing Collection:</strong> Our catalog expands weekly with 
              premium selections sourced for the modern connoisseur.
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default ProductCatalog;