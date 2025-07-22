-- Create policy to allow public read access to cocktail images
CREATE POLICY "Public access to cocktail images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cocktails');