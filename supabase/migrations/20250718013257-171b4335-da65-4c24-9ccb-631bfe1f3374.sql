-- Rename images to match product names more closely

-- Rename PATRON XO CAF750ML.jpeg to PATRON XO Cafe750ML.jpeg
UPDATE storage.objects 
SET name = 'PATRON XO Cafe750ML.jpeg'
WHERE bucket_id = 'pictures' AND name = 'PATRON XO  CAF750ML.jpeg';

-- Rename BARDINET CREAM DEL MENTHE to be more generic for CREME DE MENTHE matching
UPDATE storage.objects 
SET name = 'CREME DE MENTHE 750ML.jpg'
WHERE bucket_id = 'pictures' AND name = 'BARDINET CREAM DEL MENTHE 750ML.jpg';