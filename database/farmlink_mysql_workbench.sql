-- ============================================================================
-- FarmLink — Direct Agricultural Negotiation Marketplace
-- MySQL Workbench Schema, Foreign Key Relationships, Seed Data & Views
-- Compatible with MySQL 8.0+ / MySQL Workbench
-- ============================================================================

CREATE DATABASE IF NOT EXISTS farmlink1_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE farmlink1_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS vw_active_listings_with_mandi;
DROP VIEW IF EXISTS vw_negotiation_summary;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS saved_alerts;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS negotiation_rounds;
DROP TABLE IF EXISTS negotiations;
DROP TABLE IF EXISTS produce_listings;
DROP TABLE IF EXISTS price_index;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. USERS TABLE (Farmers, Buyers, Admins)
-- ============================================================================
CREATE TABLE users (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) DEFAULT 'password123',
  role ENUM('farmer', 'buyer', 'admin') NOT NULL DEFAULT 'farmer',
  is_verified TINYINT(1) NOT NULL DEFAULT 1,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  registered_date DATE NOT NULL,
  -- Farmer-specific columns
  farm_address VARCHAR(255) DEFAULT NULL,
  farm_lat DECIMAL(10, 6) DEFAULT NULL,
  farm_lng DECIMAL(10, 6) DEFAULT NULL,
  farm_district VARCHAR(100) DEFAULT NULL,
  rating DECIMAL(3, 2) DEFAULT 5.00,
  rating_count INT DEFAULT 1,
  member_since VARCHAR(50) DEFAULT 'Just now',
  -- Buyer-specific column
  business_type ENUM('Household', 'Vendor', 'Restaurant', 'Wholesaler') DEFAULT NULL,
  INDEX idx_users_role (role),
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- ============================================================================
-- 2. PRICE_INDEX TABLE (Master Crop Catalog & APMC Mandi Benchmarks)
-- ============================================================================
CREATE TABLE price_index (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  category VARCHAR(80) NOT NULL,
  base_unit VARCHAR(30) NOT NULL DEFAULT 'kg',
  mandi_price DECIMAL(10, 2) NOT NULL,
  mandi_min_price DECIMAL(10, 2) NOT NULL,
  mandi_max_price DECIMAL(10, 2) NOT NULL,
  last_updated VARCHAR(64) NOT NULL DEFAULT 'Today, 06:00 AM',
  INDEX idx_price_index_name (name)
) ENGINE=InnoDB;

-- ============================================================================
-- 3. PRODUCE_LISTINGS TABLE
-- ============================================================================
CREATE TABLE produce_listings (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  farmer_id VARCHAR(64) NOT NULL,
  farmer_name VARCHAR(120) NOT NULL,
  farmer_rating DECIMAL(3, 2) NOT NULL DEFAULT 4.80,
  farmer_phone VARCHAR(30) NOT NULL,
  crop_name VARCHAR(120) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(30) NOT NULL DEFAULT 'kg',
  asking_price DECIMAL(10, 2) NOT NULL,
  harvest_date DATE NOT NULL,
  posted_date VARCHAR(64) NOT NULL DEFAULT 'Posted just now',
  distance_km DECIMAL(6, 2) NOT NULL DEFAULT 5.00,
  farm_address VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 6) NOT NULL,
  lng DECIMAL(10, 6) NOT NULL,
  photo_url TEXT NOT NULL,
  status ENUM('Active', 'Expired') NOT NULL DEFAULT 'Active',
  available_for_delivery TINYINT(1) NOT NULL DEFAULT 0,
  notes TEXT DEFAULT NULL,
  CONSTRAINT fk_listing_farmer FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_listings_crop (crop_name),
  INDEX idx_listings_status (status),
  INDEX idx_listings_farmer (farmer_id)
) ENGINE=InnoDB;

-- ============================================================================
-- 4. NEGOTIATIONS TABLE (Max 4 Rounds per Offer Thread)
-- ============================================================================
CREATE TABLE negotiations (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  listing_id VARCHAR(64) NOT NULL,
  crop_name VARCHAR(120) NOT NULL,
  crop_photo TEXT NOT NULL,
  unit VARCHAR(30) NOT NULL,
  asking_price DECIMAL(10, 2) NOT NULL,
  buyer_id VARCHAR(64) NOT NULL,
  buyer_name VARCHAR(120) NOT NULL,
  buyer_phone VARCHAR(30) NOT NULL,
  farmer_id VARCHAR(64) NOT NULL,
  farmer_name VARCHAR(120) NOT NULL,
  farmer_phone VARCHAR(30) NOT NULL,
  farm_address VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 6) NOT NULL,
  lng DECIMAL(10, 6) NOT NULL,
  current_round TINYINT NOT NULL DEFAULT 1,
  status ENUM('active', 'accepted', 'rejected', 'expired') NOT NULL DEFAULT 'active',
  turn ENUM('buyer', 'farmer') NOT NULL DEFAULT 'farmer',
  final_price DECIMAL(10, 2) DEFAULT NULL,
  final_quantity DECIMAL(10, 2) DEFAULT NULL,
  created_at VARCHAR(64) NOT NULL,
  updated_at VARCHAR(64) NOT NULL,
  CONSTRAINT chk_max_rounds CHECK (current_round BETWEEN 1 AND 4),
  CONSTRAINT fk_neg_listing FOREIGN KEY (listing_id) REFERENCES produce_listings(id) ON DELETE CASCADE,
  CONSTRAINT fk_neg_buyer FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_neg_farmer FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_neg_listing (listing_id),
  INDEX idx_neg_buyer (buyer_id),
  INDEX idx_neg_farmer (farmer_id)
) ENGINE=InnoDB;

-- ============================================================================
-- 5. NEGOTIATION_ROUNDS TABLE (Individual Offer / Counter-Offer Rounds 1..4)
-- ============================================================================
CREATE TABLE negotiation_rounds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  negotiation_id VARCHAR(64) NOT NULL,
  round_number TINYINT NOT NULL,
  sender_role ENUM('buyer', 'farmer') NOT NULL,
  sender_id VARCHAR(64) NOT NULL,
  sender_name VARCHAR(120) NOT NULL,
  offered_price DECIMAL(10, 2) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  timestamp_label VARCHAR(64) NOT NULL,
  message TEXT DEFAULT NULL,
  CONSTRAINT chk_round_num CHECK (round_number BETWEEN 1 AND 4),
  CONSTRAINT fk_round_negotiation FOREIGN KEY (negotiation_id) REFERENCES negotiations(id) ON DELETE CASCADE,
  INDEX idx_rounds_neg (negotiation_id)
) ENGINE=InnoDB;

-- ============================================================================
-- 6. ORDERS TABLE (Generated When an Offer is Accepted — Cash on Pickup)
-- ============================================================================
CREATE TABLE orders (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  negotiation_id VARCHAR(64) NOT NULL,
  listing_id VARCHAR(64) NOT NULL,
  crop_name VARCHAR(120) NOT NULL,
  crop_photo TEXT NOT NULL,
  buyer_id VARCHAR(64) NOT NULL,
  buyer_name VARCHAR(120) NOT NULL,
  buyer_phone VARCHAR(30) NOT NULL,
  farmer_id VARCHAR(64) NOT NULL,
  farmer_name VARCHAR(120) NOT NULL,
  farmer_phone VARCHAR(30) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(30) NOT NULL,
  final_price_per_unit DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  pickup_location VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 6) NOT NULL,
  lng DECIMAL(10, 6) NOT NULL,
  status ENUM('Pending Pickup', 'Completed', 'Disputed', 'Cancelled') NOT NULL DEFAULT 'Pending Pickup',
  payment_mode VARCHAR(50) NOT NULL DEFAULT 'Cash on Pickup',
  created_at VARCHAR(64) NOT NULL,
  completed_at VARCHAR(64) DEFAULT NULL,
  dispute_reason TEXT DEFAULT NULL,
  dispute_resolution TEXT DEFAULT NULL,
  CONSTRAINT fk_order_buyer FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_farmer FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_orders_status (status)
) ENGINE=InnoDB;

-- ============================================================================
-- 7. SAVED_ALERTS TABLE (Buyer Crop Availability Subscriptions)
-- ============================================================================
CREATE TABLE saved_alerts (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  buyer_id VARCHAR(64) NOT NULL,
  crop_name VARCHAR(120) NOT NULL,
  max_radius_km INT NOT NULL DEFAULT 15,
  created_at DATE NOT NULL,
  match_count INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_alert_buyer FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 8. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE notifications (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  title VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('offer_received', 'offer_accepted', 'offer_rejected', 'counter_offer', 'listing_expiring', 'alert_match', 'order_update', 'dispute_alert') NOT NULL,
  link_tab VARCHAR(64) DEFAULT NULL,
  link_id VARCHAR(64) DEFAULT NULL,
  timestamp_label VARCHAR(64) NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user (user_id, is_read)
) ENGINE=InnoDB;

-- ============================================================================
-- 9. AUDIT_LOGS TABLE (Admin Moderation & Mandi Price Updates)
-- ============================================================================
CREATE TABLE audit_logs (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  admin_action VARCHAR(180) NOT NULL,
  target VARCHAR(255) NOT NULL,
  timestamp_label VARCHAR(64) NOT NULL,
  admin_email VARCHAR(150) NOT NULL
) ENGINE=InnoDB;

-- ============================================================================
-- SEED DATA FOR MYSQL WORKBENCH
-- ============================================================================
INSERT INTO users (id, name, phone, email, password_hash, role, is_verified, is_active, registered_date, farm_address, farm_lat, farm_lng, farm_district, rating, rating_count, member_since, business_type) VALUES
('user-farmer-1', 'Ramesh Patel', '+91 98234 56789', 'farmer@farmlink.org', 'password123', 'farmer', 1, 1, '2025-11-12', 'Green Valley Organic Farm, Khed Taluka, Pune District', 18.847200, 73.896400, 'Pune', 4.80, 34, 'Nov 2025', NULL),
('user-farmer-2', 'Sukhdev Singh', '+91 97112 33445', 'sukhdev@farmlink.org', 'password123', 'farmer', 1, 1, '2025-12-04', 'Golden Harvest Fields, Shirur Road, Pune District', 18.826500, 74.374200, 'Pune', 4.60, 19, 'Dec 2025', NULL),
('user-buyer-1', 'Pooja Deshmukh', '+91 99887 66554', 'buyer@farmlink.org', 'password123', 'buyer', 1, 1, '2026-01-10', NULL, NULL, NULL, NULL, NULL, NULL, 'Jan 2026', 'Restaurant'),
('user-buyer-2', 'Vikram Mehta (FreshMart)', '+91 98100 22334', 'vikram@freshmart.in', 'password123', 'buyer', 1, 1, '2026-02-01', NULL, NULL, NULL, NULL, NULL, NULL, 'Feb 2026', 'Wholesaler'),
('user-admin-1', 'Ananya Sharma (Admin)', '+91 90000 11111', 'admin@farmlink.org', 'adminpassword', 'admin', 1, 1, '2025-10-01', NULL, NULL, NULL, NULL, NULL, NULL, 'Oct 2025', NULL);

INSERT INTO price_index (id, name, category, base_unit, mandi_price, mandi_min_price, mandi_max_price, last_updated) VALUES
('crop-1', 'Tomatoes (Hybrid Red)', 'Vegetables', 'kg', 24.00, 21.00, 28.00, 'Today, 06:30 AM'),
('crop-2', 'Onions (Nashik Red)', 'Vegetables', 'kg', 32.00, 29.00, 36.00, 'Today, 06:30 AM'),
('crop-3', 'Potatoes (Agraufri Jyoti)', 'Vegetables', 'kg', 20.00, 18.00, 23.00, 'Today, 06:30 AM'),
('crop-4', 'Alphonso Mangoes', 'Fruits', 'dozen', 480.00, 420.00, 550.00, 'Today, 06:30 AM'),
('crop-5', 'Green Chillies (Teja)', 'Spices & Herbs', 'kg', 45.00, 40.00, 52.00, 'Today, 06:30 AM'),
('crop-6', 'Cauliflower (Fresh)', 'Vegetables', 'crate', 350.00, 310.00, 390.00, 'Today, 06:30 AM'),
('crop-7', 'Pomegranates (Bhagwa)', 'Fruits', 'kg', 110.00, 95.00, 125.00, 'Today, 06:30 AM'),
('crop-8', 'Sweet Corn (Golden)', 'Grains & Pulses', 'kg', 18.00, 16.00, 21.00, 'Today, 06:30 AM');

INSERT INTO produce_listings (id, farmer_id, farmer_name, farmer_rating, farmer_phone, crop_name, quantity, unit, asking_price, harvest_date, posted_date, distance_km, farm_address, lat, lng, photo_url, status, available_for_delivery, notes) VALUES
('list-1', 'user-farmer-1', 'Ramesh Patel', 4.80, '+91 98234 56789', 'Tomatoes (Hybrid Red)', 850.00, 'kg', 26.00, '2026-09-08', 'Posted 1 day ago', 6.40, 'Green Valley Organic Farm, Khed Taluka, Pune District', 18.847200, 73.896400, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80', 'Active', 1, 'Firm grade-A vine-ripened tomatoes. Sorted and crated at sunrise.'),
('list-2', 'user-farmer-1', 'Ramesh Patel', 4.80, '+91 98234 56789', 'Onions (Nashik Red)', 1200.00, 'kg', 34.00, '2026-09-06', 'Posted 3 days ago', 6.40, 'Green Valley Organic Farm, Khed Taluka, Pune District', 18.847200, 73.896400, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80', 'Active', 1, 'Dry-cured medium-large bulbs with long shelf stability.'),
('list-3', 'user-farmer-2', 'Sukhdev Singh', 4.60, '+91 97112 33445', 'Green Chillies (Teja)', 300.00, 'kg', 48.00, '2026-09-09', 'Posted 4 hours ago', 9.20, 'Golden Harvest Fields, Shirur Road, Pune District', 18.826500, 74.374200, 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80', 'Active', 0, 'Freshly picked pungent green chillies ideal for restaurant kitchens.'),
('list-4', 'user-farmer-2', 'Sukhdev Singh', 4.60, '+91 97112 33445', 'Pomegranates (Bhagwa)', 450.00, 'kg', 115.00, '2026-09-07', 'Posted 2 days ago', 9.20, 'Golden Harvest Fields, Shirur Road, Pune District', 18.826500, 74.374200, 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=600&auto=format&fit=crop&q=80', 'Active', 1, 'Export quality ruby-red arils, 250g+ average fruit weight.');

-- ============================================================================
-- HELPFUL VIEWS FOR MYSQL WORKBENCH ANALYTICS
-- ============================================================================
CREATE VIEW vw_active_listings_with_mandi AS
SELECT
  l.id AS listing_id,
  l.crop_name,
  l.farmer_name,
  l.quantity,
  l.unit,
  l.asking_price,
  p.mandi_price,
  ROUND(l.asking_price - p.mandi_price, 2) AS variance_from_mandi,
  l.distance_km,
  l.harvest_date,
  l.status
FROM produce_listings l
LEFT JOIN price_index p ON l.crop_name = p.name
WHERE l.status = 'Active';

CREATE VIEW vw_negotiation_summary AS
SELECT
  n.id AS negotiation_id,
  n.crop_name,
  n.buyer_name,
  n.farmer_name,
  n.asking_price,
  n.current_round,
  n.status,
  n.turn,
  n.final_price,
  n.final_quantity
FROM negotiations n;
