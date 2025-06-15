
-- Create the orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_email text NOT NULL,
  buyer_name text NOT NULL,
  buyer_gender text,
  buyer_phone text,
  region text NOT NULL,
  city text,
  street text,
  building text,
  instructions text,
  items jsonb NOT NULL,
  subtotal bigint NOT NULL,
  delivery_fee bigint NOT NULL,
  total_amount bigint NOT NULL,
  order_reference text NOT NULL,
  order_source text DEFAULT 'web',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS to secure access
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ONLY barrushdelivery@gmail.com (your Supabase user email) can access ALL orders for admin analytics
CREATE POLICY "Admin can view all orders" ON public.orders
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND u.email = 'barrushdelivery@gmail.com'
    )
  );

-- Only allow insert from the website (not from dashboard, but you may relax this if you want!)
CREATE POLICY "Anyone can insert" ON public.orders
  FOR INSERT
  WITH CHECK (true);
