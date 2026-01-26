-- Fix: Update activity_logs insert policy to require user context
DROP POLICY "System can insert activity logs" ON public.activity_logs;

-- Allow authenticated users to insert their own activity logs
CREATE POLICY "Users can insert their own activity logs" ON public.activity_logs 
FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);