-- Create comprehensive storage policies for the pictures bucket
-- First, delete any existing policies for the pictures bucket
DROP POLICY IF EXISTS "Public read access to pictures images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to pictures" ON storage.objects;

-- Create a simple, permissive read policy for the pictures bucket
CREATE POLICY "Allow public read access to pictures bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pictures');

-- Allow public access to insert into pictures bucket (if needed for admin uploads)
CREATE POLICY "Allow public upload to pictures bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'pictures');

-- Allow public access to update pictures (if needed)
CREATE POLICY "Allow public update to pictures bucket"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'pictures');

-- Allow public delete access (if needed for admin)
CREATE POLICY "Allow public delete from pictures bucket"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'pictures');