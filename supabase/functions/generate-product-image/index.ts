
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { productName, category, description } = await req.json();

    if (!productName) {
      return new Response(
        JSON.stringify({ error: 'Product name is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Generating image for product: ${productName}`);

    // Generate detailed prompt based on product details
    const prompt = generateProductPrompt(productName, category, description);
    console.log(`Generated prompt: ${prompt}`);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        style: 'natural'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Image generated successfully');

    return new Response(
      JSON.stringify({ 
        imageUrl: data.data[0].url,
        prompt: prompt 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error generating product image:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateProductPrompt(productName: string, category: string = '', description: string = ''): string {
  const name = productName.toLowerCase();
  let prompt = "Professional product photography of ";

  // Determine product type and create specific prompt
  if (name.includes('whiskey') || name.includes('whisky') || name.includes('scotch')) {
    const volume = extractVolume(productName);
    const brand = extractBrand(productName, ['100 pipers', 'johnnie walker', 'macallan', 'glenfiddich', 'jameson']);
    
    prompt += `${productName} ${volume} scotch whisky bottle, amber colored glass bottle with premium label, elegant typography, dark amber liquid visible through glass, studio lighting, clean white background, high-end liquor photography, professional commercial style`;
  
  } else if (name.includes('wine') || name.includes('chardonnay') || name.includes('sauvignon') || name.includes('merlot') || name.includes('cabernet') || name.includes('rosé') || name.includes('rose')) {
    const volume = extractVolume(productName);
    const wineType = getWineType(name);
    
    prompt += `${productName} ${volume} ${wineType} wine bottle, ${getBottleColor(wineType)} glass bottle with elegant wine label, premium typography, ${getWineColor(wineType)} liquid visible, studio lighting, clean white background, high-end wine photography, commercial style`;
  
  } else if (name.includes('vodka')) {
    const volume = extractVolume(productName);
    prompt += `${productName} ${volume} premium vodka bottle, clear glass bottle with sophisticated label design, crystal clear liquid, minimalist elegant styling, studio lighting, white background, luxury spirits photography`;
  
  } else if (name.includes('gin')) {
    const volume = extractVolume(productName);
    prompt += `${productName} ${volume} premium gin bottle, clear or tinted glass bottle with botanical-inspired label, clear liquid, elegant bottle design, studio lighting, white background, craft spirits photography`;
  
  } else if (name.includes('cognac') || name.includes('brandy')) {
    const volume = extractVolume(productName);
    prompt += `${productName} ${volume} premium cognac bottle, dark amber glass bottle with luxury gold accents, rich amber liquid, sophisticated label design, studio lighting, white background, luxury spirits photography`;
  
  } else if (name.includes('beer') || name.includes('lager')) {
    const volume = extractVolume(productName);
    prompt += `${productName} ${volume} premium beer bottle, brown or green glass bottle with craft beer label, golden liquid visible, modern label design, studio lighting, white background, craft beer photography`;
  
  } else if (name.includes('champagne') || name.includes('prosecco') || name.includes('sparkling')) {
    const volume = extractVolume(productName);
    prompt += `${productName} ${volume} champagne bottle, dark green glass bottle with elegant foil wrapper, luxury label, traditional champagne bottle shape, studio lighting, white background, premium sparkling wine photography`;
  
  } else if (name.includes('rum')) {
    const volume = extractVolume(productName);
    prompt += `${productName} ${volume} premium rum bottle, amber or dark glass bottle with tropical-inspired label, golden to dark amber liquid, sophisticated design, studio lighting, white background, premium spirits photography`;
  
  } else if (name.includes('tequila')) {
    const volume = extractVolume(productName);
    prompt += `${productName} ${volume} premium tequila bottle, clear or blue-tinted glass bottle with Mexican-inspired label, clear to golden liquid, elegant agave-themed design, studio lighting, white background, premium tequila photography`;
  
  } else {
    // Generic alcohol bottle
    const volume = extractVolume(productName);
    prompt += `${productName} ${volume} premium alcohol bottle, elegant glass bottle with sophisticated label design, premium liquid visible, luxury styling, studio lighting, clean white background, high-end spirits photography`;
  }

  return prompt;
}

function extractVolume(productName: string): string {
  const volumeMatches = productName.match(/(\d+(?:\.\d+)?)\s*(ml|l|liter|litre)/i);
  if (volumeMatches) {
    return volumeMatches[0];
  }
  
  // Common volume patterns
  if (productName.includes('1000ml') || productName.includes('1L') || productName.includes('1 L')) return '1000ml';
  if (productName.includes('750ml')) return '750ml';
  if (productName.includes('700ml')) return '700ml';
  if (productName.includes('500ml')) return '500ml';
  if (productName.includes('375ml')) return '375ml';
  
  return '750ml'; // Default
}

function extractBrand(productName: string, knownBrands: string[]): string {
  const name = productName.toLowerCase();
  for (const brand of knownBrands) {
    if (name.includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return '';
}

function getWineType(name: string): string {
  if (name.includes('chardonnay')) return 'Chardonnay white';
  if (name.includes('sauvignon blanc')) return 'Sauvignon Blanc white';
  if (name.includes('sauvignon')) return 'white';
  if (name.includes('merlot')) return 'Merlot red';
  if (name.includes('cabernet')) return 'Cabernet red';
  if (name.includes('pinot noir')) return 'Pinot Noir red';
  if (name.includes('rosé') || name.includes('rose')) return 'rosé';
  if (name.includes('red')) return 'red';
  if (name.includes('white')) return 'white';
  return 'wine';
}

function getBottleColor(wineType: string): string {
  if (wineType.includes('red') || wineType.includes('Merlot') || wineType.includes('Cabernet')) return 'dark green';
  if (wineType.includes('white') || wineType.includes('Chardonnay') || wineType.includes('Sauvignon')) return 'clear to light green';
  if (wineType.includes('rosé')) return 'clear to light tinted';
  return 'dark green';
}

function getWineColor(wineType: string): string {
  if (wineType.includes('red') || wineType.includes('Merlot') || wineType.includes('Cabernet')) return 'deep red to purple';
  if (wineType.includes('white') || wineType.includes('Chardonnay') || wineType.includes('Sauvignon')) return 'pale golden to light yellow';
  if (wineType.includes('rosé')) return 'light pink to salmon';
  return 'wine colored';
}
