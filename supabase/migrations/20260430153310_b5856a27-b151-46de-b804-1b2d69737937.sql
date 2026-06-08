-- Fix mutable search_path
CREATE OR REPLACE FUNCTION public.touch_portfolio_content()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  NEW.updated_by := auth.uid();
  RETURN NEW;
END;
$$;

-- Lock down SECURITY DEFINER funcs: only authenticated users may call claim_first_admin; nobody can call has_role/touch directly via the API.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;
REVOKE ALL ON FUNCTION public.touch_portfolio_content() FROM PUBLIC, anon, authenticated;