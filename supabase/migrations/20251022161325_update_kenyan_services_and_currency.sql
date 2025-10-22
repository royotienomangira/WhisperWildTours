/*
  # Update Services for Kenyan Tourism and USD Currency

  ## Overview
  This migration updates the existing services with Kenya-specific content and USD pricing.

  ## Changes
  1. Update currency default from NGN to USD in payments table
  2. Delete existing sample services
  3. Insert new Kenya-specific services with:
     - 5-star luxury lodges (Giraffe Manor, Sarova Stanley)
     - 3-star hotels (Sentrim 680, Nairobi Transit Hotel)
     - Kenyan game reserve images (Maasai Mara, Amboseli)
     - Airport transfers with Kenya context
     - Safari tour guides
     - Photography services for wildlife

  ## Pricing
  All prices converted to USD for international travelers
*/

-- Update currency default in payments table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'currency'
  ) THEN
    ALTER TABLE payments ALTER COLUMN currency SET DEFAULT 'USD';
  END IF;
END $$;

-- Clear existing services
DELETE FROM services;

-- Insert Kenya-specific services with proper USD pricing and authentic Kenyan images
INSERT INTO services (name, type, description, price, image_url, features) VALUES
  (
    'Giraffe Manor - 5-Star Luxury', 
    'hotel', 
    'Experience the iconic Giraffe Manor, Kenya''s most exclusive boutique hotel where resident giraffes visit during breakfast. Located in 12 acres of private land within 140 acres of indigenous forest in Nairobi''s leafy suburb of Langata.', 
    850.00, 
    'https://images.pexels.com/photos/5851389/pexels-photo-5851389.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    '["5-Star Luxury Manor", "Giraffe Encounters", "Butler Service", "Gourmet Dining", "Colonial Architecture", "Private Forest"]'::jsonb
  ),
  (
    'Sarova Stanley - 5-Star Heritage', 
    'hotel', 
    'The legendary Sarova Stanley Hotel in the heart of Nairobi has been welcoming guests since 1902. This iconic 5-star property combines colonial elegance with modern luxury, featuring the famous Thorn Tree Café.', 
    320.00, 
    'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    '["Historic 5-Star Hotel", "City Center Location", "Rooftop Pool", "Multiple Restaurants", "Conference Facilities", "Airport Shuttle"]'::jsonb
  ),
  (
    'Sentrim 680 Hotel - 3-Star Comfort', 
    'hotel', 
    'Modern 3-star accommodation in Nairobi''s business district. Perfect for travelers seeking comfortable, affordable lodging with easy access to the city center, shopping malls, and transportation hubs.', 
    95.00, 
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    '["3-Star Comfort", "Business District", "Free WiFi", "Restaurant & Bar", "Meeting Rooms", "Secure Parking"]'::jsonb
  ),
  (
    'Maasai Mara Safari Lodge - 4-Star', 
    'hotel', 
    'Immerse yourself in the wild beauty of the Maasai Mara. Our safari lodge offers front-row seats to the greatest wildlife show on earth, including the annual wildebeest migration. Wake up to lions roaring and elephants at the watering hole.', 
    450.00, 
    'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    '["Safari Lodge", "Maasai Mara Reserve", "Game Drives Included", "Infinity Pool", "Bush Dinners", "Wildlife Viewing Deck"]'::jsonb
  ),
  (
    'Jomo Kenyatta Airport VIP Transfer', 
    'transfer', 
    'Luxury airport transfer service from Jomo Kenyatta International Airport (JKIA) to anywhere in Nairobi or beyond. Professional drivers with extensive knowledge of Kenya. Meet & greet service, flight tracking, and premium vehicles.', 
    65.00, 
    'https://images.pexels.com/photos/2976443/pexels-photo-2976443.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    '["JKIA Airport Pickup", "Luxury 4x4 Vehicles", "Professional Drivers", "Flight Tracking", "Meet & Greet", "Child Seats Available"]'::jsonb
  ),
  (
    'Mombasa Airport Transfer', 
    'transfer', 
    'Comfortable transfer service from Moi International Airport in Mombasa to your coastal resort, Diani Beach, or anywhere in Mombasa. Air-conditioned vehicles perfect for Kenya''s tropical climate.', 
    55.00, 
    'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    '["Mombasa Airport", "Beach Resort Transfers", "AC Vehicles", "Coastal Knowledge", "Flexible Scheduling", "Luggage Assistance"]'::jsonb
  ),
  (
    'Expert Safari Guide - Maasai Mara', 
    'guide', 
    'Experience the Maasai Mara with certified safari guides who know every pride of lions, leopard territory, and migration crossing point. Our guides are trained naturalists with years of experience tracking the Big Five.', 
    120.00, 
    'https://images.pexels.com/photos/2923590/pexels-photo-2923590.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    '["Certified Safari Guide", "Big Five Expert", "Maasai Cultural Insights", "Wildlife Photography Tips", "Full Day Safari", "Multilingual"]'::jsonb
  ),
  (
    'Nairobi City & Culture Tour Guide', 
    'guide', 
    'Discover Nairobi''s rich history and vibrant culture with knowledgeable local guides. Visit the Giraffe Centre, David Sheldrick Elephant Orphanage, Karen Blixen Museum, and experience authentic Kenyan cuisine and markets.', 
    80.00, 
    'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    '["Local Expert", "Cultural Sites", "Wildlife Centers", "Market Tours", "Historical Insights", "Transportation Included"]'::jsonb
  ),
  (
    'Wildlife Safari Photography', 
    'photography', 
    'Capture Kenya''s incredible wildlife with professional safari photographers. Specializing in Big Five photography, bird photography, and the Great Migration. High-resolution images, drone photography available for landscapes.', 
    180.00, 
    'https://images.pexels.com/photos/1170371/pexels-photo-1170371.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    '["Professional Wildlife Photography", "Big Five Specialists", "Drone Photography", "200+ Edited Photos", "Same Day Preview", "RAW Files Included"]'::jsonb
  ),
  (
    'Portrait & Travel Photography', 
    'photography', 
    'Professional photography for your Kenyan adventure. Whether it''s family portraits at sunset, cultural experiences with Maasai warriors, or beach moments in Diani, we capture your memories in stunning detail.', 
    140.00, 
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1200', 
    '["Travel Photography", "Portrait Sessions", "Cultural Photography", "Beach & Sunset", "100+ Edited Photos", "Online Gallery"]'::jsonb
  )
ON CONFLICT DO NOTHING;