
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { GroupedProduct } from '@/utils/productGroupingUtils';
import ProductQuickViewModal from './ProductQuickViewModal';
import { useGroupedProductCard } from './grouped-product-card/useGroupedProductCard';
import GroupedProductCardImage from './grouped-product-card/GroupedProductCardImage';
import GroupedProductVariantSelector from './grouped-product-card/GroupedProductVariantSelector';
import GroupedProductCardActions from './grouped-product-card/GroupedProductCardActions';

interface GroupedProductCardProps {
  product: GroupedProduct;
}

const GroupedProductCard: React.FC<GroupedProductCardProps> = ({ product }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    selectedVariant,
    handleVariantChange,
    handleAddToCart,
    handleBuyNow,
    displayName,
    displayImage,
  } = useGroupedProductCard(product);

  return (
    <>
      <ProductQuickViewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={product}
      />
      <div
        className="
          bg-glass-effect rounded-2xl border border-neon-blue/20 hover:border-neon-pink/50
          backdrop-blur-md overflow-hidden transition-all duration-500 hover:scale-105
          font-iphone relative cursor-pointer group flex flex-col h-full
        "
        onClick={() => setModalOpen(true)}
        tabIndex={0}
        role="button"
        aria-label={`Open details for ${displayName}`}
        onKeyDown={e => { if (e.key === 'Enter') setModalOpen(true); }}
      >
        <GroupedProductCardImage src={displayImage} alt={displayName} />
        
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-neon-blue/10 text-neon-blue border border-neon-blue/20 font-semibold px-3 py-1">
              {product.category}
            </Badge>
            {!!product.variants.length && product.variants.length > 1 && (
              <Badge variant="outline" className="text-xs font-iphone text-neon-blue/70 border-neon-blue/50">
                {product.variants.length} sizes
              </Badge>
            )}
          </div>
          <h3 className="text-xl font-bold font-serif text-neon-pink-light mb-2 line-clamp-2">{displayName}</h3>
          {product.description && (
            <p className="text-gray-300/80 mb-4 text-sm line-clamp-3">{product.description}</p>
          )}

          <div className="mt-auto">
            <GroupedProductVariantSelector 
              product={product}
              selectedVariant={selectedVariant}
              onVariantChange={handleVariantChange}
            />
            
            <GroupedProductCardActions 
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupedProductCard;
