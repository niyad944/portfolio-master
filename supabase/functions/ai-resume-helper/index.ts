import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ResumeData {
  profile: {
    full_name: string;
    bio: string;
    location: string;
  };
  skills: Array<{ name: string; proficiency_level: string }>;
  education: Array<{ degree: string; institution: string; field_of_study: string }>;
  projects: Array<{ title: string; description: string; technologies: string[] }>;
  achievements: Array<{ title: string; description: string }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const token = authHeader.slice("Bearer ".length);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("JWT validation failed", {
        message: userError?.message,
        status: (userError as any)?.status,
        name: userError?.name,
      });

      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const { type, data, currentText } = await req.json() as {
      type: "summary" | "project" | "achievement" | "skill";
      data: ResumeData;
      currentText?: string;
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = `You are a friendly, supportive career mentor helping a student improve their resume. 
Your tone is encouraging, warm, and constructive - like a helpful older friend who works in HR.
Keep suggestions professional but approachable. Use simple language.
Always provide actionable, specific improvements.
Format your response as JSON with the structure specified in the user prompt.`;

    let userPrompt = "";

    switch (type) {
      case "summary":
        userPrompt = `Help improve this professional summary for a resume.

Current bio: "${data.profile.bio || "No bio provided yet"}"

About the person:
- Name: ${data.profile.full_name}
- Location: ${data.profile.location || "Not specified"}
- Skills: ${data.skills.map(s => s.name).join(", ") || "None listed"}
- Education: ${data.education.map(e => `${e.degree} at ${e.institution}`).join(", ") || "None listed"}
- Projects: ${data.projects.length} projects

Generate 3 different professional summary suggestions (2-3 sentences each). 
Make them ATS-friendly and highlight their strengths.

Respond with JSON: { "suggestions": [{ "text": "...", "highlight": "brief explanation of what makes this good" }] }`;
        break;

      case "project":
        userPrompt = `Help improve this project description for a resume.

Current description: "${currentText || "No description"}"

Project context from their portfolio:
${data.projects.map(p => `- ${p.title}: ${p.description || "No description"} (Tech: ${p.technologies?.join(", ") || "Not specified"})`).join("\n")}

Generate 3 improved versions of bullet points for project descriptions.
Focus on impact, metrics, and action verbs.

Respond with JSON: { "suggestions": [{ "text": "...", "highlight": "what this emphasizes" }] }`;
        break;

      case "achievement":
        userPrompt = `Help craft achievement bullet points for a resume.

Current achievements:
${data.achievements.map(a => `- ${a.title}: ${a.description || "No description"}`).join("\n") || "None listed yet"}

Their background:
- Skills: ${data.skills.map(s => s.name).join(", ")}
- Projects: ${data.projects.map(p => p.title).join(", ")}

Suggest 3 achievement-style bullet points they could add based on their projects and skills.
Use strong action verbs and quantify when possible.

Respond with JSON: { "suggestions": [{ "text": "...", "highlight": "why this works" }] }`;
        break;

      case "skill":
        userPrompt = `Suggest additional skills this person might want to add to their resume.

Current skills: ${data.skills.map(s => `${s.name} (${s.proficiency_level})`).join(", ") || "None listed"}
Their projects use: ${data.projects.flatMap(p => p.technologies || []).join(", ") || "Not specified"}
Education: ${data.education.map(e => e.field_of_study).join(", ") || "Not specified"}

Suggest 5 relevant skills they might have but haven't listed, based on their profile.

Respond with JSON: { "suggestions": [{ "text": "skill name", "highlight": "why this would be valuable" }] }`;
        break;
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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service temporarily unavailable");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response
    let suggestions;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // Fallback if AI doesn't return proper JSON
      suggestions = {
        suggestions: [
          { text: content, highlight: "AI-generated suggestion" }
        ]
      };
    }

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI resume helper error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
