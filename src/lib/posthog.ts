import posthog from "posthog-js";
import { supabase } from "@/integrations/supabase/client";

let initialized = false;

export async function initPostHog() {
  if (initialized) return;

  try {
    const { data, error } = await supabase.functions.invoke("posthog-config");
    if (error || !data?.apiKey) return;

    posthog.init(data.apiKey, {
      api_host: data.host || "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
    });
    initialized = true;
  } catch {
    // PostHog is optional — fail silently
  }
}

export { posthog };
