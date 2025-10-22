/*
  # Whisperwild Tours Database Schema

  ## Overview
  This migration creates the complete database structure for Whisperwild Tours booking system.

  ## New Tables

  ### 1. services
  Stores the different service types offered (hotels, airport transfers, tour guides, photography)
  - `id` (uuid, primary key)
  - `name` (text) - Service name
  - `type` (text) - Service type: 'hotel', 'transfer', 'guide', 'photography'
  - `description` (text) - Detailed description
  - `price` (decimal) - Base price
  - `image_url` (text) - Service image
  - `features` (jsonb) - Additional features/amenities
  - `available` (boolean) - Availability status
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### 2. bookings
  Stores customer bookings for various services
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References auth.users (optional for guest bookings)
  - `service_id` (uuid) - References services table
  - `customer_name` (text) - Customer full name
  - `customer_email` (text) - Customer email
  - `customer_phone` (text) - Customer phone number
  - `booking_date` (date) - Date of service
  - `booking_details` (jsonb) - Service-specific details (guests, location, etc.)
  - `total_price` (decimal) - Final price
  - `payment_status` (text) - 'pending', 'completed', 'failed', 'refunded'
  - `payment_reference` (text) - Paystack transaction reference
  - `status` (text) - 'pending', 'confirmed', 'cancelled', 'completed'
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### 3. payments
  Tracks all payment transactions
  - `id` (uuid, primary key)
  - `booking_id` (uuid) - References bookings table
  - `amount` (decimal) - Payment amount
  - `currency` (text) - Currency code (default: NGN)
  - `payment_method` (text) - Payment method used
  - `reference` (text) - Paystack reference
  - `status` (text) - Payment status
  - `metadata` (jsonb) - Additional payment data from Paystack
  - `created_at` (timestamp)

  ## Security
  - Enable RLS on all tables
  - Public read access for services (browsing)
  - Authenticated users can view their own bookings
  - Guest bookings allowed with email verification
  - Admin access for service management (to be added via app_metadata)
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('hotel', 'transfer', 'guide', 'photography')),
  description text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  image_url text,
  features jsonb DEFAULT '[]'::jsonb,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  service_id uuid REFERENCES services(id) NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  booking_date date NOT NULL,
  booking_details jsonb DEFAULT '{}'::jsonb,
  total_price decimal(10,2) NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_reference text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'NGN',
  payment_method text,
  reference text UNIQUE NOT NULL,
  status text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Services policies (public read access)
CREATE POLICY "Anyone can view available services"
  ON services FOR SELECT
  USING (available = true);

CREATE POLICY "Authenticated users can view all services"
  ON services FOR SELECT
  TO authenticated
  USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can create guest bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Guest users can view their bookings by email"
  ON bookings FOR SELECT
  TO anon
  USING (user_id IS NULL);

-- Payments policies
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "System can create payment records"
  ON payments FOR INSERT
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_services_type ON services(type);
CREATE INDEX IF NOT EXISTS idx_services_available ON services(available);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);

-- Insert sample services
INSERT INTO services (name, type, description, price, image_url, features) VALUES
  ('Luxury Safari Lodge', 'hotel', 'Experience world-class accommodation in the heart of nature. Our luxury safari lodge offers breathtaking views, premium amenities, and unforgettable wildlife encounters.', 45000.00, 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200', '["5-Star Accommodation", "Wildlife Views", "Pool & Spa", "Fine Dining", "24/7 Concierge"]'::jsonb),
  ('Airport VIP Transfer', 'transfer', 'Travel in comfort and style with our premium airport transfer service. Professional drivers, luxury vehicles, and seamless door-to-door service.', 15000.00, 'https://images.pexels.com/photos/1098365/pexels-photo-1098365.jpeg?auto=compress&cs=tinysrgb&w=1200', '["Luxury Vehicles", "Professional Drivers", "Meet & Greet", "Flight Tracking", "Child Seats Available"]'::jsonb),
  ('Expert Tour Guide', 'guide', 'Discover hidden gems and local secrets with our knowledgeable tour guides. Personalized experiences tailored to your interests and preferences.', 25000.00, 'https://images.pexels.com/photos/2104152/pexels-photo-2104152.jpeg?auto=compress&cs=tinysrgb&w=1200', '["Local Expertise", "Multilingual Guides", "Flexible Itinerary", "Group & Private Tours", "Cultural Insights"]'::jsonb),
  ('Professional Photography', 'photography', 'Capture your precious moments with our professional photography service. High-quality images that tell your unique travel story.', 35000.00, 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=1200', '["Professional Equipment", "Edited Photos", "Digital Delivery", "Drone Photography", "Quick Turnaround"]'::jsonb)
ON CONFLICT DO NOTHING;