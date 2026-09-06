import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  FileText,
  Image as ImageIcon,
  Calendar,
  Building2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import FloatingOrbs from "@/components/effects/FloatingOrbs";
import { SDGLogo } from "@/components/SDGLogo";

const PublicDocumentView = () => {
  const { slug, docId } = useParams();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [sdgGoals, setSdgGoals] = useState<string[]>([]);

  useEffect(() => {
    fetchDocument();
  }, [slug, docId]);

  const fetchDocument = async () => {
    setLoading(true);
    setNotFound(false);

    // Public route: validate params before querying, no auth/session dependency.
    const cleanSlug = decodeURIComponent(slug ?? "").trim().toLowerCase();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(docId ?? "");
    if (!/^[a-z0-9-]{1,60}$/.test(cleanSlug) || !isUuid) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Get profile by slug
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, full_name, is_public")
      .eq("public_slug", cleanSlug)
      .eq("is_public", true)
      .maybeSingle();

    if (profileError || !profileData) {
      if (profileError) console.error("Document profile load failed:", profileError.message);
      setNotFound(true);
      setLoading(false);
      return;
    }

    setProfileName(profileData.full_name);

    // Get certificate
    const { data: certData, error: certError } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", docId)
      .eq("user_id", profileData.user_id)
      .maybeSingle();

    if (certError || !certData) {
      if (certError) console.error("Document load failed:", certError.message);
      setNotFound(true);
      setLoading(false);
      return;
    }

    setCertificate(certData);
    setSdgGoals(certData.sdg_goals || []);
    // Get file URL if file_path exists
    if (certData.file_path) {
      const { data: urlData } = supabase.storage
        .from("certificates")
        .getPublicUrl(certData.file_path);
      
      if (urlData?.publicUrl) {
        setFileUrl(urlData.publicUrl);
      }
    }

    setLoading(false);
  };

  const handleDownload = async () => {
    if (!certificate?.file_path) return;
    const { data, error } = await supabase.storage
      .from("certificates")
      .download(certificate.file_path);
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = certificate.file_name || "document";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const isPdf = certificate?.mime_type?.includes("pdf") || certificate?.file_name?.endsWith(".pdf");
  const isImage = certificate?.mime_type?.startsWith("image/");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
        <FloatingOrbs variant="subtle" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center relative z-10"
        >
          <h1 className="text-3xl font-display font-semibold text-foreground mb-5">Document Not Found</h1>
          <p className="text-muted-foreground mb-8">This document doesn't exist or the portfolio is private.</p>
          <Link to={slug ? `/p/${slug}` : "/"}>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground min-h-[52px] px-8 rounded-xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingOrbs variant="subtle" />
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-accent/4 rounded-full blur-[180px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="border-b border-slate-300/[0.06] glass-strong sticky top-0 z-20"
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={`/p/${slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{profileName}'s Portfolio</span>
          </Link>
          {certificate?.file_path && (
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="border-accent/20 text-accent hover:bg-accent/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </motion.header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* SDG Hero Banner */}
          {sdgGoals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                {sdgGoals.map((sdg: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2.5 text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide text-accent bg-accent/10 border border-accent/25 backdrop-blur-sm px-5 py-2.5 rounded-xl shadow-[0_0_20px_hsl(var(--accent)/0.15)]"
                    style={{ textShadow: '0 0 24px hsl(var(--accent) / 0.3)' }}
                  >
                    <SDGLogo sdg={sdg} size={34} />
                    {sdg}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Document Info + Preview — two-column on desktop */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Preview side */}
            <div className="w-full md:w-3/5 glass-card rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[500px]">
              {fileUrl && isPdf && (
                <iframe
                  src={fileUrl}
                  className="w-full h-[400px] sm:h-[600px] border-0"
                  title={certificate.name}
                />
              )}
              {fileUrl && isImage && (
                <div className="flex items-center justify-center p-6 sm:p-10 bg-slate-100 h-full">
                  <img
                    src={fileUrl}
                    alt={certificate.name}
                    className="max-w-full max-h-[500px] object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              {(!fileUrl || (!isPdf && !isImage)) && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <FileText className="w-16 h-16 mb-4 opacity-40" />
                  <p className="text-sm">Preview not available for this file type</p>
                  {certificate.file_path && (
                    <Button
                      onClick={handleDownload}
                      className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download to View
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Details side */}
            <div className="w-full md:w-2/5 flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl font-display font-semibold text-foreground mb-3">
                {certificate.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  {certificate.type}
                </Badge>
                {certificate.issuing_organization && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    {certificate.issuing_organization}
                  </span>
                )}
                {certificate.issue_date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(certificate.issue_date).toLocaleDateString()}
                  </span>
                )}
              </div>

              {certificate.description && (
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {certificate.description}
                </p>
              )}

              {certificate.credential_url && (
                <a
                  href={certificate.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline mb-4"
                >
                  <ExternalLink className="w-4 h-4" />
                  Verify Credential
                </a>
              )}

              {/* SDG highlight on details side */}
              {sdgGoals.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-300/[0.06]">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">SDG Impact</p>
                  <div className="flex flex-wrap gap-2">
                    {sdgGoals.map((sdg: string, i: number) => (
                      <Badge
                        key={i}
                        className="text-sm font-extrabold bg-gradient-to-r from-accent/30 to-accent/10 text-accent border-accent/40 px-3 py-1.5 tracking-wide shadow-[0_0_12px_hsl(var(--accent)/0.12)]"
                      >
                        {sdg}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-slate-300/[0.06] py-8 text-center relative z-10">
        <p className="text-xs text-muted-foreground font-mono">
          Powered by{" "}
          <Link to="/" className="text-accent hover:underline">
            ProFolioX
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default PublicDocumentView;
