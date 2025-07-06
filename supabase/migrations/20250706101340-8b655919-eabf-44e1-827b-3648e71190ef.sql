-- Add support for multiple riders by changing rider_id to an array
ALTER TABLE public.orders 
DROP COLUMN rider_id;

ALTER TABLE public.orders 
ADD COLUMN rider_ids integer[];

-- Update the foreign key constraint for rider_ids
-- Note: PostgreSQL doesn't support array foreign keys directly, 
-- so we'll handle validation in the application layer