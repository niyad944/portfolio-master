import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SDGS = [
  { id: 1, name: "No Poverty" },
  { id: 2, name: "Zero Hunger" },
  { id: 3, name: "Good Health and Well-Being" },
  { id: 4, name: "Quality Education" },
  { id: 5, name: "Gender Equality" },
  { id: 6, name: "Clean Water and Sanitation" },
  { id: 7, name: "Affordable and Clean Energy" },
  { id: 8, name: "Decent Work and Economic Growth" },
  { id: 9, name: "Industry, Innovation and Infrastructure" },
  { id: 10, name: "Reduced Inequalities" },
  { id: 11, name: "Sustainable Cities and Communities" },
  { id: 12, name: "Responsible Consumption and Production" },
  { id: 13, name: "Climate Action" },
  { id: 14, name: "Life Below Water" },
  { id: 15, name: "Life on Land" },
  { id: 16, name: "Peace, Justice and Strong Institutions" },
  { id: 17, name: "Partnerships for the Goals" },
];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);

    const { title, organization, description, certificateType, filePath } = await req.json();
    if (!title && !description && !filePath) {
      return json({ error: "Provide at least a title, description or filePath" }, 400);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "AI service not configured" }, 500);

    // Optionally attach the certificate file so the model can read its visible text.
    let imagePart: Record<string, unknown> | null = null;
    if (filePath && typeof filePath === "string") {
      const ext = filePath.split(".").pop()?.toLowerCase();
      const mimeType =
        ext === "png" ? "image/png" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : null;
      if (mimeType) {
        const { data: fileData } = await supabase.storage.from("certificates").download(filePath);
        if (fileData) {
          const bytes = new Uint8Array(await fileData.arrayBuffer());
          if (bytes.byteLength <= 6 * 1024 * 1024) {
            let binary = "";
            for (let i = 0; i < bytes.length; i += 8192) {
              binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
            }
            imagePart = {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${btoa(binary)}` },
            };
          }
        }
      }
    }

    const systemPrompt = `You classify certificates against the 17 UN Sustainable Development Goals.

Reference list:
${SDGS.map((s) => `${s.id}. ${s.name}`).join("\n")}

Rules:
- Judge from the ACTUAL content and context of the certificate (topic, activity, organisation, visible text), not from superficial keyword matches.
- Return only genuinely relevant goals. Prefer 1-3 goals; never more than 4.
- Give each goal a relevance score between 0 and 1. Omit anything below 0.5.
- If nothing is clearly relevant, return an empty array.
- Respond with ONLY valid JSON, no markdown fences:
{"sdgs":[{"id":4,"name":"Quality Education","reason":"...","confidence":0.9}]}`;

    const userText = [
      `Certificate title: ${title || "(unknown)"}`,
      organization ? `Issuing organisation: ${organization}` : null,
      certificateType ? `Certificate type: ${certificateType}` : null,
      description ? `Description: ${description}` : null,
      imagePart
        ? "An image of the certificate is attached — read any visible text in it before deciding."
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const content: unknown[] = [{ type: "text", text: userText }];
    if (imagePart) content.unshift(imagePart);

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) return json({ error: "AI rate limit reached. Please try again shortly." }, 429);
      if (status === 402) return json({ error: "AI credits exhausted. Please add credits." }, 402);
      console.error("AI gateway error:", status, await aiResponse.text());
      return json({ error: "SDG detection failed" }, 500);
    }

    const result = await aiResponse.json();
    const rawText: string = result.choices?.[0]?.message?.content ?? "";

    let parsed: any = null;
    try {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    } catch (e) {
      console.error("SDG JSON parse error:", e, rawText);
    }

    // Validate every returned goal against the canonical list before returning it.
    const seen = new Set<number>();
    const sdgs = (Array.isArray(parsed?.sdgs) ? parsed.sdgs : [])
      .map((s: any) => {
        const id = Number(s?.id);
        const known = SDGS.find((g) => g.id === id);
        if (!known || seen.has(id)) return null;
        const confidence = typeof s?.confidence === "number" ? s.confidence : 0.8;
        if (confidence < 0.5) return null;
        seen.add(id);
        return {
          id: known.id,
          name: known.name,
          label: `SDG ${known.id}: ${known.name}`,
          reason: typeof s?.reason === "string" ? s.reason : "",
          confidence,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.confidence - a.confidence)
      .slice(0, 4);

    return json({ sdgs });
  } catch (e) {
    console.error("detect-sdgs error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
