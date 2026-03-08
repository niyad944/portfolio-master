import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, projects, skills, resumeData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "project-to-resume") {
      systemPrompt = `You are an expert resume writer. Convert portfolio projects into professional resume bullet points. Return JSON with a "entries" array where each entry has: "projectTitle" (string), "bullets" (array of 2-3 professional resume bullet point strings). Focus on impact, technologies used, and achievements. Use action verbs.`;
      userPrompt = `Convert these projects into resume entries:\n${JSON.stringify(projects)}`;
    } else if (type === "career-suggestions") {
      systemPrompt = `You are a career advisor. Based on the user's skills and project experience, suggest 4-6 fitting career roles. Return JSON with a "roles" array where each role has: "title" (string), "reason" (string - one sentence why user fits), "matchingSkills" (array of skill name strings from user's data that support this role), "matchScore" (number 0-100).`;
      userPrompt = `User skills: ${JSON.stringify(skills)}\nUser projects: ${JSON.stringify(projects)}\nResume/bio: ${resumeData || "Not provided"}`;
    } else {
      throw new Error("Invalid type. Use 'project-to-resume' or 'career-suggestions'.");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: type === "project-to-resume" ? "return_resume_entries" : "return_career_roles",
              description: type === "project-to-resume" 
                ? "Return structured resume entries from projects"
                : "Return career role suggestions",
              parameters: type === "project-to-resume" ? {
                type: "object",
                properties: {
                  entries: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        projectTitle: { type: "string" },
                        bullets: { type: "array", items: { type: "string" } }
                      },
                      required: ["projectTitle", "bullets"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["entries"],
                additionalProperties: false
              } : {
                type: "object",
                properties: {
                  roles: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        reason: { type: "string" },
                        matchingSkills: { type: "array", items: { type: "string" } },
                        matchScore: { type: "number" }
                      },
                      required: ["title", "reason", "matchingSkills", "matchScore"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["roles"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: {
          type: "function",
          function: { name: type === "project-to-resume" ? "return_resume_entries" : "return_career_roles" }
        }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try to parse content directly
    const content = data.choices?.[0]?.message?.content || "{}";
    return new Response(JSON.stringify(JSON.parse(content)), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("portfolio-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
