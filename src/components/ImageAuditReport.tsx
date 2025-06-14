
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, AlertTriangle, ExternalLink } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

interface ImageAuditItem {
  productName: string;
  currentImageUrl: string;
  matchLevel: string;
  category: string;
  price: string;
  needsAttention: boolean;
  priority: 'high' | 'medium' | 'low';
  imageIssue: string;
}

const ImageAuditReport: React.FC = () => {
  const { products, loading } = useProducts();
  const [auditData, setAuditData] = useState<ImageAuditItem[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const audit: ImageAuditItem[] = [];
      
      products.forEach(product => {
        product.variants.forEach(variant => {
          const imageUrl = variant.originalProduct.image;
          let imageIssue = 'No issues';
          let needsAttention = false;

          // Check for various image issues
          if (imageUrl.includes('unsplash.com')) {
            imageIssue = 'Using generic fallback image from Unsplash';
            needsAttention = true;
          } else if (imageUrl.includes('youtube.com') || imageUrl.includes('youtu.be')) {
            imageIssue = 'Using YouTube thumbnail (inappropriate)';
            needsAttention = true;
          } else if (imageUrl.includes('pinterest.com')) {
            imageIssue = 'Using Pinterest image (may be low quality)';
            needsAttention = true;
          } else if (imageUrl.includes('facebook.com') || imageUrl.includes('instagram.com')) {
            imageIssue = 'Using social media image (may break)';
            needsAttention = true;
          } else if (imageUrl.includes('wikimedia.org') || imageUrl.includes('wikipedia.org')) {
            imageIssue = 'Using Wikipedia image (may not be product-specific)';
            needsAttention = true;
          } else if (imageUrl.includes('blogspot.com') || imageUrl.includes('wordpress.com')) {
            imageIssue = 'Using blog image (may be low quality)';
            needsAttention = true;
          } else if (imageUrl.includes('maxresdefault') || imageUrl.includes('hqdefault')) {
            imageIssue = 'Using video thumbnail (inappropriate for product)';
            needsAttention = true;
          } else if (imageUrl.includes('thumb') || imageUrl.includes('150')) {
            imageIssue = 'Using thumbnail/small image (low resolution)';
            needsAttention = true;
          }
          
          const price = variant.price;
          const priority = 
            price > 50000 ? 'high' : 
            price > 10000 ? 'medium' : 'low';

          audit.push({
            productName: variant.originalProduct.name,
            currentImageUrl: imageUrl,
            matchLevel: 'unknown', // We'd need to track this from matching service
            category: product.category,
            price: variant.priceFormatted,
            needsAttention,
            priority,
            imageIssue
          });
        });
      });

      // Sort by priority and price
      audit.sort((a, b) => {
        if (a.needsAttention !== b.needsAttention) {
          return a.needsAttention ? -1 : 1;
        }
        if (a.priority !== b.priority) {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0;
      });

      setAuditData(audit);
    }
  }, [products]);

  const generateCSV = () => {
    const headers = ['Product Name', 'Current Image URL', 'Category', 'Price', 'Priority', 'Image Issue', 'Needs Attention'];
    const csvContent = [
      headers.join(','),
      ...auditData.map(item => [
        `"${item.productName}"`,
        `"${item.currentImageUrl}"`,
        `"${item.category}"`,
        `"${item.price}"`,
        item.priority,
        `"${item.imageIssue}"`,
        item.needsAttention ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'complete-image-audit-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const problemProducts = auditData.filter(item => item.needsAttention);
  const highPriorityProblems = problemProducts.filter(item => item.priority === 'high');
  const mediumPriorityProblems = problemProducts.filter(item => item.priority === 'medium');
  const lowPriorityProblems = problemProducts.filter(item => item.priority === 'low');

  if (loading) {
    return (
      <Card className="bg-glass-effect border-barrush-steel/30">
        <CardContent className="p-6">
          <p className="text-barrush-platinum">Loading comprehensive image audit...</p>
        </CardContent>
      </Card>
    );
  }

  const displayProducts = showAllProducts ? auditData : problemProducts;

  return (
    <Card className="bg-glass-effect border-barrush-steel/30 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-barrush-platinum flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Complete Image Audit Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-barrush-midnight/50 p-4 rounded-lg">
            <h3 className="text-barrush-copper font-semibold">Total Products</h3>
            <p className="text-2xl font-bold text-barrush-platinum">{auditData.length}</p>
          </div>
          <div className="bg-barrush-midnight/50 p-4 rounded-lg">
            <h3 className="text-red-400 font-semibold">High Priority Issues</h3>
            <p className="text-2xl font-bold text-barrush-platinum">{highPriorityProblems.length}</p>
          </div>
          <div className="bg-barrush-midnight/50 p-4 rounded-lg">
            <h3 className="text-yellow-400 font-semibold">Medium Priority</h3>
            <p className="text-2xl font-bold text-barrush-platinum">{mediumPriorityProblems.length}</p>
          </div>
          <div className="bg-barrush-midnight/50 p-4 rounded-lg">
            <h3 className="text-green-400 font-semibold">Low Priority</h3>
            <p className="text-2xl font-bold text-barrush-platinum">{lowPriorityProblems.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => setShowReport(!showReport)}
            className="bg-barrush-copper hover:bg-barrush-copper/80"
          >
            {showReport ? 'Hide' : 'Show'} Detailed Report
          </Button>
          <Button 
            onClick={() => setShowAllProducts(!showAllProducts)}
            variant="outline"
            className="border-barrush-steel/40 text-barrush-platinum hover:bg-barrush-steel/20"
          >
            {showAllProducts ? 'Show Problems Only' : 'Show All Products'}
          </Button>
          <Button 
            onClick={generateCSV}
            variant="outline"
            className="border-barrush-steel/40 text-barrush-platinum hover:bg-barrush-steel/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Complete CSV
          </Button>
        </div>

        {showReport && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-barrush-platinum font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                {showAllProducts ? 'All Products' : 'Products with Image Issues'} ({displayProducts.length})
              </h3>
            </div>
            
            {displayProducts.slice(0, 50).map((item, index) => (
              <div key={index} className="bg-barrush-midnight/30 p-3 rounded border border-barrush-steel/20">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-barrush-platinum font-medium text-sm mb-1">{item.productName}</h4>
                    <p className="text-barrush-platinum/70 text-xs mb-2">{item.imageIssue}</p>
                    <div className="flex gap-2 mb-2">
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
                      {item.needsAttention && (
                        <Badge className="text-xs bg-rose-600">
                          Needs Attention
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={item.currentImageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-barrush-copper hover:text-barrush-copper/80 text-xs flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Current Image
                      </a>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-barrush-copper font-semibold text-sm">{item.price}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {displayProducts.length > 50 && (
              <p className="text-barrush-platinum/60 text-sm">
                ... and {displayProducts.length - 50} more. Download CSV for complete list.
              </p>
            )}
          </div>
        )}

        <div className="bg-barrush-midnight/50 p-4 rounded-lg">
          <h3 className="text-barrush-copper font-semibold mb-2">Image Quality Issues Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-barrush-platinum font-medium mb-1">Common Issues Found:</h4>
              <ul className="text-barrush-platinum/80 space-y-1">
                <li>• Generic fallback images from Unsplash</li>
                <li>• YouTube thumbnails (inappropriate)</li>
                <li>• Social media images (may break)</li>
                <li>• Low resolution thumbnails</li>
                <li>• Blog/Wikipedia images</li>
              </ul>
            </div>
            <div>
              <h4 className="text-barrush-platinum font-medium mb-1">Recommendations:</h4>
              <ul className="text-barrush-platinum/80 space-y-1">
                <li>• Prioritize high-value products first</li>
                <li>• Source from manufacturer websites</li>
                <li>• Use professional product photography</li>
                <li>• Ensure minimum 1000px width</li>
                <li>• Avoid social media sources</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageAuditReport;
