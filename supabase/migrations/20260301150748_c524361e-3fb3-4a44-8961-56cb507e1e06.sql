
-- Add new structured columns to achievements table
ALTER TABLE public.achievements 
ADD COLUMN IF NOT EXISTS event_name text,
ADD COLUMN IF NOT EXISTS venue text,
ADD COLUMN IF NOT EXISTS achievement_level text,
ADD COLUMN IF NOT EXISTS achievement_type text,
ADD COLUMN IF NOT EXISTS position text,
ADD COLUMN IF NOT EXISTS certificate_url text;

-- Migrate existing data from old columns
UPDATE public.achievements SET event_name = title WHERE event_name IS NULL AND title IS NOT NULL;
UPDATE public.achievements SET venue = issuer WHERE venue IS NULL AND issuer IS NOT NULL;

-- Add public read policy for certificates so "View Certificate" works
CREATE POLICY "Public can view certificate files"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

-- Ensure authenticated users can upload to certificates bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload certificates' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Authenticated users can upload certificates"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'certificates' AND auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Ensure users can delete their own certificate files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own certificate files' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Users can delete own certificate files"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;
