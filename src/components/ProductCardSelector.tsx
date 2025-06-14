
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductCardVariant1 from './ProductCardVariant1';
import ProductCardVariant2 from './ProductCardVariant2';
import ProductCardVariant3 from './ProductCardVariant3';
import { GroupedProduct } from '@/utils/productGroupingUtils';

interface ProductCardSelectorProps {
  sampleProduct: GroupedProduct;
}

const ProductCardSelector: React.FC<ProductCardSelectorProps> = ({ sampleProduct }) => {
  const [selectedVariant, setSelectedVariant] = useState<'variant1' | 'variant2' | 'variant3'>('variant1');

  const variants = [
    { key: 'variant1', name: 'Clean & Simple', description: 'Minimalist design with tap-to-expand details' },
    { key: 'variant2', name: 'Premium Card', description: 'Elegant gradient with expandable sections' },
    { key: 'variant3', name: 'Hover Details', description: 'Interactive overlay with hover effects' }
  ];

  const renderSelectedVariant = () => {
    switch (selectedVariant) {
      case 'variant1':
        return <ProductCardVariant1 product={sampleProduct} />;
      case 'variant2':
        return <ProductCardVariant2 product={sampleProduct} />;
      case 'variant3':
        return <ProductCardVariant3 product={sampleProduct} />;
      default:
        return <ProductCardVariant1 product={sampleProduct} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <Card className="bg-white shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif text-gray-900">
            Choose Your Product Card Style
          </CardTitle>
          <p className="text-gray-600">
            Select the design variation you prefer for your product cards
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {variants.map((variant) => (
              <Button
                key={variant.key}
                onClick={() => setSelectedVariant(variant.key as any)}
                variant={selectedVariant === variant.key ? "default" : "outline"}
                className={`flex flex-col items-center p-4 h-auto ${
                  selectedVariant === variant.key 
                    ? "bg-rose-600 hover:bg-rose-700 text-white" 
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="font-semibold">{variant.name}</span>
                <span className="text-xs opacity-80 mt-1">{variant.description}</span>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              {renderSelectedVariant()}
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Current Selection: {variants.find(v => v.key === selectedVariant)?.name}
              </Badge>
              
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Clean product names with typos removed</li>
                    <li>• Quantity information extracted and displayed separately</li>
                    <li>• Mobile-optimized responsive design</li>
                    <li>• Reduced visual contrast with subtle styling</li>
                    <li>• Product details shown only when tapped/expanded</li>
                    <li>• Professional typography with serif fonts</li>
                  </ul>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Design Notes:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Variant 1:</strong> Clean white cards with tap-to-expand functionality</p>
                  <p><strong>Variant 2:</strong> Gradient backgrounds with smooth animations</p>
                  <p><strong>Variant 3:</strong> Hover overlays with dynamic content reveal</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCardSelector;
