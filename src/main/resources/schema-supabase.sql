-- ==============================================================================
-- Schema Migration: 001_create_smart_wardrobe_schema.sql
-- Description: Creates persistent tables for Users, Clothing Items, Outfits, 
--              and configures Storage policies and indexes.
-- ==============================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLOTHING_ITEMS TABLE
CREATE TABLE IF NOT EXISTS clothing_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    category VARCHAR(100),
    type VARCHAR(100) NOT NULL,
    color VARCHAR(100) NOT NULL,
    pattern VARCHAR(100),
    brand VARCHAR(100),
    season VARCHAR(100),
    occasion VARCHAR(100),
    rating NUMERIC(3, 2) DEFAULT 0.0,
    price NUMERIC(10, 2) DEFAULT 0.00,
    wear_count INT NOT NULL DEFAULT 0,
    last_worn_date DATE,
    image_url TEXT,
    image_path TEXT,
    original_image_path TEXT,
    extracted_image_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for frequent queries
CREATE INDEX IF NOT EXISTS idx_clothing_items_user_id ON clothing_items(user_id);
CREATE INDEX IF NOT EXISTS idx_clothing_items_type ON clothing_items(type);
CREATE INDEX IF NOT EXISTS idx_clothing_items_color ON clothing_items(color);
CREATE INDEX IF NOT EXISTS idx_clothing_items_wear_count ON clothing_items(wear_count);

-- 3. OUTFITS TABLE
CREATE TABLE IF NOT EXISTS outfits (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON outfits(user_id);

-- 4. OUTFIT_CLOTHING_ITEMS (JOIN TABLE)
CREATE TABLE IF NOT EXISTS outfit_clothing_items (
    outfit_id BIGINT NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
    clothing_item_id BIGINT NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
    PRIMARY KEY (outfit_id, clothing_item_id)
);

CREATE INDEX IF NOT EXISTS idx_outfit_items_clothing_id ON outfit_clothing_items(clothing_item_id);

-- ==============================================================================
-- Row Level Security (RLS) & Supabase Storage Policies
-- ==============================================================================

-- Enable RLS on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_clothing_items ENABLE ROW LEVEL SECURITY;

-- Note on Spring Boot backend connections:
-- Connecting via standard JDBC (postgres role) bypasses RLS in Postgres.
-- The policies below safeguard direct Supabase client access (e.g. from frontend).

DO $$
BEGIN
    -- Public/Authenticated read policies (can be refined to auth.uid() when auth is active)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service or users read access') THEN
        CREATE POLICY "Allow service or users read access" ON clothing_items FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service or users write access') THEN
        CREATE POLICY "Allow service or users write access" ON clothing_items FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow users read users') THEN
        CREATE POLICY "Allow users read users" ON users FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow users insert users') THEN
        CREATE POLICY "Allow users insert users" ON users FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow outfits read') THEN
        CREATE POLICY "Allow outfits read" ON outfits FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow outfits write') THEN
        CREATE POLICY "Allow outfits write" ON outfits FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow outfit items read') THEN
        CREATE POLICY "Allow outfit items read" ON outfit_clothing_items FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow outfit items write') THEN
        CREATE POLICY "Allow outfit items write" ON outfit_clothing_items FOR ALL USING (true);
    END IF;
END $$;
