
import { normalizeString } from './stringUtils';

export interface ProductVariant {
  size: string;
  price: number;
  priceFormatted: string;
  originalProduct: any;
}

export interface GroupedProduct {
  id: string;
  baseName: string;
  description: string;
  image: string;
  category: string;
  variants: ProductVariant[];
  lowestPrice: number;
  lowestPriceFormatted: string;
  matchLevel: string;
}

// Extract size from product name (750ML, 1L, 375ML, etc.)
export const extractSize = (productName: string): { baseName: string; size: string } => {
  const name = productName.trim();
  
  // Common size patterns
  const sizePatterns = [
    /(\d+(?:\.\d+)?)\s*ML/gi,
    /(\d+(?:\.\d+)?)\s*L(?!iter)/gi,
    /(\d+(?:\.\d+)?)\s*LITER/gi,
    /(\d+(?:\.\d+)?)\s*OZ/gi,
    /(\d+(?:\.\d+)?)\s*CL/gi,
    /(MINI|SMALL|LARGE|JUMBO|MAGNUM)/gi,
    /(\d+(?:\.\d+)?)\s*LITRE/gi
  ];

  for (const pattern of sizePatterns) {
    const match = name.match(pattern);
    if (match) {
      const size = match[0].trim();
      const baseName = name.replace(pattern, '').trim().replace(/\s+/g, ' ');
      return { baseName, size };
    }
  }

  // If no size found, treat as default size
  return { baseName: name, size: 'Standard' };
};

// Normalize product name for grouping (remove brand variations, extra spaces)
export const normalizeProductName = (name: string): string => {
  return normalizeString(name)
    .replace(/\b(premium|select|classic|original|special|reserve|limited)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Group products by base name
export const groupProductsByBaseName = (products: any[]): GroupedProduct[] => {
  const groups = new Map<string, {
    products: any[];
    baseName: string;
    normalizedKey: string;
  }>();

  // First pass: group products by normalized base name
  products.forEach(product => {
    const { baseName, size } = extractSize(product.name);
    const normalizedKey = normalizeProductName(baseName);
    
    if (!groups.has(normalizedKey)) {
      groups.set(normalizedKey, {
        products: [],
        baseName,
        normalizedKey
      });
    }
    
    groups.get(normalizedKey)!.products.push({
      ...product,
      extractedSize: size
    });
  });

  // Second pass: create grouped products
  const groupedProducts: GroupedProduct[] = [];

  groups.forEach((group, normalizedKey) => {
    const products = group.products;
    const firstProduct = products[0];
    
    // Create variants from all products in this group
    const variants: ProductVariant[] = products.map(product => {
      const price = Number(product.price.replace(/[^\d.]/g, '')) || 0;
      return {
        size: product.extractedSize,
        price,
        priceFormatted: product.price,
        originalProduct: product
      };
    });

    // Sort variants by price
    variants.sort((a, b) => a.price - b.price);

    // Find lowest price
    const lowestPrice = Math.min(...variants.map(v => v.price));
    const lowestPriceFormatted = `KES ${lowestPrice.toLocaleString()}`;

    groupedProducts.push({
      id: `grouped-${normalizedKey.replace(/\s+/g, '-')}`,
      baseName: group.baseName,
      description: firstProduct.description,
      image: firstProduct.image,
      category: firstProduct.category,
      variants,
      lowestPrice,
      lowestPriceFormatted,
      matchLevel: firstProduct.matchLevel || 'grouped'
    });
  });

  // Sort by lowest price descending
  return groupedProducts.sort((a, b) => b.lowestPrice - a.lowestPrice);
};
