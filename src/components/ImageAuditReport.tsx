
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, AlertTriangle } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

interface ImageAuditItem {
  productName: string;
  currentImageUrl: string;
  matchLevel: string;
  category: string;
  price: string;
  needsAttention: boolean;
  priority: 'high' | 'medium' | 'low';
}

const ImageAuditReport: React.FC = () => {
  const { products, loading } = useProducts();
  const [auditData, setAuditData] = useState<ImageAuditItem[]>([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const audit: ImageAuditItem[] = [];
      
      products.forEach(product => {
        product.variants.forEach(variant => {
          const needsAttention = 
            product.image.includes('unsplash.com') || // Using fallback image
            variant.originalProduct.image.includes('unsplash.com');
          
          const priority = 
            variant.price > 10000 ? 'high' : 
            variant.price > 5000 ? 'medium' : 'low';

          audit.push({
            productName: variant.originalProduct.name,
            currentImageUrl: variant.originalProduct.image,
            matchLevel: 'unknown', // We'd need to track this in the matching service
            category: product.category,
            price: variant.priceFormatted,
            needsAttention,
            priority
          });
        });
      });

      setAuditData(audit);
    }
  }, [products]);

  const generateCSV = () => {
    const headers = ['Product Name', 'Current Image URL', 'Category', 'Price', 'Priority', 'Needs Attention'];
    const csvContent = [
      headers.join(','),
      ...auditData.map(item => [
        `"${item.productName}"`,
        `"${item.currentImageUrl}"`,
        `"${item.category}"`,
        `"${item.price}"`,
        item.priority,
        item.needsAttention ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image-audit-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const problemProducts = auditData.filter(item => item.needsAttention);
  const highPriorityProblems = problemProducts.filter(item => item.priority === 'high');

  if (loading) {
    return (
      <Card className="bg-glass-effect border-barrush-steel/30">
        <CardContent className="p-6">
          <p className="text-barrush-platinum">Loading audit data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-glass-effect border-barrush-steel/30 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-barrush-platinum flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Image Audit Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-barrush-midnight/50 p-4 rounded-lg">
            <h3 className="text-barrush-copper font-semibold">Total Products</h3>
            <p className="text-2xl font-bold text-barrush-platinum">{auditData.length}</p>
          </div>
          <div className="bg-barrush-midnight/50 p-4 rounded-lg">
            <h3 className="text-rose-400 font-semibold">Need Attention</h3>
            <p className="text-2xl font-bold text-barrush-platinum">{problemProducts.length}</p>
          </div>
          <div className="bg-barrush-midnight/50 p-4 rounded-lg">
            <h3 className="text-red-400 font-semibold">High Priority</h3>
            <p className="text-2xl font-bold text-barrush-platinum">{highPriorityProblems.length}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={() => setShowReport(!showReport)}
            className="bg-barrush-copper hover:bg-barrush-copper/80"
          >
            {showReport ? 'Hide' : 'Show'} Problem Products
          </Button>
          <Button 
            onClick={generateCSV}
            variant="outline"
            className="border-barrush-steel/40 text-barrush-platinum hover:bg-barrush-steel/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
        </div>

        {showReport && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <h3 className="text-barrush-platinum font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Products Using Fallback Images
            </h3>
            {problemProducts.slice(0, 20).map((item, index) => (
              <div key={index} className="bg-barrush-midnight/30 p-3 rounded border border-barrush-steel/20">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-barrush-platinum font-medium text-sm">{item.productName}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <Badge 
                        className={`text-xs ${
                          item.priority === 'high' ? 'bg-red-600' : 
                          item.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                        }`}
                      >
                        {item.priority} priority
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-barrush-copper font-semibold text-sm">{item.price}</p>
                  </div>
                </div>
              </div>
            ))}
            {problemProducts.length > 20 && (
              <p className="text-barrush-platinum/60 text-sm">
                ... and {problemProducts.length - 20} more. Download CSV for complete list.
              </p>
            )}
          </div>
        )}

        <div className="bg-barrush-midnight/50 p-4 rounded-lg">
          <h3 className="text-barrush-copper font-semibold mb-2">Recommendations</h3>
          <ul className="text-barrush-platinum/80 text-sm space-y-1">
            <li>• Focus on high-priority products first (expensive items)</li>
            <li>• Search for product images on manufacturer websites</li>
            <li>• Use high-quality stock photos from Unsplash/Pexels if needed</li>
            <li>• Ensure images are at least 1000px wide for best quality</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageAuditReport;
