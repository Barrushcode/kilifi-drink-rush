-- Add new fields to orders table for the updated checkout flow
ALTER TABLE public.orders 
ADD COLUMN customer_name TEXT,
ADD COLUMN customer_phone TEXT,
ADD COLUMN products TEXT,
ADD COLUMN location TEXT,
ADD COLUMN status TEXT DEFAULT 'paid',
ADD COLUMN rider_id BIGINT REFERENCES public.Contacts(id),
ADD COLUMN distributor_id BIGINT REFERENCES public.Contacts(id);