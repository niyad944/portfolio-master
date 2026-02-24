import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Eye, MapPin, Phone, Mail, Github, Linkedin, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getResumeHTML, templatePreviewStyles } from "./resumeTemplates";

interface ResumeContent {
  profile: {
    full_name: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url?: string;
  };
  skills: Array<{ name: string; proficiency_level: string; category?: string }>;
  education: Array<{
    degree: string;
    institution: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
    grade: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  achievements: Array<{
    title: string;
    description: string;
    issuer: string;
  }>;
}

interface ResumePDFExportProps {
  content: ResumeContent;
  templateKey?: string;
  onGenerated?: () => void;
}

const ResumePDFExport = ({ content, templateKey = "professional", onGenerated }: ResumePDFExportProps) => {
  const [exporting, setExporting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const { profile, skills, education, projects, achievements } = content;
  const style = templatePreviewStyles[templateKey] || templatePreviewStyles.professional;

  const generatePDF = async () => {
    setExporting(true);
    
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Please allow popups to download your resume");
      }

      const htmlContent = getResumeHTML(templateKey, content);
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      onGenerated?.();
    } catch (error: any) {
      console.error("PDF export error:", error);
      alert(error.message || "Failed to generate PDF");
    } finally {
      setExporting(false);
    }
  };

  const initials = (profile?.full_name || "?")[0].toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg">
            <Eye className="w-4 h-4 mr-2" />
            Preview Resume
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          <div ref={printRef} className="bg-white text-gray-900 rounded-lg shadow-inner overflow-hidden">
            <div className="grid grid-cols-[200px_1fr]">
              {/* Left Sidebar */}
              <div className={`${style.sidebarBg} ${style.sidebarText} p-5`}>
                {/* Avatar */}
                <div className={`w-20 h-20 rounded-full ${style.avatarBg} flex items-center justify-center mx-auto mb-3`}>
                  <span className={`text-2xl font-semibold ${style.avatarText}`}>{initials}</span>
                </div>
                <h1 className={`${style.nameClass} text-center mb-1 !text-base`}>
                  {profile?.full_name || "Your Name"}
                </h1>
                <p className="text-[9px] uppercase tracking-[2px] text-center opacity-50 mb-5">Resume</p>

                {/* Contact */}
                <div className="mb-4">
                  <p className={`text-[8px] uppercase tracking-[2px] mb-2 ${style.accentColor} font-semibold`}>Contact</p>
                  <div className="space-y-1.5">
                    {profile?.location && (
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <MapPin className={`w-3 h-3 flex-shrink-0 ${style.accentColor}`} />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile?.phone && (
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <Phone className={`w-3 h-3 flex-shrink-0 ${style.accentColor}`} />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile?.email && (
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <Mail className={`w-3 h-3 flex-shrink-0 ${style.accentColor}`} />
                        <span className="truncate">{profile.email}</span>
                      </div>
                    )}
                    {profile?.github_url && (
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <Github className={`w-3 h-3 flex-shrink-0 ${style.accentColor}`} />
                        <span>GitHub</span>
                      </div>
                    )}
                    {profile?.linkedin_url && (
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <Linkedin className={`w-3 h-3 flex-shrink-0 ${style.accentColor}`} />
                        <span>LinkedIn</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {skills && skills.length > 0 && (
                  <div>
                    <p className={`text-[8px] uppercase tracking-[2px] mb-2 ${style.accentColor} font-semibold`}>Skills</p>
                    <div className="space-y-1">
                      {skills.map((s, i) => (
                        <div key={i} className="text-[10px]">
                          {templateKey === "creative" ? (
                            <span className={style.skillClass}>{s.name}</span>
                          ) : (
                            <span>• {s.name}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Content */}
              <div className="p-6">
                {profile?.bio && (
                  <div className="mb-4">
                    <h2 className={style.sectionTitleClass}>Summary</h2>
                    <p className="text-xs text-gray-600 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {education && education.length > 0 && (
                  <div className="mb-4">
                    <h2 className={style.sectionTitleClass}>Education</h2>
                    {education.map((e, i) => (
                      <div key={i} className="mb-2.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-medium text-xs text-gray-900">
                            {e.degree}{e.field_of_study ? `, ${e.field_of_study}` : ""}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {e.start_date} – {e.end_date || "Present"}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">{e.institution}{e.grade ? ` · ${e.grade}` : ""}</p>
                      </div>
                    ))}
                  </div>
                )}

                {projects && projects.length > 0 && (
                  <div className="mb-4">
                    <h2 className={style.sectionTitleClass}>Projects</h2>
                    {projects.map((p, i) => (
                      <div key={i} className="mb-2.5">
                        <p className="font-medium text-xs text-gray-900">{p.title}</p>
                        {p.description && <p className="text-[10px] text-gray-500">{p.description}</p>}
                        {p.technologies?.length > 0 && (
                          <p className={`text-[10px] mt-0.5 ${style.accentColor}`}>
                            {p.technologies.join(", ")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {achievements && achievements.length > 0 && (
                  <div className="mb-4">
                    <h2 className={style.sectionTitleClass}>Achievements</h2>
                    {achievements.map((a, i) => (
                      <div key={i} className="mb-2.5">
                        <p className="font-medium text-xs text-gray-900">{a.title}</p>
                        {a.issuer && <p className="text-[10px] text-gray-500">{a.issuer}</p>}
                        {a.description && <p className="text-[10px] text-gray-500">{a.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={generatePDF}
        disabled={exporting}
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
        size="lg"
      >
        {exporting ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        Download as PDF
      </Button>
    </div>
  );
};

export default ResumePDFExport;
