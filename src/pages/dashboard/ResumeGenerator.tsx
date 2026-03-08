import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  GraduationCap,
  Briefcase,
  Award,
  RefreshCw,
  Globe,
  Share2,
  Camera,
  Upload
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AISuggestionPanel from "@/components/resume/AISuggestionPanel";
import ResumePDFExport from "@/components/resume/ResumePDFExport";
import { getResumeHTML } from "@/components/resume/resumeTemplates";
import PublicPortfolioSettings from "@/components/portfolio/PublicPortfolioSettings";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [showPortfolioSettings, setShowPortfolioSettings] = useState(false);

  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
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
      supabase.from("skills").select("*").eq("user_id", user.id),
      supabase.from("education").select("*").eq("user_id", user.id).order("start_date", { ascending: false }),
      supabase.from("projects").select("*").eq("user_id", user.id).order("is_featured", { ascending: false }),
      supabase.from("achievements").select("*").eq("user_id", user.id),
      supabase.from("certificates").select("id").eq("user_id", user.id)
    ]);

    if (templatesRes.data) setTemplates(templatesRes.data);
    if (profileRes.data) {
      setProfileData(profileRes.data);
      setProfilePhotoUrl((profileRes.data as any).profile_photo_url || null);
    }

    // Prepare resume data for AI suggestions
    setResumeData({
      profile: { ...(profileRes.data || {}), profile_photo_url: (profileRes.data as any)?.profile_photo_url },
      skills: skillsRes.data || [],
      education: educationRes.data || [],
      projects: projectsRes.data || [],
      achievements: achievementsRes.data || []
    });

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Only JPG, JPEG, and PNG files are allowed.", variant: "destructive" });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 4MB.", variant: "destructive" });
      return;
    }

    setUploadingPhoto(true);
    try {
      const filePath = `${user.id}/profile.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("resume-photos")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("resume-photos")
        .getPublicUrl(filePath);

      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_photo_url: publicUrl } as any)
        .eq("user_id", user.id);
      if (updateError) throw updateError;

      setProfilePhotoUrl(publicUrl);
      setResumeData((prev: any) => ({
        ...prev,
        profile: { ...prev.profile, profile_photo_url: publicUrl }
      }));

      toast({ title: "Photo uploaded!", description: "Your profile photo has been updated." });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
    }
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
    const html = getResumeHTML(selectedTemplate, content);

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${content.profile?.full_name?.replace(/\s+/g, "_") || "resume"}_Resume.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAISuggestionAccept = async (text: string) => {
    // Update the profile bio with the suggestion
    const { error } = await supabase
      .from("profiles")
      .update({ bio: text })
      .eq("user_id", user.id);

    if (!error) {
      setProfileData(prev => prev ? { ...prev, bio: text } : null);
      setResumeData((prev: any) => ({
        ...prev,
        profile: { ...prev.profile, bio: text }
      }));
    }
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
    <div className="p-4 sm:p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Resume Generator</h1>
          <p className="text-muted-foreground">
            Generate a professional resume using your portfolio data
          </p>
        </div>
        <Dialog open={showPortfolioSettings} onOpenChange={setShowPortfolioSettings}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              Share Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Public Portfolio Settings
              </DialogTitle>
            </DialogHeader>
            <PublicPortfolioSettings userId={user.id} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Photo Upload */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Camera className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Profile Photo</h2>
            <p className="text-sm text-muted-foreground">Upload a photo for your resume (JPG/PNG, max 4MB)</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          <div className="relative shrink-0">
            {profilePhotoUrl ? (
              <img
                src={profilePhotoUrl}
                alt="Profile"
                className="w-24 h-24 sm:w-[120px] sm:h-[120px] rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-24 h-24 sm:w-[120px] sm:h-[120px] rounded-full bg-muted flex items-center justify-center border-2 border-border">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <label htmlFor="photo-upload">
              <Button variant="outline" asChild disabled={uploadingPhoto}>
                <span>
                  {uploadingPhoto ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  {uploadingPhoto ? "Uploading..." : profilePhotoUrl ? "Change Photo" : "Upload Photo"}
                </span>
              </Button>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={uploadingPhoto}
            />
            <p className="text-xs text-muted-foreground text-center sm:text-left">Recommended: Square image, at least 200×200px</p>
          </div>
        </div>
      </div>

      {/* Readiness Score */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className={`p-3 sm:p-4 rounded-xl border ${dataStatus.profile ? "border-accent/50 bg-accent/5" : "border-border"}`}>
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

          <div className={`p-3 sm:p-4 rounded-xl border ${dataStatus.skills > 0 ? "border-accent/50 bg-accent/5" : "border-border"}`}>
            <div className="flex items-center gap-2 mb-1">
              <Award className={`w-4 h-4 ${dataStatus.skills > 0 ? "text-accent" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">Skills</span>
            </div>
            <span className="text-xs text-muted-foreground">{dataStatus.skills} added</span>
          </div>

          <div className={`p-3 sm:p-4 rounded-xl border ${dataStatus.education > 0 ? "border-accent/50 bg-accent/5" : "border-border"}`}>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className={`w-4 h-4 ${dataStatus.education > 0 ? "text-accent" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">Education</span>
            </div>
            <span className="text-xs text-muted-foreground">{dataStatus.education} entries</span>
          </div>

          <div className={`p-3 sm:p-4 rounded-xl border ${dataStatus.projects > 0 ? "border-accent/50 bg-accent/5" : "border-border"}`}>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className={`w-4 h-4 ${dataStatus.projects > 0 ? "text-accent" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">Projects</span>
            </div>
            <span className="text-xs text-muted-foreground">{dataStatus.projects} added</span>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      {resumeData && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">AI Writing Assistant</h2>
              <p className="text-sm text-muted-foreground">Get mentor-style suggestions to improve your resume</p>
            </div>
          </div>

          <div className="space-y-4">
            <AISuggestionPanel
              type="summary"
              resumeData={resumeData}
              currentText={profileData?.bio}
              onAccept={handleAISuggestionAccept}
            />
            <AISuggestionPanel
              type="achievement"
              resumeData={resumeData}
              onAccept={(text) => {
                toast({
                  title: "Suggestion copied!",
                  description: "Add this as a new achievement in your About Me section."
                });
                navigator.clipboard.writeText(text);
              }}
            />
            <AISuggestionPanel
              type="skill"
              resumeData={resumeData}
              onAccept={(text) => {
                toast({
                  title: "Skill suggestion noted!",
                  description: "Consider adding this skill in your About Me section."
                });
              }}
            />
          </div>
        </div>
      )}

      {/* Template Selection */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Choose Template</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.template_key)}
              className={`p-4 sm:p-6 rounded-xl border-2 text-left transition-all ${
                selectedTemplate === template.template_key
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-3 sm:mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{template.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
              {selectedTemplate === template.template_key && (
                <Badge className="mt-2 sm:mt-3 bg-accent text-accent-foreground">Selected</Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Generate & Export */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Generate</h3>
        <p className="text-muted-foreground mb-6">
          Your resume will include all the data from your portfolio
        </p>

        {/* PDF Export with Preview */}
        {resumeData && (
          <div className="mb-6">
            <ResumePDFExport
              content={resumeData}
              templateKey={selectedTemplate}
              onGenerated={() => {
                toast({
                  title: "PDF Ready!",
                  description: "Your ATS-friendly resume is being generated."
                });
              }}
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={generateResume}
            disabled={generating || readinessScore < 25}
            variant="outline"
            size="lg"
          >
            {generating ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            {generating ? "Generating..." : "Download HTML Version"}
          </Button>
          <Button variant="ghost" onClick={fetchData} size="lg">
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
