
-- Visitor counter table (single-row)
CREATE TABLE public.visitor_counts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  count bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.visitor_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visitor count"
  ON public.visitor_counts FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert the single row
INSERT INTO public.visitor_counts (count) VALUES (0);

-- Recommendations table
CREATE TABLE public.recommendations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  url text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  icon text DEFAULT 'link',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view recommendations"
  ON public.recommendations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert recommendations"
  ON public.recommendations FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update recommendations"
  ON public.recommendations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete recommendations"
  ON public.recommendations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Resume storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

CREATE POLICY "Anyone can download resumes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes');

CREATE POLICY "Admins can upload resumes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update resumes"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resumes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));
