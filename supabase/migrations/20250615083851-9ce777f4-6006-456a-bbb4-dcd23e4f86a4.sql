
-- Overwrite all Product image URLs for all products using only refinedproductimages based on name (case-insensitive, trimmed)
UPDATE allthealcoholicproducts a
SET "Product image URL" = (
  SELECT r."Final Image URL"
  FROM "refinedproductimages" r
  WHERE trim(lower(r."Product Name")) = trim(lower(a."Title"))
    AND r."Final Image URL" IS NOT NULL
    AND trim(r."Final Image URL") <> ''
  LIMIT 1
);
