ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS sdg_goals text[] DEFAULT NULL;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS description text DEFAULT NULL;