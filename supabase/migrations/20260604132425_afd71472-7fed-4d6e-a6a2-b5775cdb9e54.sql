-- Lock down SECURITY DEFINER functions from being callable via the Data API.
-- They remain callable internally by RLS policies and by edge functions using the service role.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_visitor_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_portfolio_content() FROM PUBLIC, anon, authenticated;

-- Ensure service_role (used by edge functions) can still call these.
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_visitor_count() TO service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;