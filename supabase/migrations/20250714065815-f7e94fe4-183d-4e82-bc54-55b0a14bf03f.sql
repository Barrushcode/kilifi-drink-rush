-- Add image_filename column to store the image file names
ALTER TABLE "Cocktails page" 
ADD COLUMN image_filename TEXT;

-- Update existing cocktails with image filenames (matching the names)
UPDATE "Cocktails page" 
SET image_filename = CASE 
  WHEN "Name" = 'Cosmopolitan' THEN 'cosmopolitan.jpg'
  WHEN "Name" = 'Daiquiri' THEN 'daiquiri.jpg'
  WHEN "Name" = 'Espresso Martini' THEN 'espresso-martini.jpg'
  WHEN "Name" = 'Manhattan' THEN 'manhattan.jpg'
  WHEN "Name" = 'Margarita' THEN 'margarita.jpg'
  ELSE LOWER(REPLACE("Name", ' ', '-')) || '.jpg'
END;