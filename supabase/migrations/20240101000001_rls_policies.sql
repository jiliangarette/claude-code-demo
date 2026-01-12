-- Row Level Security Policies
-- Run this after the initial schema

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES POLICIES
-- =============================================

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Public can view published profiles
DROP POLICY IF EXISTS "Public can view published profiles" ON public.profiles;
CREATE POLICY "Public can view published profiles"
  ON public.profiles FOR SELECT
  USING (is_published = true);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Profile creation is handled by trigger, but allow for edge cases
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- CREDENTIALS POLICIES
-- =============================================

-- Users can manage their own credentials
DROP POLICY IF EXISTS "Users can manage own credentials" ON public.credentials;
CREATE POLICY "Users can manage own credentials"
  ON public.credentials FOR ALL
  USING (profile_id = auth.uid());

-- Public can view credentials of published profiles
DROP POLICY IF EXISTS "Public can view credentials of published profiles" ON public.credentials;
CREATE POLICY "Public can view credentials of published profiles"
  ON public.credentials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = credentials.profile_id
      AND profiles.is_published = true
    )
  );

-- =============================================
-- SERVICES POLICIES
-- =============================================

-- Anyone can view active services
DROP POLICY IF EXISTS "Anyone can view services" ON public.services;
CREATE POLICY "Anyone can view services"
  ON public.services FOR SELECT
  USING (is_active = true);

-- =============================================
-- PROFILE_SERVICES POLICIES
-- =============================================

-- Users can manage their own profile services
DROP POLICY IF EXISTS "Users can manage own profile services" ON public.profile_services;
CREATE POLICY "Users can manage own profile services"
  ON public.profile_services FOR ALL
  USING (profile_id = auth.uid());

-- Public can view services of published profiles
DROP POLICY IF EXISTS "Public can view services of published profiles" ON public.profile_services;
CREATE POLICY "Public can view services of published profiles"
  ON public.profile_services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = profile_services.profile_id
      AND profiles.is_published = true
    )
  );

-- =============================================
-- TESTIMONIALS POLICIES
-- =============================================

-- Consultants can view all their testimonials (any status)
DROP POLICY IF EXISTS "Consultants can view own testimonials" ON public.testimonials;
CREATE POLICY "Consultants can view own testimonials"
  ON public.testimonials FOR SELECT
  USING (profile_id = auth.uid());

-- Public can view approved testimonials of published profiles
DROP POLICY IF EXISTS "Public can view approved testimonials" ON public.testimonials;
CREATE POLICY "Public can view approved testimonials"
  ON public.testimonials FOR SELECT
  USING (
    status = 'approved' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = testimonials.profile_id
      AND profiles.is_published = true
    )
  );

-- Anyone can submit testimonials (public form)
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON public.testimonials;
CREATE POLICY "Anyone can submit testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (true);

-- Only profile owner can update testimonials (approve/reject)
DROP POLICY IF EXISTS "Consultants can update own testimonials" ON public.testimonials;
CREATE POLICY "Consultants can update own testimonials"
  ON public.testimonials FOR UPDATE
  USING (profile_id = auth.uid());

-- Only profile owner can delete testimonials
DROP POLICY IF EXISTS "Consultants can delete own testimonials" ON public.testimonials;
CREATE POLICY "Consultants can delete own testimonials"
  ON public.testimonials FOR DELETE
  USING (profile_id = auth.uid());
