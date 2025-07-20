-- Update image filenames to match exactly what's in the cocktails storage bucket
UPDATE "Cocktails page" 
SET image_filename = CASE 
  WHEN "Name" = 'Cosmopolitan' THEN 'cosmopolitan.jpg'
  WHEN "Name" = 'Daiquiri' THEN 'daiquiri.jpg' 
  WHEN "Name" = 'Espresso Martini' THEN 'Espresso Martini.jpg'
  WHEN "Name" = 'Manhattan' THEN 'manhattan.jpg'
  WHEN "Name" = 'Margarita' THEN 'margarita.jpg'
  WHEN "Name" = 'Martini' THEN 'martini.jpg'
  WHEN "Name" = 'Mojito' THEN 'mojito.jpg'
  WHEN "Name" = 'Moscow Mule' THEN 'moscow mule.jpg'
  WHEN "Name" = 'Negroni' THEN 'negroni.jpg'
  WHEN "Name" = 'Pina Colada' THEN 'pina colada.jpg'
  WHEN "Name" = 'Whiskey Sour' THEN 'Whiskey Sour.jpg'
  ELSE image_filename
END;