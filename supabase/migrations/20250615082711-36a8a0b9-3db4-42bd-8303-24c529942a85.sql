
-- Update allthealcoholicproducts with images from products table, matching by Title/name (case-insensitive)
UPDATE allthealcoholicproducts a
SET "Product image URL" = (
  SELECT p.image_url
  FROM products p
  WHERE lower(p.name) = lower(a."Title")
)
WHERE EXISTS (
  SELECT 1
  FROM products p
  WHERE lower(p.name) = lower(a."Title")
      AND p.image_url IS NOT NULL
      AND trim(p.image_url) <> ''
);
