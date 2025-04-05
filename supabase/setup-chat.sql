
-- Make sure the attachments column exists in the group_messages table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'group_messages'
    AND column_name = 'attachments'
  ) THEN
    ALTER TABLE public.group_messages ADD COLUMN attachments JSONB;
  END IF;
END
$$;

-- Create storage bucket for chat attachments if it doesn't exist
BEGIN;
  -- Create the chat-attachments bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  SELECT 'chat-attachments', 'chat-attachments', true
  WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'chat-attachments'
  );
  
  -- Set up RLS policies for the storage bucket
  CREATE POLICY "Allow public read of chat attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-attachments');
  
  -- Public users can upload attachments when authenticated
  CREATE POLICY "Allow authenticated users to upload attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'chat-attachments' AND
    auth.role() = 'authenticated'
  );
  
  -- Message owners can update their attachments
  CREATE POLICY "Allow message owners to update attachments"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'chat-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
  
  -- Message owners can delete their attachments
  CREATE POLICY "Allow message owners to delete attachments"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'chat-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
COMMIT;
