
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProductUploadSection: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
    } else {
      alert('Please select a valid Excel (.xlsx) file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    // Placeholder for actual upload logic
    setTimeout(() => {
      console.log('File uploaded:', file.name);
      setUploading(false);
      alert('Products uploaded successfully!');
    }, 2000);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-barrush-slate to-barrush-midnight relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-barrush-copper mb-6 font-serif">
              Product Management
            </h2>
            <div className="w-16 h-px bg-barrush-copper mx-auto mb-8"></div>
            <p className="text-xl text-barrush-platinum/90 max-w-2xl mx-auto leading-relaxed">
              Upload your Excel file to manage and update the product catalog
            </p>
          </div>

          <Card className="bg-glass-effect border-barrush-steel/30 border backdrop-blur-md">
            <CardContent className="p-12">
              <div className="space-y-8">
                <div className="bg-barrush-copper/10 border border-barrush-copper/30 rounded-lg p-6">
                  <h3 className="text-2xl font-bold text-barrush-copper mb-4 font-serif">Upload Requirements</h3>
                  <ul className="text-barrush-platinum/90 space-y-2">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-barrush-copper rounded-full mr-3"></span>
                      Excel file format (.xlsx only)
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-barrush-copper rounded-full mr-3"></span>
                      Required columns: Name, Price, Category
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-barrush-copper rounded-full mr-3"></span>
                      Maximum 5MB file size
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-barrush-copper rounded-full mr-3"></span>
                      Product images will be auto-generated
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="excel-file" className="text-barrush-copper text-lg font-medium">
                      Select Excel File
                    </Label>
                    <Input
                      id="excel-file"
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileChange}
                      className="mt-2 bg-glass-effect border-barrush-steel/40 text-barrush-platinum file:bg-barrush-copper file:text-barrush-midnight file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded file:font-medium backdrop-blur-md"
                    />
                  </div>

                  {file && (
                    <div className="bg-barrush-steel/20 border border-barrush-copper/30 rounded-lg p-4">
                      <p className="text-barrush-platinum">
                        <strong className="text-barrush-copper">Selected file:</strong> {file.name}
                      </p>
                      <p className="text-barrush-platinum/80 text-sm">
                        Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full bg-barrush-copper hover:bg-barrush-copper/90 text-barrush-midnight font-bold py-4 text-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload Products'}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-barrush-platinum/70 text-sm">
                    Need help formatting your Excel file? 
                    <Button variant="link" className="text-barrush-copper p-0 ml-1 h-auto">
                      Download template
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductUploadSection;
