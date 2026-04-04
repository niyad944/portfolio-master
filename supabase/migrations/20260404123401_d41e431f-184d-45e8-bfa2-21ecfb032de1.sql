
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sdg_goals text[] DEFAULT NULL;

-- Create project-images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true) ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload project images
CREATE POLICY "Users can upload project images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access to project images
CREATE POLICY "Project images are publicly readable" ON storage.objects FOR SELECT TO public USING (bucket_id = 'project-images');

-- Allow users to delete their own project images
CREATE POLICY "Users can delete own project images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images' AND (storage.foldername(name))[1] = auth.uid()::text);
