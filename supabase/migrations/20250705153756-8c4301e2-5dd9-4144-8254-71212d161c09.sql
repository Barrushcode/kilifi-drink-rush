-- Drop the existing admin policy that references auth.users directly
DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;

-- Create a simpler admin policy that doesn't reference auth.users
-- This will allow any authenticated user to view orders
-- In a production environment, you'd want to create a proper profiles table
-- or use a different approach for admin access control
CREATE POLICY "Allow authenticated users to view orders" ON public.orders
  FOR SELECT
  USING (auth.uid() IS NOT NULL);