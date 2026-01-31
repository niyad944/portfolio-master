import { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  FolderLock,
  Upload,
  FileText,
  Trash2,
  Download,
  Eye,
  Loader2,
  X,
  Calendar,
  Building2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface DashboardContext {
  user: SupabaseUser;
}

interface Certificate {
  id: string;
  name: string;
  type: string;
  issuing_organization: string | null;
  issue_date: string | null;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  created_at: string;
}

const certificateTypes = [
  { value: "degree", label: "Degree Certificate" },
  { value: "sslc", label: "SSLC Certificate" },
  { value: "hsc", label: "HSC Certificate" },
  { value: "internship", label: "Internship Certificate" },
  { value: "certification", label: "Professional Certification" },
  { value: "other", label: "Other" }
];

const Certificates = () => {
  const { user } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newCert, setNewCert] = useState({
    name: "",
    type: "certification" as string,
    issuing_organization: "",
    issue_date: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, [user.id]);

  const fetchCertificates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setCertificates(data);
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadCertificate = async () => {
    if (!newCert.name.trim() || !newCert.type) {
      toast({
        title: "Missing information",
        description: "Please fill in the certificate name and type",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      let filePath = null;
      let fileName = null;
      let fileSize = null;
      let mimeType = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const filePathGenerated = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("certificates")
          .upload(filePathGenerated, selectedFile);

        if (uploadError) throw uploadError;

        filePath = filePathGenerated;
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
        mimeType = selectedFile.type;
      }

      const { data, error } = await supabase
        .from("certificates")
        .insert({
          user_id: user.id,
          name: newCert.name,
          type: newCert.type,
          issuing_organization: newCert.issuing_organization || null,
          issue_date: newCert.issue_date || null,
          file_path: filePath,
          file_name: fileName,
          file_size: fileSize,
          mime_type: mimeType
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setCertificates([data, ...certificates]);
        toast({ title: "Certificate Added", description: "Your certificate has been securely stored." });
        setDialogOpen(false);
        resetForm();
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setNewCert({ name: "", type: "certification", issuing_organization: "", issue_date: "" });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deleteCertificate = async (cert: Certificate) => {
    try {
      if (cert.file_path) {
        await supabase.storage.from("certificates").remove([cert.file_path]);
      }

      const { error } = await supabase.from("certificates").delete().eq("id", cert.id);
      if (error) throw error;

      setCertificates(certificates.filter(c => c.id !== cert.id));
      toast({ title: "Certificate Deleted" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const downloadCertificate = async (cert: Certificate) => {
    if (!cert.file_path) return;

    const { data, error } = await supabase.storage
      .from("certificates")
      .download(cert.file_path);

    if (error) {
      toast({ title: "Download Failed", description: error.message, variant: "destructive" });
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = cert.file_name || "certificate";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeLabel = (type: string) => {
    return certificateTypes.find(t => t.value === type)?.label || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Document Locker</h1>
          <p className="text-muted-foreground">
            Securely store and manage your academic certificates
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Upload className="w-4 h-4 mr-2" />
              Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Certificate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Certificate Name *</Label>
                <Input
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                  placeholder="e.g., Bachelor of Technology"
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={newCert.type}
                  onValueChange={(value) => setNewCert({ ...newCert, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {certificateTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Issuing Organization</Label>
                <Input
                  value={newCert.issuing_organization}
                  onChange={(e) => setNewCert({ ...newCert, issuing_organization: e.target.value })}
                  placeholder="e.g., University of Technology"
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Input
                  type="date"
                  value={newCert.issue_date}
                  onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label>Upload File (Optional)</Label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    selectedFile ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileSelect}
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, JPG, PNG, DOC (max 10MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
              <Button
                onClick={uploadCertificate}
                disabled={uploading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {uploading ? "Uploading..." : "Add Certificate"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <FolderLock className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Certificates Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start building your document locker by adding your first certificate
          </p>
          <Button onClick={() => setDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Upload className="w-4 h-4 mr-2" />
            Add Your First Certificate
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="document-card">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {getTypeLabel(cert.type)}
                </span>
              </div>

              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{cert.name}</h3>

              {cert.issuing_organization && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Building2 className="w-4 h-4" />
                  <span className="truncate">{cert.issuing_organization}</span>
                </div>
              )}

              {cert.issue_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(cert.issue_date).toLocaleDateString()}</span>
                </div>
              )}

              {cert.file_path && (
                <p className="text-xs text-muted-foreground mb-4">
                  File: {cert.file_name} ({formatFileSize(cert.file_size)})
                </p>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                {cert.file_path && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadCertificate(cert)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteCertificate(cert)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
