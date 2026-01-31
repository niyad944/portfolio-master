import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ResumeContent {
  profile: {
    full_name: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    linkedin_url: string;
    github_url: string;
  };
  skills: Array<{ name: string; proficiency_level: string }>;
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
  onGenerated?: () => void;
}

const ResumePDFExport = ({ content, onGenerated }: ResumePDFExportProps) => {
  const [exporting, setExporting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const { profile, skills, education, projects, achievements } = content;

  const generatePDF = async () => {
    setExporting(true);
    
    try {
      // Create a printable HTML document
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Please allow popups to download your resume");
      }

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${profile?.full_name || "Resume"} - Resume</title>
  <style>
    @page { margin: 0.5in; size: letter; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', 'Arial', sans-serif; 
      line-height: 1.5; 
      color: #1a1a1a; 
      font-size: 11pt;
      background: white;
    }
    .resume { max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
    .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #0d9488; }
    .name { font-size: 24pt; font-weight: 700; color: #1a365d; margin-bottom: 8px; letter-spacing: 0.5px; }
    .contact { font-size: 10pt; color: #4a5568; }
    .contact a { color: #0d9488; text-decoration: none; }
    .contact span { margin: 0 6px; }
    .section { margin-bottom: 18px; }
    .section-title { 
      font-size: 11pt; 
      font-weight: 600; 
      color: #0d9488; 
      text-transform: uppercase; 
      letter-spacing: 1.5px; 
      margin-bottom: 10px; 
      padding-bottom: 4px; 
      border-bottom: 1px solid #e2e8f0; 
    }
    .bio { font-size: 10.5pt; color: #2d3748; text-align: justify; line-height: 1.6; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill { 
      background: #f0fdfa; 
      color: #0d9488; 
      padding: 3px 10px; 
      border-radius: 12px; 
      font-size: 9.5pt; 
      border: 1px solid #99f6e4;
    }
    .item { margin-bottom: 12px; page-break-inside: avoid; }
    .item-header { display: flex; justify-content: space-between; align-items: baseline; }
    .item-title { font-weight: 600; color: #1a365d; font-size: 11pt; }
    .item-subtitle { font-size: 10pt; color: #4a5568; }
    .item-date { font-size: 9pt; color: #718096; }
    .item-desc { font-size: 10pt; color: #2d3748; margin-top: 4px; line-height: 1.5; }
    .tech-stack { font-size: 9pt; color: #0d9488; margin-top: 3px; font-style: italic; }
    @media print { 
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .resume { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="resume">
    <div class="header">
      <div class="name">${profile?.full_name || "Your Name"}</div>
      <div class="contact">
        ${profile?.email ? `<span>${profile.email}</span>` : ""}
        ${profile?.phone ? `<span>•</span><span>${profile.phone}</span>` : ""}
        ${profile?.location ? `<span>•</span><span>${profile.location}</span>` : ""}
        ${profile?.linkedin_url ? `<span>•</span><a href="${profile.linkedin_url}">LinkedIn</a>` : ""}
        ${profile?.github_url ? `<span>•</span><a href="${profile.github_url}">GitHub</a>` : ""}
      </div>
    </div>

    ${profile?.bio ? `
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <p class="bio">${profile.bio}</p>
    </div>
    ` : ""}

    ${skills && skills.length > 0 ? `
    <div class="section">
      <div class="section-title">Technical Skills</div>
      <div class="skills-list">
        ${skills.map(s => `<span class="skill">${s.name}</span>`).join("")}
      </div>
    </div>
    ` : ""}

    ${education && education.length > 0 ? `
    <div class="section">
      <div class="section-title">Education</div>
      ${education.map(e => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${e.degree}${e.field_of_study ? ` in ${e.field_of_study}` : ""}</span>
          <span class="item-date">${e.start_date || ""} - ${e.end_date || "Present"}</span>
        </div>
        <div class="item-subtitle">${e.institution}${e.grade ? ` • ${e.grade}` : ""}</div>
      </div>
      `).join("")}
    </div>
    ` : ""}

    ${projects && projects.length > 0 ? `
    <div class="section">
      <div class="section-title">Projects</div>
      ${projects.map(p => `
      <div class="item">
        <div class="item-title">${p.title}</div>
        ${p.description ? `<div class="item-desc">${p.description}</div>` : ""}
        ${p.technologies?.length ? `<div class="tech-stack">Technologies: ${p.technologies.join(", ")}</div>` : ""}
      </div>
      `).join("")}
    </div>
    ` : ""}

    ${achievements && achievements.length > 0 ? `
    <div class="section">
      <div class="section-title">Achievements</div>
      ${achievements.map(a => `
      <div class="item">
        <div class="item-title">${a.title}</div>
        ${a.issuer ? `<div class="item-subtitle">${a.issuer}</div>` : ""}
        ${a.description ? `<div class="item-desc">${a.description}</div>` : ""}
      </div>
      `).join("")}
    </div>
    ` : ""}
  </div>
  <script>
    window.onload = function() {
      window.print();
      window.onafterprint = function() { window.close(); };
    };
  </script>
</body>
</html>`;

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
          <div ref={printRef} className="bg-white p-8 rounded-lg shadow-inner">
            {/* Preview Header */}
            <div className="text-center mb-6 pb-4 border-b-2 border-accent">
              <h1 className="text-2xl font-bold text-primary mb-2">
                {profile?.full_name || "Your Name"}
              </h1>
              <div className="text-sm text-muted-foreground space-x-2">
                {profile?.email && <span>{profile.email}</span>}
                {profile?.phone && <span>• {profile.phone}</span>}
                {profile?.location && <span>• {profile.location}</span>}
              </div>
            </div>

            {/* Preview Content */}
            {profile?.bio && (
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2 pb-1 border-b">
                  Professional Summary
                </h2>
                <p className="text-sm text-foreground">{profile.bio}</p>
              </div>
            )}

            {skills && skills.length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2 pb-1 border-b">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {education && education.length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2 pb-1 border-b">
                  Education
                </h2>
                {education.map((e, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{e.degree} {e.field_of_study && `in ${e.field_of_study}`}</span>
                      <span className="text-xs text-muted-foreground">
                        {e.start_date} - {e.end_date || "Present"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{e.institution}</p>
                  </div>
                ))}
              </div>
            )}

            {projects && projects.length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2 pb-1 border-b">
                  Projects
                </h2>
                {projects.map((p, i) => (
                  <div key={i} className="mb-3">
                    <p className="font-medium text-sm">{p.title}</p>
                    {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
                    {p.technologies?.length > 0 && (
                      <p className="text-xs text-accent mt-1">Tech: {p.technologies.join(", ")}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
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
