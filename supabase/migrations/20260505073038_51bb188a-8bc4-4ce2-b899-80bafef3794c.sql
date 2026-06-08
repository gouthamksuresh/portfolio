
-- Drop the overly broad policy
DROP POLICY "Anyone can download resumes" ON storage.objects;

-- Replace with a more specific one that still allows downloads but scopes to the bucket
CREATE POLICY "Anyone can download resumes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND name = 'resume.pdf');
