
CREATE OR REPLACE FUNCTION public.increment_visitor_count()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count bigint;
BEGIN
  UPDATE public.visitor_counts
  SET count = count + 1, updated_at = now()
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;
