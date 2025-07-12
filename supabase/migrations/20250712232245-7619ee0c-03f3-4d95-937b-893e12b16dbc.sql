-- Recreate orders table with all required columns
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  buyer_email TEXT NOT NULL,
  buyer_name TEXT,
  buyer_gender TEXT,
  buyer_phone TEXT,
  region TEXT NOT NULL,
  city TEXT,
  street TEXT,
  building TEXT,
  instructions TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  order_reference TEXT UNIQUE NOT NULL,
  order_source TEXT DEFAULT 'web',
  customer_name TEXT,
  customer_phone TEXT,
  products TEXT,
  location TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (no authentication required)
CREATE POLICY "Allow public insert orders" 
ON public.orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Create policy to allow public read (for order confirmations)
CREATE POLICY "Allow public read orders" 
ON public.orders 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();