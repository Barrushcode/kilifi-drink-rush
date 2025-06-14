
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface ScrapingResult {
  success: boolean;
  scrapedProducts: number;
  matches: number;
  updated: number;
  matchDetails?: Array<{
    existing: string;
    scraped: string;
    similarity: string;
  }>;
  error?: string;
}

const ImageScrapingInterface: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapingResult | null>(null);

  const handleScraping = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('Starting image scraping from drinksvine.co.ke...');
      
      const { data, error } = await supabase.functions.invoke('scrape-drinksvine');

      if (error) {
        console.error('Scraping error:', error);
        setResult({
          success: false,
          error: error.message || 'Failed to scrape images',
          scrapedProducts: 0,
          matches: 0,
          updated: 0
        });
      } else {
        console.log('Scraping completed successfully:', data);
        setResult(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setResult({
        success: false,
        error: 'An unexpected error occurred',
        scrapedProducts: 0,
        matches: 0,
        updated: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Scrape Images from DrinksVine.co.ke</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          This will scrape product images from drinksvine.co.ke and automatically match them 
          to your existing products by name similarity. Products without matches will remain unchanged.
        </p>
        
        <Button 
          onClick={handleScraping} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Scraping Images...' : 'Start Image Scraping'}
        </Button>

        {result && (
          <div className="mt-4 p-4 border rounded-lg">
            {result.success ? (
              <div className="space-y-2">
                <div className="text-green-600 font-semibold">✅ Scraping Completed Successfully!</div>
                <div className="text-sm space-y-1">
                  <div>📦 Products scraped from drinksvine.co.ke: <strong>{result.scrapedProducts}</strong></div>
                  <div>🎯 Products matched by name: <strong>{result.matches}</strong></div>
                  <div>✨ Products updated with new images: <strong>{result.updated}</strong></div>
                </div>
                
                {result.matchDetails && result.matchDetails.length > 0 && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">View Match Details</summary>
                    <div className="mt-2 max-h-64 overflow-y-auto space-y-1">
                      {result.matchDetails.slice(0, 20).map((match, index) => (
                        <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                          <div><strong>Your Product:</strong> {match.existing}</div>
                          <div><strong>Matched With:</strong> {match.scraped}</div>
                          <div><strong>Similarity:</strong> {match.similarity}</div>
                        </div>
                      ))}
                      {result.matchDetails.length > 20 && (
                        <div className="text-xs text-gray-500">
                          ...and {result.matchDetails.length - 20} more matches
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            ) : (
              <div className="text-red-600">
                <div className="font-semibold">❌ Scraping Failed</div>
                <div className="text-sm mt-1">{result.error}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageScrapingInterface;
