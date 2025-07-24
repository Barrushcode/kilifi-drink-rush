
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
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
    <Card className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
      <div className="w-full overflow-hidden">
        <ProductImageLoader
          src={product.image}
          alt={`${product.name} - ${product.category}`}
          className="w-full h-auto object-cover"
        />
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
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-bold text-barrush-platinum">
            {product.price}
          </span>
          <Button 
            onClick={handleAddToCart}
            className="w-full text-white font-bold px-4 py-2 text-sm transition-all duration-300 hover:scale-105 bg-rose-600 hover:bg-rose-500 h-10"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
