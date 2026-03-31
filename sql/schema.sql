-- ============================================================
-- O.S.P. Portal — Full Database Schema
-- Run this in Supabase SQL Editor (single execution)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. PROFILES (extends auth.users)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- 2. is_admin() — SECURITY DEFINER to avoid recursion
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ────────────────────────────────────────────────────────────
-- 3. PROFILES RLS — never queries profiles from within itself
-- ────────────────────────────────────────────────────────────
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (is_admin());

-- ────────────────────────────────────────────────────────────
-- 4. AUTO-CREATE PROFILE TRIGGER
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 5. CIVIC PROJECTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.civic_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('deployed', 'pending')),
  color TEXT DEFAULT '#58A6FF',
  tags TEXT[] DEFAULT '{}',
  url TEXT,
  logo_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.civic_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read civic projects"
  ON public.civic_projects FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert civic projects"
  ON public.civic_projects FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update civic projects"
  ON public.civic_projects FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete civic projects"
  ON public.civic_projects FOR DELETE
  USING (is_admin());

-- ────────────────────────────────────────────────────────────
-- 6. SERVICES
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  pricing_summary TEXT,
  url TEXT,
  logo_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read services"
  ON public.services FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert services"
  ON public.services FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update services"
  ON public.services FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete services"
  ON public.services FOR DELETE
  USING (is_admin());

-- ────────────────────────────────────────────────────────────
-- 7. PATENTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.patents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('defense', 'energy', 'food', 'fintech', 'civic', 'other')),
  status TEXT NOT NULL DEFAULT 'concept' CHECK (status IN ('concept', 'provisional_filed', 'published', 'pending')),
  repo_url TEXT,
  document_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.patents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read patents"
  ON public.patents FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert patents"
  ON public.patents FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update patents"
  ON public.patents FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete patents"
  ON public.patents FOR DELETE
  USING (is_admin());

-- ────────────────────────────────────────────────────────────
-- 8. VOICE SUBMISSIONS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.voice_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  identity_mode TEXT NOT NULL DEFAULT 'anonymous' CHECK (identity_mode IN ('anonymous', 'username', 'full')),
  display_name TEXT,
  upvote_count INT NOT NULL DEFAULT 0,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.voice_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read public approved submissions"
  ON public.voice_submissions FOR SELECT
  USING (visibility = 'public' AND is_approved = true);

CREATE POLICY "Admins can read all submissions"
  ON public.voice_submissions FOR SELECT
  USING (is_admin());

CREATE POLICY "Users can read own submissions"
  ON public.voice_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert submissions"
  ON public.voice_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update submissions"
  ON public.voice_submissions FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete submissions"
  ON public.voice_submissions FOR DELETE
  USING (is_admin());

-- ────────────────────────────────────────────────────────────
-- 9. VOICE UPVOTES
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.voice_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.voice_submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(submission_id, user_id)
);

ALTER TABLE public.voice_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read upvotes"
  ON public.voice_upvotes FOR SELECT
  USING (true);

CREATE POLICY "Auth users can insert own upvotes"
  ON public.voice_upvotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own upvotes"
  ON public.voice_upvotes FOR DELETE
  USING (auth.uid() = user_id);

-- Increment/decrement upvote_count trigger
CREATE OR REPLACE FUNCTION public.handle_upvote_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.voice_submissions
    SET upvote_count = upvote_count + 1
    WHERE id = NEW.submission_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.voice_submissions
    SET upvote_count = upvote_count - 1
    WHERE id = OLD.submission_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE OR REPLACE TRIGGER on_upvote_change
  AFTER INSERT OR DELETE ON public.voice_upvotes
  FOR EACH ROW EXECUTE FUNCTION public.handle_upvote_change();

-- ────────────────────────────────────────────────────────────
-- 10. SITE CONTENT (key-value for editable text)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  body TEXT,
  section TEXT NOT NULL DEFAULT 'general',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site content"
  ON public.site_content FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update site content"
  ON public.site_content FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete site content"
  ON public.site_content FOR DELETE
  USING (is_admin());

-- ────────────────────────────────────────────────────────────
-- 11. UPDATED_AT TRIGGER (reusable)
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.civic_projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.patents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.voice_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ────────────────────────────────────────────────────────────
-- 12. STORAGE BUCKETS
-- ────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('patents', 'patents', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies: anyone can read, admins can upload
CREATE POLICY "Public read logos" ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');
CREATE POLICY "Admin upload logos" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'logos' AND public.is_admin());
CREATE POLICY "Admin update logos" ON storage.objects FOR UPDATE
  USING (bucket_id = 'logos' AND public.is_admin());
CREATE POLICY "Admin delete logos" ON storage.objects FOR DELETE
  USING (bucket_id = 'logos' AND public.is_admin());

CREATE POLICY "Public read patents" ON storage.objects FOR SELECT
  USING (bucket_id = 'patents');
CREATE POLICY "Admin upload patents" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'patents' AND public.is_admin());
CREATE POLICY "Admin update patents" ON storage.objects FOR UPDATE
  USING (bucket_id = 'patents' AND public.is_admin());
CREATE POLICY "Admin delete patents" ON storage.objects FOR DELETE
  USING (bucket_id = 'patents' AND public.is_admin());

-- ════════════════════════════════════════════════════════════
-- SEED DATA
-- ════════════════════════════════════════════════════════════

-- Civic Projects
INSERT INTO public.civic_projects (name, subtitle, description, status, color, tags, url, sort_order) VALUES
  ('Canaan Road Watch', 'CITIZEN ROAD ACCOUNTABILITY', 'Community reporting and accountability platform for road conditions in Canaan, NH. Track potholes, frost heaves, grading failures.', 'deployed', '#EF4444', ARRAY['Roads', 'Local Gov', 'Canaan NH'], 'https://canaanroads.com', 1),
  ('CongressWatch', 'CONGRESSIONAL ANOMALY SCORING', 'Anomaly scoring of congressional members based on voting patterns, donor influence, insider trading signals, and deviation from constituent interests.', 'deployed', '#3B82F6', ARRAY['Congress', 'Insider Trading', 'Donor Influence'], 'https://congresswatch.vercel.app', 2),
  ('Canaan Budget Watch', 'YOUR TAX DOLLARS — DIGITIZED', 'Full transparency dashboard for Canaan, NH town budget. Every department, every salary, every dollar.', 'pending', '#22C55E', ARRAY['Budget', 'Salaries', 'Canaan NH'], NULL, 3),
  ('SENTINEL / VIGIL', 'GOVERNMENT ACCOUNTABILITY DETECTION', 'Automated detection of corruption patterns, conflicts of interest, and anomalous behavior across government officials.', 'pending', '#A855F7', ARRAY['Corruption', 'Transparency', 'Accountability'], NULL, 4),
  ('DOCKWATCH', 'COMMUNITY PORT INTELLIGENCE', 'Anonymous citizen reporting of suspicious activity and potential trafficking at shipping docks and port areas.', 'pending', '#FF2E2E', ARRAY['Trafficking', 'Port Security', 'Whistleblower'], NULL, 5),
  ('Project NARC', 'OPIOID CRISIS GEOSPATIAL INTELLIGENCE', 'Real-time geospatial mapping of opioid distribution patterns, overdose clusters, and supply chain anomalies.', 'pending', '#F59E0B', ARRAY['Opioid Crisis', 'Public Health', 'Geospatial'], NULL, 6),
  ('GUARDIAN', 'COMMUNITY DEFENSE NETWORK', 'Open source community safety and mutual aid coordination platform.', 'pending', '#06B6D4', ARRAY['Community', 'Safety', 'Mutual Aid'], NULL, 7);

-- Services
INSERT INTO public.services (name, subtitle, description, pricing_summary, url, sort_order) VALUES
  ('FundForge', 'DECENTRALIZED FUNDRAISING PLATFORM', 'Transparent, open-source fundraising infrastructure. No middlemen, no platform fees on donations. Built for organizations that need accountability baked into their funding.', 'Free platform — zero fees on donations', 'https://fundforge.finance', 1),
  ('DraftProSe', 'AI-POWERED LEGAL DOCUMENT DRAFTING', 'Accessible legal document generation powered by AI. Contracts, filings, and legal prose — without the $500/hr attorney. Open source core, premium features for complex work.', 'Free tier available — Pro plans for complex docs', 'https://draft.prose', 2);

-- Patents (seed)
INSERT INTO public.patents (name, description, category, status, sort_order) VALUES
  ('REHD', 'Renewable Energy Harvesting Device — modular energy capture system for distributed renewable generation.', 'energy', 'concept', 1),
  ('Basal Bastion', 'Layered defense architecture for critical infrastructure protection using adaptive response protocols.', 'defense', 'provisional_filed', 2),
  ('Moirai', 'Predictive analytics framework for supply chain fate-mapping and probabilistic outcome modeling.', 'fintech', 'concept', 3),
  ('Medusa', 'Multi-vector threat neutralization system with parallelized response capability.', 'defense', 'concept', 4),
  ('REVOLT', 'Renewable Energy Voltage Optimization and Load Tuning — smart grid balancing for decentralized power.', 'energy', 'concept', 5),
  ('Earth Pills', 'Compressed soil amendment capsules for rapid land rehabilitation and food security.', 'food', 'concept', 6),
  ('THOR', 'Tactical High-energy Output Relay — directed energy transfer system for defense applications.', 'defense', 'concept', 7);

-- Site Content (Mission page)
INSERT INTO public.site_content (slug, title, body, section, sort_order) VALUES
  ('mission-hero', 'No royalty or charge. Ever.', 'OpenSourcePatents exists for one reason: to release useful inventions into the public domain so no corporation, government, or individual can lock them away. Every patent, every tool, every line of code — free forever under CC0 or Apache 2.0.', 'mission', 1),
  ('mission-why', 'Why Open Source Patents?', 'The patent system was designed to promote innovation. Instead, it became a weapon. Patent trolls, defensive portfolios, and licensing wars have turned intellectual property into a barrier to progress. We believe the best ideas should be free — not because they are worthless, but because they are priceless.', 'mission', 2),
  ('mission-how', 'How It Works', 'We research. We invent. We file. We release. Every concept in our portfolio is published under open licenses that guarantee permanent public access. No royalties. No licensing fees. No strings. If it can help humanity, it should belong to humanity.', 'mission', 3),
  ('mission-license', 'Licensing', 'All civic tools are released under CC0 (public domain). All software is Apache 2.0. Patent concepts are published as defensive publications to prevent others from patenting them. This is irrevocable — once released, it can never be taken back.', 'mission', 4);
