
-- a) Priority 1: Assign images by matching names to the products table (case-insensitive, ignoring small differences)
UPDATE allthealcoholicproducts a
SET "Product image URL" = (
  SELECT p.image_url
  FROM products p
  WHERE trim(lower(p.name)) = trim(lower(a."Title"))
    AND p.image_url IS NOT NULL
    AND trim(p.image_url) <> ''
  LIMIT 1
)
WHERE "Product image URL" IS NULL OR "Product image URL" = '';

-- b) Priority 2: If still missing, assign from refinedproductimages by name match
UPDATE allthealcoholicproducts a
SET "Product image URL" = (
  SELECT r."Final Image URL"
  FROM "refinedproductimages" r
  WHERE trim(lower(r."Product Name")) = trim(lower(a."Title"))
    AND r."Final Image URL" IS NOT NULL
    AND trim(r."Final Image URL") <> ''
  LIMIT 1
)
WHERE ("Product image URL" IS NULL OR "Product image URL" = '');
