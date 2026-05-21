import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Download,
  History,
  Loader2,
  Brain,
  BarChart3,
  Search,
  Sparkles,
  Trash2,
  RefreshCw,
  Info,
  Clock,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface DashboardContext {
  user: User;
}

interface AnalysisResult {
  ats_score: number;
  job_match_score: number;
  detected_skills: string[];
  missing_skills: string[];
  missing_keywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  experience_gaps: string[];
}

interface AnalysisRecord {
  id: string;
  job_role: string;
  resume_file_name: string | null;
  ats_score: number | null;
  job_match_score: number | null;
  detected_skills: string[];
  missing_skills: string[];
  missing_keywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  experience_gaps: string[];
  created_at: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-emerald-500/20 border-emerald-500/30";
  if (score >= 60) return "bg-amber-500/20 border-amber-500/30";
  return "bg-red-500/20 border-red-500/30";
};

// Detect parser-error-style noise so it never reaches the user as feedback.
const PARSER_NOISE_PATTERNS = [
  /corrupt/i,
  /binary/i,
  /raw\s*stream/i,
  /unreadable/i,
  /unable to (parse|determine|extract|read)/i,
  /could not (parse|extract|read|determine)/i,
  /failed to (parse|extract|read)/i,
  /parsing (error|failed|issue)/i,
  /not a valid (pdf|document)/i,
  /encoded/i,
  /gibberish/i,
  /image[- ]?based/i,
  /scanned (pdf|document|resume)/i,
  /ocr/i,
  /no (readable|extractable) text/i,
  /text extraction/i,
  /\bpdf header\b/i,
  /^%pdf/i,
];

const looksLikeParserNoise = (s: string) =>
  !s || PARSER_NOISE_PATTERNS.some((re) => re.test(s));

const cleanItems = (items: string[] = []) =>
  items.map((s) => (s || "").trim()).filter((s) => s && !looksLikeParserNoise(s));

// Normalize extracted text: strip control chars, collapse whitespace, fix line breaks.
const normalizeExtractedText = (text: string): string => {
  if (!text) return "";
  let s = text;
  // Remove zero-width / invisible / control characters (keep \n and \t)
  s = s.replace(/[\u0000-\u0008\u000B-\u001F\u007F\u200B-\u200F\u2060-\u206F\uFEFF]/g, "");
  // Normalize line breaks
  s = s.replace(/\r\n?/g, "\n");
  // Collapse runs of spaces/tabs
  s = s.replace(/[ \t]+/g, " ");
  // Collapse 3+ newlines to 2
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
};

// Only flag when text is truly missing/empty/unreadable.
// Accepts short resumes, odd whitespace, line breaks, encoding noise.
const isTextUnreliable = (text: string): boolean => {
  if (text === null || text === undefined) return true;
  const trimmed = String(text).trim();
  if (trimmed.length === 0) return true;
  // Must contain at least one readable alphabetic word
  if (!/[A-Za-z]{3,}/.test(trimmed)) return true;
  // Raw PDF binary leaked through (extraction completely failed)
  if (/^%PDF-/.test(trimmed)) {
    const alpha = (trimmed.match(/[A-Za-z]/g) || []).length;
    if (alpha / trimmed.length < 0.2) return true;
  }
  return false;
};

// Decide if AI response itself indicates limited/failed analysis
const isAnalysisLimited = (a: AnalysisResult | null): boolean => {
  if (!a) return true;
  const skills = cleanItems(a.detected_skills);
  const strengths = cleanItems(a.strengths);
  const ats = Number(a.ats_score) || 0;
  const match = Number(a.job_match_score) || 0;
  if (skills.length === 0 && strengths.length === 0 && ats < 20 && match < 20) return true;
  return false;
};


const ResumeAnalyzer = () => {
  const { user } = useOutletContext<DashboardContext>();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [limitedAnalysis, setLimitedAnalysis] = useState(false);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState("analyze");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from("resume_analyses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) {
      setHistory(
        data.map((d: any) => ({
          ...d,
          detected_skills: (d.detected_skills as string[]) || [],
          missing_skills: (d.missing_skills as string[]) || [],
          missing_keywords: (d.missing_keywords as string[]) || [],
          strengths: (d.strengths as string[]) || [],
          weaknesses: (d.weaknesses as string[]) || [],
          suggestions: (d.suggestions as string[]) || [],
          experience_gaps: (d.experience_gaps as string[]) || [],
        }))
      );
    }
    setLoadingHistory(false);
  };

  const extractTextFromFile = async (f: File): Promise<string> => {
    const name = f.name.toLowerCase();
    const type = f.type;

    // Plain text
    if (type === "text/plain" || name.endsWith(".txt")) {
      return await f.text();
    }

    // DOCX via mammoth
    if (
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      name.endsWith(".docx")
    ) {
      try {
        const mammoth = await import("mammoth");
        const arrayBuffer = await f.arrayBuffer();
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        return value || "";
      } catch (err) {
        console.error("DOCX extraction failed:", err);
        return "";
      }
    }

    // PDF via pdfjs-dist (native text extraction)
    if (type === "application/pdf" || name.endsWith(".pdf")) {
      try {
        const pdfjs: any = await import("pdfjs-dist");
        // Worker setup (Vite-friendly with fallbacks)
        let workerConfigured = false;
        try {
          const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
          pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
          workerConfigured = true;
        } catch (w1) {
          console.warn("[PDF] primary worker import failed, trying legacy:", w1);
          try {
            const workerSrc = (await import("pdfjs-dist/build/pdf.worker.mjs?url")).default;
            pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
            workerConfigured = true;
          } catch (w2) {
            console.warn("[PDF] legacy worker import failed, using fake worker:", w2);
          }
        }
        const arrayBuffer = await f.arrayBuffer();
        const loadingTask = pdfjs.getDocument({
          data: arrayBuffer,
          isEvalSupported: false,
          useWorkerFetch: false,
          disableAutoFetch: true,
          disableStream: true,
          ...(workerConfigured ? {} : { disableWorker: true }),
        });
        const pdf = await loadingTask.promise;
        console.log(`[PDF] loaded ${pdf.numPages} pages`);

        const Y_TOL = 3;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          // Group items by Y coordinate to preserve line structure
          const lineMap = new Map<number, Array<{ str: string; x: number }>>();
          for (const item of content.items as any[]) {
            const str = typeof item.str === "string" ? item.str : "";
            if (!str) continue;
            const tr = item.transform || [];
            const y = Math.round((tr[5] || 0) / Y_TOL) * Y_TOL;
            const x = tr[4] || 0;
            if (!lineMap.has(y)) lineMap.set(y, []);
            lineMap.get(y)!.push({ str, x });
          }
          const pageText = Array.from(lineMap.entries())
            .sort((a, b) => b[0] - a[0]) // top to bottom
            .map(([, items]) => {
              items.sort((a, b) => a.x - b.x);
              return items.map((it) => it.str).join(" ");
            })
            .join("\n");
          fullText += pageText + "\n\n";
        }
        console.log(`[PDF] extracted ${fullText.length} chars`);
        return fullText;
      } catch (err) {
        console.error("[PDF] extraction failed:", err);
        return "";
      }
    }

    // Fallback
    try {
      return await f.text();
    } catch {
      return "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!validTypes.includes(selected.type) && !selected.name.endsWith(".txt")) {
      toast({ title: "Invalid file", description: "Please upload a PDF, DOCX, or TXT file.", variant: "destructive" });
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 10MB.", variant: "destructive" });
      return;
    }
    setFile(selected);
  };

  const handleAnalyze = async () => {
    if (!file || !jobRole.trim()) {
      toast({ title: "Missing info", description: "Please upload a resume and enter a job role.", variant: "destructive" });
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setLimitedAnalysis(false);

    try {
      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resume-uploads")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw new Error("Failed to upload resume: " + uploadError.message);

      // Extract text & assess quality
      const rawText = await extractTextFromFile(file);
      const resumeText = normalizeExtractedText(rawText);
      const unreliable = isTextUnreliable(resumeText);
      console.log("[ATS] extraction summary", {
        rawLen: rawText?.length || 0,
        normalizedLen: resumeText?.length || 0,
        words: (resumeText.match(/[A-Za-z]{3,}/g) || []).length,
        unreliable,
        preview: resumeText.slice(0, 200),
      });
      if (unreliable) {
        console.warn("[ATS] limited_analysis triggered. Reason:",
          !rawText ? "empty raw extraction"
            : !resumeText ? "empty after normalization"
            : !/[A-Za-z]{3,}/.test(resumeText) ? "no readable alphabetic words"
            : "raw PDF bytes leaked through");
      }

      if (unreliable) {
        // Enter limited-analysis mode: skip AI, show neutral states
        setResult({
          ats_score: 0,
          job_match_score: 0,
          detected_skills: [],
          missing_skills: [],
          missing_keywords: [],
          strengths: [],
          weaknesses: [],
          suggestions: [],
          experience_gaps: [],
        });
        setLimitedAnalysis(true);
        toast({
          title: "Limited analysis",
          description: "We couldn't read enough text from this resume. Try a text-based PDF for full insights.",
        });
        setAnalyzing(false);
        return;
      }

      // Call edge function
      const { data: fnData, error: fnError } = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText, jobRole: jobRole.trim() },
      });

      if (fnError) throw new Error(fnError.message || "Analysis failed");
      if (fnData?.error) throw new Error(fnData.error);

      const analysis: AnalysisResult = fnData.analysis;
      const limited = isAnalysisLimited(analysis);
      setResult(analysis);
      setLimitedAnalysis(limited);

      // Save to database
      await supabase.from("resume_analyses").insert({
        user_id: user.id,
        job_role: jobRole.trim(),
        resume_file_name: file.name,
        resume_file_path: filePath,
        ats_score: analysis.ats_score,
        job_match_score: analysis.job_match_score,
        detected_skills: analysis.detected_skills as any,
        missing_skills: analysis.missing_skills as any,
        missing_keywords: analysis.missing_keywords as any,
        strengths: analysis.strengths as any,
        weaknesses: analysis.weaknesses as any,
        suggestions: analysis.suggestions as any,
        experience_gaps: analysis.experience_gaps as any,
        raw_response: fnData.raw_text,
      });

      await fetchHistory();
      toast({ title: "Analysis complete!", description: "Your resume has been analyzed successfully." });
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({ title: "Analysis failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    const { error } = await supabase.from("resume_analyses").delete().eq("id", id);
    if (!error) {
      setHistory((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Deleted", description: "Analysis record removed." });
    }
  };

  const handleViewRecord = (record: AnalysisRecord) => {
    const r: AnalysisResult = {
      ats_score: record.ats_score || 0,
      job_match_score: record.job_match_score || 0,
      detected_skills: record.detected_skills,
      missing_skills: record.missing_skills,
      missing_keywords: record.missing_keywords,
      strengths: record.strengths,
      weaknesses: record.weaknesses,
      suggestions: record.suggestions,
      experience_gaps: record.experience_gaps,
    };
    setResult(r);
    setLimitedAnalysis(isAnalysisLimited(r));
    setJobRole(record.job_role);
    setActiveTab("analyze");
  };

  const downloadReport = () => {
    if (!result) return;
    const report = `
RESUME ANALYSIS REPORT
======================
Job Role: ${jobRole}
Date: ${new Date().toLocaleDateString()}

ATS COMPATIBILITY SCORE: ${result.ats_score}/100
JOB MATCH SCORE: ${result.job_match_score}/100

SKILLS DETECTED:
${result.detected_skills.map((s) => `  • ${s}`).join("\n")}

MISSING SKILLS:
${result.missing_skills.map((s) => `  • ${s}`).join("\n")}

MISSING KEYWORDS:
${result.missing_keywords.map((k) => `  • ${k}`).join("\n")}

EXPERIENCE GAPS:
${result.experience_gaps.map((g) => `  • ${g}`).join("\n")}

STRENGTHS:
${result.strengths.map((s) => `  • ${s}`).join("\n")}

WEAKNESSES:
${result.weaknesses.map((w) => `  • ${w}`).join("\n")}

SUGGESTIONS FOR IMPROVEMENT:
${result.suggestions.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}
`;
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-analysis-${jobRole.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center">
            <Brain className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">AI Resume Analyzer</h1>
            <p className="text-muted-foreground text-sm">Upload your resume and get AI-powered insights for any job role</p>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass border border-white/10">
          <TabsTrigger value="analyze" className="gap-2"><Search className="w-4 h-4" /> Analyze</TabsTrigger>
          <TabsTrigger value="history" className="gap-2"><History className="w-4 h-4" /> History</TabsTrigger>
        </TabsList>

        {/* ANALYZE TAB */}
        <TabsContent value="analyze" className="space-y-6 mt-4">
          {/* Upload & Input */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2"><Upload className="w-5 h-5 text-accent" /> Upload & Configure</CardTitle>
              <CardDescription>Upload your resume and specify the target job role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Resume File</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-accent/40 transition-colors bg-white/[0.02]">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      {file ? (
                        <>
                          <FileText className="w-8 h-8 text-accent" />
                          <span className="text-sm text-foreground font-medium truncate max-w-[200px]">{file.name}</span>
                          <span className="text-xs">{(file.size / 1024).toFixed(1)} KB</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8" />
                          <span className="text-sm">PDF, DOCX, or TXT</span>
                          <span className="text-xs">Max 10MB</span>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Target Job Role</label>
                  <Input
                    placeholder="e.g. Frontend Developer, Data Scientist..."
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="bg-white/[0.04] border-white/10"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Enter the role or paste a job description for best results</p>
                </div>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!file || !jobRole.trim() || analyzing}
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {limitedAnalysis && (
                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 mt-0.5 shrink-0 text-amber-400" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Limited analysis mode</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        We couldn't extract enough readable text from this resume to score it accurately. Upload a text-based PDF (not a scan or image) and try again for a full ATS report.
                      </p>
                    </div>
                  </div>
                )}

                {/* Score Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ScoreCard
                    title="ATS Compatibility"
                    score={result.ats_score}
                    icon={<BarChart3 className="w-5 h-5" />}
                    unavailable={limitedAnalysis}
                    unavailableLabel="Analysis unavailable"
                    unavailableSub="Not enough readable resume content detected."
                  />
                  <ScoreCard
                    title="Job Match"
                    score={result.job_match_score}
                    icon={<Target className="w-5 h-5" />}
                    unavailable={limitedAnalysis}
                    unavailableLabel="Unable to determine"
                    unavailableSub="Resume text extraction is limited."
                  />
                </div>

                {/* Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ListCard
                    title="Skills Detected"
                    items={limitedAnalysis ? [] : cleanItems(result.detected_skills)}
                    icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}
                    badgeClass="bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
                    emptyMessage={
                      limitedAnalysis
                        ? "Upload a clearer text-based resume to identify your skills."
                        : "No technical skills detected yet. Try a text-based resume for richer insights."
                    }
                  />
                  <ListCard
                    title="Missing Skills"
                    items={limitedAnalysis ? [] : cleanItems(result.missing_skills)}
                    icon={limitedAnalysis ? <Info className="w-5 h-5 text-amber-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                    badgeClass="bg-red-500/15 text-red-300 border-red-500/25"
                    emptyMessage={
                      limitedAnalysis
                        ? "Cannot determine missing skills until readable resume text is extracted."
                        : "No critical skill gaps spotted for this role."
                    }
                  />
                </div>

                {/* Keywords & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ListCard
                    title="Missing Keywords"
                    items={limitedAnalysis ? [] : cleanItems(result.missing_keywords)}
                    icon={<Search className="w-5 h-5 text-amber-400" />}
                    badgeClass="bg-amber-500/15 text-amber-300 border-amber-500/25"
                    emptyMessage={
                      limitedAnalysis
                        ? "Keyword analysis will appear once readable resume text is detected."
                        : "Your resume already covers the key ATS keywords for this role."
                    }
                  />
                  <ExperienceCard items={limitedAnalysis ? [] : cleanItems(result.experience_gaps)} />
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ListCard
                    title="Strengths"
                    items={limitedAnalysis ? [] : cleanItems(result.strengths)}
                    icon={limitedAnalysis ? <Info className="w-5 h-5 text-amber-400" /> : <TrendingUp className="w-5 h-5 text-emerald-400" />}
                    variant="list"
                    emptyMessage={
                      limitedAnalysis
                        ? "Upload a clearer text-based resume to identify strengths."
                        : "Upload a clearer, text-based resume to highlight your strengths."
                    }
                  />
                  <WeaknessCard items={limitedAnalysis ? [] : cleanItems(result.weaknesses)} limited={limitedAnalysis} />
                </div>

                {/* Suggestions */}
                {!limitedAnalysis && (
                  <Card className="glass-card border-white/10">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-400" /> Improvement Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {cleanItems(result.suggestions).length === 0 ? (
                        <p className="text-sm text-muted-foreground">No suggestions available yet. Try re-uploading a text-based PDF for tailored recommendations.</p>
                      ) : (
                        <ol className="space-y-3">
                          {cleanItems(result.suggestions).map((s, i) => (
                            <li key={i} className="flex gap-3">
                              <span className="w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                              <span className="text-sm text-foreground/80 leading-relaxed">{s}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </CardContent>
                  </Card>
                )}


                {/* Download */}
                <div className="flex justify-end">
                  <Button variant="outline" onClick={downloadReport} className="gap-2 border-white/10">
                    <Download className="w-4 h-4" /> Download Report
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Analysis History</CardTitle>
                <CardDescription>View and compare your past analyses</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={fetchHistory}><RefreshCw className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
              ) : history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No analyses yet. Upload a resume to get started!</p>
              ) : (
                <div className="space-y-3">
                  {history.map((record) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent/20 transition-colors"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{record.job_role}</p>
                          <p className="text-xs text-muted-foreground truncate">{new Date(record.created_at).toLocaleDateString()} · {record.resume_file_name}</p>
                          <div className="flex items-center gap-3 sm:hidden mt-1">
                            <span className={`text-xs font-bold ${getScoreColor(record.ats_score || 0)}`}>ATS: {record.ats_score}%</span>
                            <span className={`text-xs ${getScoreColor(record.job_match_score || 0)}`}>Match: {record.job_match_score}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className={`text-sm font-bold ${getScoreColor(record.ats_score || 0)}`}>ATS: {record.ats_score}%</p>
                          <p className={`text-xs ${getScoreColor(record.job_match_score || 0)}`}>Match: {record.job_match_score}%</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleViewRecord(record)} className="h-8 px-2 sm:px-3 text-xs sm:text-sm">View</Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => handleDeleteRecord(record.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Sub-components
const ScoreCard = ({
  title,
  score,
  icon,
  unavailable = false,
  unavailableLabel = "Analysis unavailable",
  unavailableSub = "Not enough readable resume content detected.",
}: {
  title: string;
  score: number;
  icon: React.ReactNode;
  unavailable?: boolean;
  unavailableLabel?: string;
  unavailableSub?: string;
}) => (
  <Card className={`border ${unavailable ? "bg-amber-500/[0.06] border-amber-500/25" : getScoreBg(score)}`}>
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 text-foreground">
          {unavailable ? <Info className="w-5 h-5 text-amber-400" /> : icon}
          <span className="text-xs sm:text-sm font-medium">{title}</span>
        </div>
        {unavailable ? (
          <span className="text-sm sm:text-base font-medium text-amber-300">{unavailableLabel}</span>
        ) : (
          <span className={`text-2xl sm:text-3xl font-display font-bold ${getScoreColor(score)}`}>{score}%</span>
        )}
      </div>
      {unavailable ? (
        <p className="text-xs text-muted-foreground leading-relaxed">{unavailableSub}</p>
      ) : (
        <Progress value={score} className="h-2" />
      )}
    </CardContent>
  </Card>
);

const ListCard = ({
  title,
  items,
  icon,
  badgeClass,
  variant = "badge",
  emptyMessage = "None identified",
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  badgeClass?: string;
  variant?: "badge" | "list";
  emptyMessage?: string;
}) => (
  <Card className="glass-card border-white/[0.08]">
    <CardHeader className="pb-3">
      <CardTitle className="text-foreground flex items-center gap-2 text-base">{icon} {title}</CardTitle>
    </CardHeader>
    <CardContent>
      {items.length === 0 ? (
        <div className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
          <Info className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/70" />
          <span>{emptyMessage}</span>
        </div>
      ) : variant === "badge" ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <Badge key={i} variant="outline" className={badgeClass}>{item}</Badge>
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/85 leading-relaxed">
              <span className="text-accent mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

// Experience: neutral, informational fallback when no usable data is detected
const ExperienceCard = ({ items }: { items: string[] }) => {
  const hasData = items.length > 0;
  return (
    <Card className="glass-card border-white/[0.08]">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2 text-base">
          <Clock className="w-5 h-5 text-amber-400" /> Experience Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground/85 leading-relaxed">
                <span className="text-amber-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] p-3 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
            <p className="text-sm text-foreground/80 leading-relaxed">
              Experience timeline could not be fully analyzed from this resume. Try uploading a text-based PDF or a resume with clearer formatting for richer career insights.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Weaknesses: separate ATS weaknesses from parsing issues with a neutral fallback
const WeaknessCard = ({ items, limited = false }: { items: string[]; limited?: boolean }) => {
  const hasData = !limited && items.length > 0;
  return (
    <Card className="glass-card border-white/[0.08]">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2 text-base">
          {hasData ? (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          ) : (
            <Info className="w-5 h-5 text-amber-400" />
          )}
          {hasData ? "Weaknesses" : "Resume Insights"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground/85 leading-relaxed">
                <span className="text-red-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : limited ? (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] p-3 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
            <p className="text-sm text-foreground/80 leading-relaxed">
              No resume quality issues identified yet. Analysis is limited until readable resume text is extracted.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] p-3 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
            <p className="text-sm text-foreground/80 leading-relaxed">
              No significant weaknesses detected. Nice work!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeAnalyzer;

