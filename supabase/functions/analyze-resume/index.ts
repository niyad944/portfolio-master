import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const token = authHeader.slice(7);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { resumeText, jobRole } = await req.json();
    if (!resumeText || !jobRole) {
      return new Response(JSON.stringify({ error: "resumeText and jobRole are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert ATS resume reviewer and hiring manager.

Analyze the following resume for the job role: ${jobRole}

Evaluate how well the resume matches the job role.

Provide:
1. ATS Compatibility Score (0-100) — based on formatting, keyword density, section structure, action verbs, quantified achievements, and how well the resume passes through Applicant Tracking Systems.
2. Job Match Score (percentage 0-100) — how closely the resume aligns with the specific job role requirements, responsibilities, and qualifications.
3. Skills Found in the Resume — list all relevant technical and soft skills detected.
4. Missing Skills required for the job role — skills typically expected for this role that are absent from the resume.
5. Missing Keywords that ATS systems expect — industry-standard keywords and phrases that recruiters and ATS filters look for.
6. Strengths of the Resume — what the candidate does well, strong sections, notable achievements.
7. Weaknesses — areas that need improvement, poor formatting, vague descriptions, gaps.
8. Suggestions to Improve the Resume — specific, actionable recommendations to increase both ATS score and job match.
9. Experience Gaps — any gaps in work history, missing experience areas, or mismatches between experience level and role requirements.

Return ONLY valid JSON in this exact format:
{
  "ats_score": <number 0-100>,
  "job_match_score": <number 0-100>,
  "detected_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "experience_gaps": ["gap1", "gap2"]
}

Be specific and actionable in all arrays. Provide at least 3 items per array where possible.
Do not include any text outside the JSON object.`;

    const userPrompt = `Resume Content:
${resumeText.substring(0, 15000)}

Analyze this resume for the target job role and return the structured JSON analysis.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await aiResponse.json();
    const rawText = aiResult.choices?.[0]?.message?.content || "";

    let analysis = null;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      }
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
    }

    if (!analysis) {
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw_text: rawText }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ analysis, raw_text: rawText }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
