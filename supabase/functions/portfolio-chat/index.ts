import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Goutham's AI assistant embedded in his portfolio website. You answer questions about Goutham K Suresh — a Cloud & DevOps Engineer based in Bengaluru, India.

Key facts:
- Self-taught DevOps & Cloud engineer, BCA graduate (AI specialization) from Bengaluru North University
- Internships: DevOps at Elevate Labs (Sep-Dec 2025), Data Science at Prinston Smart Engineers (Jan-Apr 2025)
- Skills: Docker, Kubernetes, Jenkins, GitHub Actions, AWS, GCP, Python, JavaScript, SQL, Flask, Linux
- Projects: CI/CD Pipeline (GitHub Actions + Docker), Internship Management System (Python/Flask)
- Certifications: SQL (HackerRank), AWS APAC Solutions Architecture (Forage), Ethical Hacking, AI with Python, Google Cloud Fundamentals
- Languages: English (professional), Malayalam (native), Hindi (limited working)
- Open to work: DevOps, Cloud, SRE, Platform Engineering roles — remote/on-site/hybrid, willing to relocate
- Contact: me.goutham.tech@gmail.com | GitHub: gouthamksuresh | LinkedIn: gouthamksuresh

Be concise, friendly, and professional. Use a slightly technical tone matching the terminal/hacker aesthetic of the site. If asked something unrelated to Goutham, politely redirect. Keep answers under 200 words unless detail is requested.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY is not configured");

    // Default to OpenAI; override with AI_BASE_URL for other providers
    const baseUrl = Deno.env.get("AI_BASE_URL") || "https://api.openai.com/v1";
    const model = Deno.env.get("AI_MODEL") || "gpt-4o-mini";

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("portfolio-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

