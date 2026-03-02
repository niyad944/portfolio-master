
-- Create resume-photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('resume-photos', 'resume-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Add profile_photo_url to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_photo_url text;

-- Storage policies for resume-photos
CREATE POLICY "Users can upload their own resume photo"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resume-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own resume photo"
ON storage.objects FOR UPDATE
USING (bucket_id = 'resume-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own resume photo"
ON storage.objects FOR DELETE
USING (bucket_id = 'resume-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Resume photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'resume-photos');
