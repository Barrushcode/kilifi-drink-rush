
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
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
  );
};

export default ProductCard;
