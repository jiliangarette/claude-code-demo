-- Storage Buckets and Policies
-- Run this after RLS policies

-- =============================================
-- CREATE STORAGE BUCKETS
-- =============================================

-- Note: Run these in Supabase SQL editor or via the dashboard
-- These may need to be run separately if the storage schema isn't accessible

-- Profile photos bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Testimonial photos bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonial-photos', 'testimonial-photos', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STORAGE POLICIES FOR PROFILE PHOTOS
-- =============================================

-- Users can upload their own profile photo
DROP POLICY IF EXISTS "Users can upload own profile photo" ON storage.objects;
CREATE POLICY "Users can upload own profile photo"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can update their own profile photo
DROP POLICY IF EXISTS "Users can update own profile photo" ON storage.objects;
CREATE POLICY "Users can update own profile photo"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own profile photo
DROP POLICY IF EXISTS "Users can delete own profile photo" ON storage.objects;
CREATE POLICY "Users can delete own profile photo"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Public can view all profile photos
DROP POLICY IF EXISTS "Public can view profile photos" ON storage.objects;
CREATE POLICY "Public can view profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

-- =============================================
-- STORAGE POLICIES FOR TESTIMONIAL PHOTOS
-- =============================================

-- Anyone can upload testimonial photos (public submission)
DROP POLICY IF EXISTS "Anyone can upload testimonial photo" ON storage.objects;
CREATE POLICY "Anyone can upload testimonial photo"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'testimonial-photos');

-- Public can view all testimonial photos
DROP POLICY IF EXISTS "Public can view testimonial photos" ON storage.objects;
CREATE POLICY "Public can view testimonial photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'testimonial-photos');
