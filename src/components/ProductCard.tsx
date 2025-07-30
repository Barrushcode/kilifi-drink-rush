
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
    <Card className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group flex flex-col h-full md:h-[650px] lg:h-[700px] xl:h-[750px]">
      <div className="h-64 w-full">
        <ProductImageLoader
          src={product.image}
          alt={`${product.name} - ${product.category}`}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-8 flex flex-col justify-between flex-grow">
        <div className="flex-grow">
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
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-3xl font-bold text-barrush-platinum">
            {product.price}
          </span>
          <Button 
            onClick={handleAddToCart}
            className="text-barrush-midnight font-bold px-6 py-3 transition-all duration-300 hover:scale-105 bg-rose-600 hover:bg-rose-500"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
