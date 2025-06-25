
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

// Enhanced size extraction with better patterns and normalization
export const extractSize = (productName: string): { baseName: string; size: string } => {
  const name = productName.trim();
  
  // Enhanced size patterns including common typos
  const sizePatterns = [
    /(\d+(?:\.\d+)?)\s*ML/gi,
    /(\d+(?:\.\d+)?)\s*L(?!iter|itr|eter|tr)/gi,
    /(\d+(?:\.\d+)?)\s*(?:LITER|LITRE|LTR|LITR|LETER|SLTRER)/gi,
    /(\d+(?:\.\d+)?)\s*OZ/gi,
    /(\d+(?:\.\d+)?)\s*CL/gi,
    /(MINI|SMALL|LARGE|JUMBO|MAGNUM|HALF|QUARTER)/gi,
    /(\d+(?:\.\d+)?)\s*(?:BOTTLE|BTL)/gi
  ];

  for (const pattern of sizePatterns) {
    const match = name.match(pattern);
    if (match) {
      let size = match[0].trim();
      
      // Normalize common size typos
      size = size
        .replace(/LITER|LITRE|LTR|LITR|LETER|SLTRER/gi, 'L')
        .replace(/BOTTLE|BTL/gi, 'BTL')
        .replace(/\s+/g, '');
      
      const baseName = name.replace(pattern, '').trim().replace(/\s+/g, ' ');
      return { baseName, size };
    }
  }

  // If no size found, treat as default size
  return { baseName: name, size: 'Standard' };
};

// Enhanced product name normalization
export const normalizeProductName = (name: string): string => {
  return normalizeString(name)
    // Remove common filler words
    .replace(/\b(premium|select|classic|original|special|reserve|limited|finest|quality)\b/gi, '')
    // Fix common typos
    .replace(/\b(johnnie|johny|johnny)\s*walker\b/gi, 'johnnie walker')
    .replace(/\b(absolut|absolute)\b/gi, 'absolut')
    .replace(/\b(ballantines?|ballentines?)\b/gi, 'ballantines')
    .replace(/\b(hennessey|hennesy)\b/gi, 'hennessy')
    .replace(/\b(jameso?n)\b/gi, 'jameson')
    .replace(/\b(captain\s*morgan?)\b/gi, 'captain morgan')
    .replace(/\b(smirnof+)\b/gi, 'smirnoff')
    .replace(/\s+/g, ' ')
    .trim();
};

// Group products by base name with enhanced matching
export const groupProductsByBaseName = (products: any[], preserveOrder = false): GroupedProduct[] => {
  const groups = new Map<string, {
    products: any[];
    baseName: string;
    normalizedKey: string;
    originalOrder: number;
  }>();

  // First pass: group products by normalized base name
  products.forEach((product, idx) => {
    const { baseName, size } = extractSize(product.name);
    const normalizedKey = normalizeProductName(baseName);

    if (!groups.has(normalizedKey)) {
      groups.set(normalizedKey, {
        products: [],
        baseName: baseName.toUpperCase(), // Convert to ALL CAPS for display
        normalizedKey,
        originalOrder: idx
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
      baseName: group.baseName, // Already converted to ALL CAPS above
      description: firstProduct.description,
      image: firstProduct.image,
      category: firstProduct.category,
      variants,
      lowestPrice,
      lowestPriceFormatted,
      matchLevel: firstProduct.matchLevel || 'grouped',
      originalOrder: group.originalOrder
    } as GroupedProduct & { originalOrder: number });
  });

  // Sort based on preserveOrder flag
  if (preserveOrder) {
    return groupedProducts
      .sort((a, b) => (a as any).originalOrder - (b as any).originalOrder)
      .map(g => {
        const { originalOrder, ...rest } = g as any;
        return rest;
      });
  } else {
    return groupedProducts.sort((a, b) => b.lowestPrice - a.lowestPrice);
  }
};
