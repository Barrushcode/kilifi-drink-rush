
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedProduct {
  name: string;
  imageUrl: string;
  price?: string;
}

function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeProductName(str1);
  const norm2 = normalizeProductName(str2);
  
  if (norm1 === norm2) return 1.0;
  
  const words1 = norm1.split(' ');
  const words2 = norm2.split(' ');
  
  let matchCount = 0;
  for (const word1 of words1) {
    if (word1.length > 2 && words2.some(word2 => word2.includes(word1) || word1.includes(word2))) {
      matchCount++;
    }
  }
  
  return matchCount / Math.max(words1.length, words2.length);
}

async function scrapeDrinksVine(): Promise<ScrapedProduct[]> {
  const urlsToTry = [
    'https://drinksvine.co.ke/',
    'https://drinksvine.co.ke/collections/all',
    'https://drinksvine.co.ke/products',
    'https://www.drinksvine.co.ke/',
    'https://www.drinksvine.co.ke/collections/all'
  ];

  for (const url of urlsToTry) {
    console.log(`Trying to scrape: ${url}`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      
      console.log(`Response status for ${url}: ${response.status}`);
      
      if (!response.ok) {
        console.log(`Failed to fetch ${url}: HTTP ${response.status}`);
        continue;
      }
      
      const html = await response.text();
      console.log(`Successfully fetched HTML from ${url}, length: ${html.length}`);
      
      const products = parseProductsFromHTML(html, url);
      
      if (products.length > 0) {
        console.log(`Successfully scraped ${products.length} products from ${url}`);
        return products;
      }
      
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      continue;
    }
  }
  
  console.log('All URLs failed, returning empty array');
  return [];
}

function parseProductsFromHTML(html: string, sourceUrl: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = [];
  
  // Try multiple parsing strategies
  const strategies = [
    // Strategy 1: Look for Shopify-style product cards
    /<div[^>]*class="[^"]*product[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    // Strategy 2: Look for product links
    /<a[^>]*href="[^"]*product[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
    // Strategy 3: Look for image elements with product-related attributes
    /<img[^>]*alt="[^"]*"[^>]*src="[^"]*"/gi,
  ];

  for (const strategy of strategies) {
    const matches = html.matchAll(strategy);
    
    for (const match of matches) {
      const element = match[0];
      
      // Extract product name from various sources
      const namePatterns = [
        /alt="([^"]+)"/i,
        /title="([^"]+)"/i,
        /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i,
        /data-product-title="([^"]+)"/i
      ];
      
      let productName = '';
      for (const pattern of namePatterns) {
        const nameMatch = element.match(pattern);
        if (nameMatch && nameMatch[1]) {
          productName = nameMatch[1].trim();
          break;
        }
      }
      
      // Extract image URL
      const imgMatch = element.match(/src="([^"]+)"/i);
      let imageUrl = imgMatch?.[1];
      
      if (productName && imageUrl) {
        // Clean up image URL
        if (imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl;
        } else if (imageUrl.startsWith('/')) {
          const baseUrl = new URL(sourceUrl).origin;
          imageUrl = baseUrl + imageUrl;
        }
        
        // Filter out obviously non-product images
        if (!imageUrl.includes('logo') && 
            !imageUrl.includes('icon') && 
            !imageUrl.includes('banner') &&
            !productName.toLowerCase().includes('logo') &&
            productName.length > 3) {
          
          products.push({
            name: productName.trim(),
            imageUrl: imageUrl
          });
        }
      }
    }
    
    if (products.length > 0) {
      console.log(`Strategy ${strategies.indexOf(strategy) + 1} found ${products.length} products`);
      break;
    }
  }
  
  // Remove duplicates
  const uniqueProducts = products.filter((product, index, self) => 
    index === self.findIndex(p => p.name === product.name)
  );
  
  console.log(`After deduplication: ${uniqueProducts.length} unique products`);
  
  return uniqueProducts.slice(0, 50); // Limit to 50 products for performance
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting drinksvine scraping process...');
    
    // Scrape products from drinksvine.co.ke
    const scrapedProducts = await scrapeDrinksVine();
    
    if (scrapedProducts.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No products could be scraped from drinksvine.co.ke. The website might be down, have changed its structure, or be blocking requests.',
          scrapedProducts: 0,
          matches: 0,
          updated: 0
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get existing products from our database
    const { data: existingProducts, error: dbError } = await supabase
      .from('allthealcoholicproducts')
      .select('Title, "Product image URL"');

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to fetch existing products from database',
          scrapedProducts: scrapedProducts.length,
          matches: 0,
          updated: 0
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${existingProducts.length} existing products in database`);

    // Match scraped products to existing products
    const matches: Array<{ existingProduct: string; scrapedProduct: ScrapedProduct; similarity: number }> = [];
    
    for (const existingProduct of existingProducts) {
      if (!existingProduct.Title) continue;
      
      let bestMatch: { product: ScrapedProduct; similarity: number } | null = null;
      
      for (const scrapedProduct of scrapedProducts) {
        const similarity = calculateSimilarity(existingProduct.Title, scrapedProduct.name);
        
        if (similarity > 0.5 && (!bestMatch || similarity > bestMatch.similarity)) {
          bestMatch = { product: scrapedProduct, similarity };
        }
      }
      
      if (bestMatch) {
        matches.push({
          existingProduct: existingProduct.Title,
          scrapedProduct: bestMatch.product,
          similarity: bestMatch.similarity
        });
      }
    }

    console.log(`Found ${matches.length} potential matches`);

    // Update products with matched images
    let updatedCount = 0;
    
    for (const match of matches) {
      const { error: updateError } = await supabase
        .from('allthealcoholicproducts')
        .update({ 'Product image URL': match.scrapedProduct.imageUrl })
        .eq('Title', match.existingProduct);

      if (!updateError) {
        updatedCount++;
        console.log(`Updated image for: ${match.existingProduct} -> ${match.scrapedProduct.name} (similarity: ${match.similarity.toFixed(2)})`);
      } else {
        console.error(`Failed to update ${match.existingProduct}:`, updateError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        scrapedProducts: scrapedProducts.length,
        matches: matches.length,
        updated: updatedCount,
        matchDetails: matches.map(m => ({
          existing: m.existingProduct,
          scraped: m.scrapedProduct.name,
          similarity: Math.round(m.similarity * 100) + '%'
        }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-drinksvine function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unexpected error occurred during scraping',
        scrapedProducts: 0,
        matches: 0,
        updated: 0
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
