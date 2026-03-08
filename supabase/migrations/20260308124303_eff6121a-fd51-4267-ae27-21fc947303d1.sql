-- Create resume_analyses table
CREATE TABLE public.resume_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  job_role text NOT NULL,
  resume_file_name text,
  resume_file_path text,
  ats_score integer,
  job_match_score integer,
  detected_skills jsonb DEFAULT '[]'::jsonb,
  missing_skills jsonb DEFAULT '[]'::jsonb,
  missing_keywords jsonb DEFAULT '[]'::jsonb,
  strengths jsonb DEFAULT '[]'::jsonb,
  weaknesses jsonb DEFAULT '[]'::jsonb,
  suggestions jsonb DEFAULT '[]'::jsonb,
  experience_gaps jsonb DEFAULT '[]'::jsonb,
  raw_response text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analyses" ON public.resume_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analyses" ON public.resume_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own analyses" ON public.resume_analyses FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for resume uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('resume-uploads', 'resume-uploads', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resume-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can view own resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resume-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own resumes" ON storage.objects FOR DELETE USING (bucket_id = 'resume-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
