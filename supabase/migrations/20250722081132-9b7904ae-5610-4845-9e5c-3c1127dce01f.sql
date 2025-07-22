-- First, drop the potentially conflicting policies
DROP POLICY IF EXISTS "Public read access to Cocktails" ON storage.objects;
DROP POLICY IF EXISTS "Public access to cocktail images" ON storage.objects;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a comprehensive policy for the cocktails bucket
CREATE POLICY "Enable public read access for cocktails bucket" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'cocktails');