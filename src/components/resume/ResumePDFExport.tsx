import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getResumeHTML } from "./resumeTemplates";
import ResumePreview from "./ResumePreview";

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
    profile_photo_url?: string;
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

  const generatePDF = useCallback(async () => {
    setExporting(true);

    try {
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = jsPDFModule;

      // Create an offscreen container to render the resume HTML
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "816px"; // 8.5in at 96dpi
      container.style.background = "#fff";
      container.style.zIndex = "-9999";
      document.body.appendChild(container);

      // Render the resume HTML into the container via an iframe-like approach
      const htmlContent = getResumeHTML(templateKey, content);

      // Parse just the body content and styles from the full HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");

      // Copy styles
      const styles = doc.querySelectorAll("style");
      styles.forEach((s) => {
        const cloned = document.createElement("style");
        cloned.textContent = s.textContent;
        container.appendChild(cloned);
      });

      // Copy body content (skip scripts)
      const bodyContent = doc.body.innerHTML.replace(/<script[\s\S]*?<\/script>/gi, "");
      const wrapper = document.createElement("div");
      wrapper.innerHTML = bodyContent;
      container.appendChild(wrapper);

      // Wait for images to load
      const images = container.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) return resolve();
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Skip broken images
              // Add crossorigin for external images
              img.crossOrigin = "anonymous";
            })
        )
      );

      // Small delay for fonts to load
      await new Promise((r) => setTimeout(r, 500));

      // Capture with html2canvas at high DPI
      const canvas = await html2canvas(container, {
        scale: 2, // 2x for crisp text (effective ~192dpi)
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 816,
        windowWidth: 816,
        logging: false,
      });

      document.body.removeChild(container);

      // A4 dimensions in mm
      const a4Width = 210;
      const a4Height = 297;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const canvasAspect = canvas.height / canvas.width;
      const pdfContentHeight = a4Width * canvasAspect;

      // If content fits on one page
      if (pdfContentHeight <= a4Height) {
        pdf.addImage(imgData, "JPEG", 0, 0, a4Width, pdfContentHeight);
      } else {
        // Multi-page: slice the canvas
        const pageCanvasHeight = (a4Height / a4Width) * canvas.width;
        let yOffset = 0;
        let pageNum = 0;

        while (yOffset < canvas.height) {
          if (pageNum > 0) pdf.addPage();

          const sliceHeight = Math.min(pageCanvasHeight, canvas.height - yOffset);

          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeight;
          const ctx = pageCanvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(
              canvas,
              0, yOffset, canvas.width, sliceHeight,
              0, 0, canvas.width, sliceHeight
            );
          }

          const sliceData = pageCanvas.toDataURL("image/jpeg", 0.95);
          const sliceHeightMm = (sliceHeight / canvas.width) * a4Width;
          pdf.addImage(sliceData, "JPEG", 0, 0, a4Width, sliceHeightMm);

          yOffset += sliceHeight;
          pageNum++;
        }
      }

      const fileName = `${content.profile?.full_name?.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`;
      pdf.save(fileName);
      onGenerated?.();
    } catch (error: any) {
      console.error("PDF export error:", error);
      alert(error.message || "Failed to generate PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [content, templateKey, onGenerated]);

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
          <ResumePreview content={content} templateKey={templateKey} />
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
        {exporting ? "Generating PDF..." : "Download as PDF"}
      </Button>
    </div>
  );
};

export default ResumePDFExport;
