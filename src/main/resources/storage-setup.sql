-- ==============================================================================
-- Supabase Storage Setup: wardrobe-images bucket
-- Run this in Supabase SQL Editor to initialize the storage bucket and policies
-- ==============================================================================

-- 1. Create the bucket (private by default)
INSERT INTO storage.buckets (id, name, public)
VALUES ('wardrobe-images', 'wardrobe-images', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies
-- Allow authenticated users to upload images into their own folder: <user_id>/...
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'wardrobe-images');

-- Allow authenticated users to view images
CREATE POLICY "Allow authenticated users to view images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'wardrobe-images');

-- Allow service role / admin full access
CREATE POLICY "Allow service role full access to wardrobe images"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'wardrobe-images')
WITH CHECK (bucket_id = 'wardrobe-images');
