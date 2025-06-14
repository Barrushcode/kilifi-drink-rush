
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductImageLoader from './ProductImageLoader';

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
  const handleAddToCart = () => {
    console.log(`Adding ${product.name} to cart`);
    // Cart functionality to be implemented
  };

  return (
    <Card className="bg-glass-effect border-neon-blue/20 border hover:border-neon-pink/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
      <ProductImageLoader
        src={product.image}
        alt={`${product.name} - ${product.category}`}
        className="h-64"
      />
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold mb-3 font-serif text-neon-pink-light">
          {product.name}
        </h3>
        <Badge className="bg-gray-700/60 text-gray-200 mb-4 px-3 py-1">
          {product.category}
        </Badge>
        {product.description && (
          <p className="text-gray-200/80 mb-4 text-sm line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-gray-200">
            {product.price}
          </span>
          <Button 
            onClick={handleAddToCart}
            className="text-barrush-midnight font-bold px-6 py-3 transition-all duration-300 hover:scale-105 bg-neon-pink hover:bg-neon-pink/90"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
