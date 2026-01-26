import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Sparkles,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  GraduationCap,
  Briefcase,
  Award,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface DashboardContext {
  user: SupabaseUser;
}

interface ProfileData {
  full_name: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
}

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  template_key: string;
}

const ResumeGenerator = () => {
  const { user } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("professional");

  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [dataStatus, setDataStatus] = useState({
    profile: false,
    skills: 0,
    education: 0,
    projects: 0,
    achievements: 0,
    certificates: 0
  });

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const fetchData = async () => {
    setLoading(true);

    const [templatesRes, profileRes, skillsRes, educationRes, projectsRes, achievementsRes, certificatesRes] = await Promise.all([
      supabase.from("resume_templates").select("*").eq("is_active", true),
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("skills").select("id").eq("user_id", user.id),
      supabase.from("education").select("id").eq("user_id", user.id),
      supabase.from("projects").select("id").eq("user_id", user.id),
      supabase.from("achievements").select("id").eq("user_id", user.id),
      supabase.from("certificates").select("id").eq("user_id", user.id)
    ]);

    if (templatesRes.data) setTemplates(templatesRes.data);
    if (profileRes.data) setProfileData(profileRes.data);

    setDataStatus({
      profile: !!(profileRes.data?.bio && profileRes.data?.full_name),
      skills: skillsRes.data?.length || 0,
      education: educationRes.data?.length || 0,
      projects: projectsRes.data?.length || 0,
      achievements: achievementsRes.data?.length || 0,
      certificates: certificatesRes.data?.length || 0
    });

    setLoading(false);
  };

  const generateResume = async () => {
    setGenerating(true);
    
    try {
      // Fetch all user data for resume
      const [profile, skills, education, projects, achievements] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("skills").select("*").eq("user_id", user.id),
        supabase.from("education").select("*").eq("user_id", user.id).order("start_date", { ascending: false }),
        supabase.from("projects").select("*").eq("user_id", user.id).order("is_featured", { ascending: false }),
        supabase.from("achievements").select("*").eq("user_id", user.id)
      ]);

      // Create resume content
      const resumeContent = {
        template: selectedTemplate,
        profile: profile.data,
        skills: skills.data || [],
        education: education.data || [],
        projects: projects.data || [],
        achievements: achievements.data || [],
        generatedAt: new Date().toISOString()
      };

      // Save generated resume reference
      const { error } = await supabase
        .from("generated_resumes")
        .insert({
          user_id: user.id,
          template_id: templates.find(t => t.template_key === selectedTemplate)?.id,
          content: resumeContent
        });

      if (error) throw error;

      // For now, generate a simple HTML resume and download
      downloadResume(resumeContent);

      toast({
        title: "Resume Generated!",
        description: "Your professional resume has been created and downloaded."
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadResume = (content: any) => {
    const { profile, skills, education, projects, achievements } = content;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${profile?.full_name || "Resume"} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #0d9488; }
    .name { font-size: 32px; font-weight: 700; color: #1a365d; margin-bottom: 8px; }
    .contact { font-size: 14px; color: #666; }
    .contact a { color: #0d9488; text-decoration: none; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 16px; font-weight: 600; color: #0d9488; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; padding-bottom: 5px; border-bottom: 1px solid #e2e8f0; }
    .bio { font-size: 14px; color: #555; text-align: justify; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill { background: #f0fdfa; color: #0d9488; padding: 4px 12px; border-radius: 15px; font-size: 13px; }
    .edu-item, .project-item, .achievement-item { margin-bottom: 15px; }
    .item-title { font-weight: 600; color: #1a365d; }
    .item-subtitle { font-size: 14px; color: #666; }
    .item-date { font-size: 12px; color: #888; }
    .item-desc { font-size: 13px; color: #555; margin-top: 5px; }
    .tech-stack { font-size: 12px; color: #0d9488; margin-top: 5px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${profile?.full_name || "Your Name"}</div>
    <div class="contact">
      ${profile?.email ? `<span>${profile.email}</span>` : ""}
      ${profile?.phone ? ` • <span>${profile.phone}</span>` : ""}
      ${profile?.location ? ` • <span>${profile.location}</span>` : ""}
      ${profile?.linkedin_url ? ` • <a href="${profile.linkedin_url}">LinkedIn</a>` : ""}
      ${profile?.github_url ? ` • <a href="${profile.github_url}">GitHub</a>` : ""}
    </div>
  </div>

  ${profile?.bio ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p class="bio">${profile.bio}</p>
  </div>
  ` : ""}

  ${skills.length > 0 ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills-list">
      ${skills.map((s: any) => `<span class="skill">${s.name}</span>`).join("")}
    </div>
  </div>
  ` : ""}

  ${education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${education.map((e: any) => `
    <div class="edu-item">
      <div class="item-title">${e.degree}${e.field_of_study ? ` in ${e.field_of_study}` : ""}</div>
      <div class="item-subtitle">${e.institution}</div>
      <div class="item-date">${e.start_date || ""} - ${e.end_date || "Present"}${e.grade ? ` • ${e.grade}` : ""}</div>
    </div>
    `).join("")}
  </div>
  ` : ""}

  ${projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projects.map((p: any) => `
    <div class="project-item">
      <div class="item-title">${p.title}</div>
      ${p.description ? `<div class="item-desc">${p.description}</div>` : ""}
      ${p.technologies?.length ? `<div class="tech-stack">Technologies: ${p.technologies.join(", ")}</div>` : ""}
    </div>
    `).join("")}
  </div>
  ` : ""}

  ${achievements.length > 0 ? `
  <div class="section">
    <div class="section-title">Achievements</div>
    ${achievements.map((a: any) => `
    <div class="achievement-item">
      <div class="item-title">${a.title}</div>
      ${a.issuer ? `<div class="item-subtitle">${a.issuer}</div>` : ""}
      ${a.description ? `<div class="item-desc">${a.description}</div>` : ""}
    </div>
    `).join("")}
  </div>
  ` : ""}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile?.full_name?.replace(/\s+/g, "_") || "resume"}_Resume.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalItems = dataStatus.skills + dataStatus.education + dataStatus.projects + dataStatus.achievements;
  const readinessScore = Math.min(100, Math.round((
    (dataStatus.profile ? 25 : 0) +
    (Math.min(dataStatus.skills, 5) / 5 * 25) +
    (Math.min(dataStatus.education, 2) / 2 * 25) +
    (Math.min(dataStatus.projects, 3) / 3 * 25)
  )));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Resume Generator</h1>
        <p className="text-muted-foreground">
          Generate a professional resume using your portfolio data
        </p>
      </div>

      {/* Readiness Score */}
      <div className="glass-card rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Resume Readiness</h2>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Profile Completeness</span>
            <span className="text-sm font-bold text-accent">{readinessScore}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent/70 transition-all duration-500"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border ${dataStatus.profile ? "border-accent/50 bg-accent/5" : "border-border"}`}>
            <div className="flex items-center gap-2 mb-1">
              <User className={`w-4 h-4 ${dataStatus.profile ? "text-accent" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">Profile</span>
            </div>
            <div className="flex items-center gap-1">
              {dataStatus.profile ? (
                <CheckCircle2 className="w-4 h-4 text-accent" />
              ) : (
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground">
                {dataStatus.profile ? "Complete" : "Needs attention"}
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${dataStatus.skills > 0 ? "border-accent/50 bg-accent/5" : "border-border"}`}>
            <div className="flex items-center gap-2 mb-1">
              <Award className={`w-4 h-4 ${dataStatus.skills > 0 ? "text-accent" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">Skills</span>
            </div>
            <span className="text-xs text-muted-foreground">{dataStatus.skills} added</span>
          </div>

          <div className={`p-4 rounded-xl border ${dataStatus.education > 0 ? "border-accent/50 bg-accent/5" : "border-border"}`}>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className={`w-4 h-4 ${dataStatus.education > 0 ? "text-accent" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">Education</span>
            </div>
            <span className="text-xs text-muted-foreground">{dataStatus.education} entries</span>
          </div>

          <div className={`p-4 rounded-xl border ${dataStatus.projects > 0 ? "border-accent/50 bg-accent/5" : "border-border"}`}>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className={`w-4 h-4 ${dataStatus.projects > 0 ? "text-accent" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">Projects</span>
            </div>
            <span className="text-xs text-muted-foreground">{dataStatus.projects} added</span>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="glass-card rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Choose Template</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.template_key)}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                selectedTemplate === template.template_key
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
              <p className="text-xs text-muted-foreground">{template.description}</p>
              {selectedTemplate === template.template_key && (
                <Badge className="mt-3 bg-accent text-accent-foreground">Selected</Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Generate</h3>
        <p className="text-muted-foreground mb-6">
          Your resume will include all the data from your portfolio
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={generateResume}
            disabled={generating || readinessScore < 25}
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
            size="lg"
          >
            {generating ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            {generating ? "Generating..." : "Generate Resume"}
          </Button>
          <Button variant="outline" onClick={fetchData} size="lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
        {readinessScore < 25 && (
          <p className="text-sm text-destructive mt-4">
            Please complete your profile and add some data before generating a resume.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResumeGenerator;
