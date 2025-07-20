import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CocktailImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [cocktailName, setCocktailName] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive"
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !cocktailName) {
      toast({
        title: "Missing information",
        description: "Please select an image and enter a cocktail name",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Create filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${cocktailName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${fileExt}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('cocktails')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Update cocktails table
      const { error: updateError } = await supabase
        .from('Cocktails page')
        .update({ image_filename: fileName })
        .eq('Name', cocktailName);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Upload successful",
        description: `Image uploaded and cocktail "${cocktailName}" updated!`
      });

      // Reset form
      setFile(null);
      setCocktailName('');
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-glass-effect border border-barrush-steel/30 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-barrush-platinum font-serif flex items-center gap-2">
          <Upload className="h-5 w-5 text-neon-pink" />
          Upload Cocktail Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cocktail-name" className="text-barrush-platinum font-iphone">
            Cocktail Name
          </Label>
          <Input
            id="cocktail-name"
            type="text"
            value={cocktailName}
            onChange={(e) => setCocktailName(e.target.value)}
            placeholder="Enter cocktail name"
            className="bg-barrush-midnight/50 border-barrush-steel/30 text-barrush-platinum placeholder:text-barrush-platinum/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image-upload" className="text-barrush-platinum font-iphone">
            Cocktail Image
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="bg-barrush-midnight/50 border-barrush-steel/30 text-barrush-platinum file:bg-neon-pink file:text-barrush-midnight file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:text-sm file:font-medium"
          />
        </div>

        {file && (
          <div className="text-sm text-barrush-platinum/70 font-iphone">
            Selected: {file.name}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || !cocktailName || uploading}
          className="w-full bg-neon-pink text-barrush-midnight hover:bg-neon-pink/90 font-iphone"
        >
          {uploading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CocktailImageUpload;