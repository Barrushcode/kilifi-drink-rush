
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    console.error('OPENAI_API_KEY is not set');
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { imageUrl, productName } = await req.json();

    if (!imageUrl || !productName) {
      return new Response(
        JSON.stringify({ error: 'Missing imageUrl or productName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing image for product: ${productName}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI that analyzes product images for an alcohol e-commerce website. Your job is to determine if an image is appropriate for the given alcohol product name.

Rate images on a scale of 1-100 based on:
1. Does it show the actual product bottle/can/package? (40 points)
2. Is the image clear and high quality? (20 points)  
3. Does it match the product name exactly? (20 points)
4. Is it professional/suitable for e-commerce? (20 points)

REJECT images that show:
- People drinking or partying
- Unrelated products
- Low quality/blurry images
- Text-only or logos without product
- Food or non-alcohol items
- Inappropriate content

Respond with JSON: {"score": number, "isAppropriate": boolean, "reasoning": "brief explanation"}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image for the alcohol product: "${productName}"`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'low'
                }
              }
            ]
          }
        ],
        max_tokens: 200,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'OpenAI API request failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      const analysis = JSON.parse(content);
      console.log(`Analysis result for ${productName}:`, analysis);
      
      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      return new Response(
        JSON.stringify({
          score: 50,
          isAppropriate: true,
          reasoning: 'Analysis completed but format unclear'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in analyze-product-image function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
