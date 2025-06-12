
-- Check if RLS is enabled on the table and disable it for public access to products
ALTER TABLE public.allthealcoholicproducts DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS enabled but allow public read access:
-- ALTER TABLE public.allthealcoholicproducts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access to products" ON public.allthealcoholicproducts
--   FOR SELECT USING (true);
