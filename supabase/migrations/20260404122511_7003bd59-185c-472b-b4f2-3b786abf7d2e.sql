CREATE POLICY "Public profile certificates are viewable"
ON public.certificates
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = certificates.user_id
    AND profiles.is_public = true
  )
);