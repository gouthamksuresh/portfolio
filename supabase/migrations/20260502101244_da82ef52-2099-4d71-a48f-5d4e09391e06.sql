REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;