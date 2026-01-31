-- Add public portfolio settings to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS public_slug text UNIQUE,
ADD COLUMN IF NOT EXISTS visible_sections jsonb DEFAULT '{"about": true, "skills": true, "education": true, "achievements": true, "projects": true, "certificates": false}'::jsonb;

-- Create index for public slug lookups
CREATE INDEX IF NOT EXISTS idx_profiles_public_slug ON public.profiles(public_slug) WHERE public_slug IS NOT NULL;

-- Create a policy to allow public read access to public profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (is_public = true);

-- Create policy for public access to skills of public profiles
CREATE POLICY "Public profile skills are viewable"
ON public.skills
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = skills.user_id
    AND profiles.is_public = true
  )
);

-- Create policy for public access to education of public profiles
CREATE POLICY "Public profile education is viewable"
ON public.education
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = education.user_id
    AND profiles.is_public = true
  )
);

-- Create policy for public access to achievements of public profiles
CREATE POLICY "Public profile achievements are viewable"
ON public.achievements
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = achievements.user_id
    AND profiles.is_public = true
  )
);

-- Create policy for public access to projects of public profiles
CREATE POLICY "Public profile projects are viewable"
ON public.projects
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = projects.user_id
    AND profiles.is_public = true
  )
);

-- Add device tracking columns to activity_logs
ALTER TABLE public.activity_logs
ADD COLUMN IF NOT EXISTS device_fingerprint text,
ADD COLUMN IF NOT EXISTS device_type text,
ADD COLUMN IF NOT EXISTS browser text,
ADD COLUMN IF NOT EXISTS os text,
ADD COLUMN IF NOT EXISTS location_info jsonb;