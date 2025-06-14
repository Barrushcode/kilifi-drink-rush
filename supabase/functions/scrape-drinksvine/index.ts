
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
  try {
    console.log('Starting to scrape drinksvine.co.ke...');
    
    const response = await fetch('https://drinksvine.co.ke/collections/all', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log('Successfully fetched HTML from drinksvine.co.ke');
    
    const products: ScrapedProduct[] = [];
    
    // Parse product cards - this regex looks for product information in the HTML
    const productMatches = html.matchAll(/<div[^>]*class="[^"]*product-card[^"]*"[^>]*>[\s\S]*?<\/div>/gi);
    
    for (const match of productMatches) {
      const productDiv = match[0];
      
      // Extract product name
      const nameMatch = productDiv.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>|<a[^>]*title="([^"]+)"|<span[^>]*class="[^"]*product-title[^"]*"[^>]*>([^<]+)<\/span>/i);
      const productName = nameMatch?.[1] || nameMatch?.[2] || nameMatch?.[3];
      
      // Extract image URL
      const imgMatch = productDiv.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
      let imageUrl = imgMatch?.[1];
      
      if (productName && imageUrl) {
        // Make sure the image URL is absolute
        if (imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl;
        } else if (imageUrl.startsWith('/')) {
          imageUrl = 'https://drinksvine.co.ke' + imageUrl;
        }
        
        products.push({
          name: productName.trim(),
          imageUrl: imageUrl
        });
      }
    }
    
    // Also try alternative parsing methods
    const altMatches = html.matchAll(/<a[^>]*href="[^"]*products\/[^"]*"[^>]*>[\s\S]*?<\/a>/gi);
    
    for (const match of altMatches) {
      const linkContent = match[0];
      
      const nameMatch = linkContent.match(/title="([^"]+)"|alt="([^"]+)"/i);
      const productName = nameMatch?.[1] || nameMatch?.[2];
      
      const imgMatch = linkContent.match(/<img[^>]+src="([^"]+)"/i);
      let imageUrl = imgMatch?.[1];
      
      if (productName && imageUrl && !products.find(p => p.name === productName.trim())) {
        if (imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl;
        } else if (imageUrl.startsWith('/')) {
          imageUrl = 'https://drinksvine.co.ke' + imageUrl;
        }
        
        products.push({
          name: productName.trim(),
          imageUrl: imageUrl
        });
      }
    }
    
    console.log(`Scraped ${products.length} products from drinksvine.co.ke`);
    return products.slice(0, 100); // Limit to first 100 products
    
  } catch (error) {
    console.error('Error scraping drinksvine.co.ke:', error);
    return [];
  }
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
        JSON.stringify({ error: 'No products found on drinksvine.co.ke' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get existing products from our database
    const { data: existingProducts, error: dbError } = await supabase
      .from('allthealcoholicproducts')
      .select('Title, "Product image URL"');

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch existing products' }),
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
        
        if (similarity > 0.6 && (!bestMatch || similarity > bestMatch.similarity)) {
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
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
