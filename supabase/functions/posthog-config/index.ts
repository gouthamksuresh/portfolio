const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("POSTHOG_API_KEY");
  const host = Deno.env.get("POSTHOG_HOST") || "https://us.i.posthog.com";

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "PostHog not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ apiKey, host }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
