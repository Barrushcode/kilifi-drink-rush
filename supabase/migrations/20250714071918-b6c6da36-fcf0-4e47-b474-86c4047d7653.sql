-- Update image filenames to remove accents and ensure consistency
UPDATE "Cocktails page" 
SET image_filename = CASE 
  WHEN "Name" = 'Piña Colada' THEN 'pina-colada.jpg'
  WHEN "Name" = 'Whiskey Sour' THEN 'whiskey-sour.jpg'
  WHEN "Name" = 'Moscow Mule' THEN 'moscow-mule.jpg'
  WHEN "Name" = 'Espresso Martini' THEN 'espresso-martini.jpg'
  ELSE image_filename
END;