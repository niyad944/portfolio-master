import { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Github,
  Loader2,
  X,
  Calendar,
  Star,
  Upload,
  ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { capitalizeProper } from "@/lib/capitalizeProper";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface DashboardContext {
  user: SupabaseUser;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  technologies: string[] | null;
  start_date: string | null;
  end_date: string | null;
  project_url: string | null;
  github_url: string | null;
  image_url: string | null;
  is_featured: boolean;
  sdg_goals: string[] | null;
  created_at: string;
}

const SDG_OPTIONS = [
  "SDG 1: No Poverty",
  "SDG 2: Zero Hunger",
  "SDG 3: Good Health & Well-Being",
  "SDG 4: Quality Education",
  "SDG 5: Gender Equality",
  "SDG 6: Clean Water & Sanitation",
  "SDG 7: Affordable & Clean Energy",
  "SDG 8: Decent Work & Economic Growth",
  "SDG 9: Industry, Innovation & Infrastructure",
  "SDG 10: Reduced Inequalities",
  "SDG 11: Sustainable Cities & Communities",
  "SDG 12: Responsible Consumption & Production",
  "SDG 13: Climate Action",
  "SDG 14: Life Below Water",
  "SDG 15: Life on Land",
  "SDG 16: Peace, Justice & Strong Institutions",
  "SDG 17: Partnerships for the Goals",
];

const Projects = () => {
  const { user } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    start_date: "",
    end_date: "",
    project_url: "",
    github_url: "",
    is_featured: false,
    sdg_goals: "",
    image_url: "",
  });

  useEffect(() => {
    fetchProjects();
  }, [user.id]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("is_featured", { ascending: false })
      .order("start_date", { ascending: false });

    if (data) setProjects(data as unknown as Project[]);
    setLoading(false);
  };

  const openAddDialog = () => {
    setEditingProject(null);
    setImagePreview(null);
    setFormData({
      title: "",
      description: "",
      technologies: "",
      start_date: "",
      end_date: "",
      project_url: "",
      github_url: "",
      is_featured: false,
      sdg_goals: "",
      image_url: "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setImagePreview(project.image_url || null);
    setFormData({
      title: project.title,
      description: project.description || "",
      technologies: project.technologies?.join(", ") || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      project_url: project.project_url || "",
      github_url: project.github_url || "",
      is_featured: project.is_featured,
      sdg_goals: project.sdg_goals?.join(", ") || "",
      image_url: project.image_url || "",
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      toast({ title: "Invalid Format", description: "Only JPG and PNG images are accepted", variant: "destructive" });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Max image size is 4MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("project-images").upload(filePath, file, { upsert: true });
    if (error) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;
    setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    setImagePreview(publicUrl);
    setUploading(false);
    toast({ title: "Image Uploaded" });
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image_url: "" }));
    setImagePreview(null);
  };

  const saveProject = async () => {
    if (!formData.title.trim()) {
      toast({ title: "Title Required", description: "Please enter a project title", variant: "destructive" });
      return;
    }

    setSaving(true);

    const technologies = formData.technologies
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const sdgGoals = formData.sdg_goals
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const projectData = {
      title: capitalizeProper(formData.title),
      description: formData.description || null,
      technologies: technologies.length > 0 ? technologies : null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      project_url: formData.project_url || null,
      github_url: formData.github_url || null,
      is_featured: formData.is_featured,
      image_url: formData.image_url || null,
      sdg_goals: sdgGoals.length > 0 ? sdgGoals : null,
    };

    try {
      if (editingProject) {
        const { data, error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingProject.id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setProjects(projects.map((p) => (p.id === data.id ? (data as unknown as Project) : p)));
          toast({ title: "Project Updated" });
        }
      } else {
        const { data, error } = await supabase
          .from("projects")
          .insert({ ...projectData, user_id: user.id })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setProjects([data as unknown as Project, ...projects]);
          toast({ title: "Project Added" });
        }
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      setProjects(projects.filter((p) => p.id !== id));
      toast({ title: "Project Deleted" });
    }
  };

  const toggleFeatured = async (project: Project) => {
    const { data, error } = await supabase
      .from("projects")
      .update({ is_featured: !project.is_featured })
      .eq("id", project.id)
      .select()
      .single();

    if (!error && data) {
      setProjects(projects.map((p) => (p.id === data.id ? (data as unknown as Project) : p)));
    }
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">Showcase your work and technical achievements</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label>Project Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., E-commerce Platform"
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what the project does and your role..."
                  className="min-h-[100px] input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label>Technologies Used</Label>
                <Input
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Node.js, PostgreSQL (comma separated)"
                  className="input-focus"
                />
              </div>

              {/* SDG Goals */}
              <div className="space-y-2">
                <Label>SDG Covered</Label>
                <Input
                  value={formData.sdg_goals}
                  onChange={(e) => setFormData({ ...formData, sdg_goals: e.target.value })}
                  placeholder="SDG 3: Good Health, SDG 4: Quality Education"
                  className="input-focus"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SDG_OPTIONS.slice(0, 6).map((sdg) => (
                    <button
                      key={sdg}
                      type="button"
                      onClick={() => {
                        const current = formData.sdg_goals;
                        if (current.includes(sdg)) return;
                        setFormData({
                          ...formData,
                          sdg_goals: current ? `${current}, ${sdg}` : sdg,
                        });
                      }}
                      className="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
                    >
                      {sdg.split(":")[0]}
                    </button>
                  ))}
                  <span className="text-[10px] text-muted-foreground self-center">+{SDG_OPTIONS.length - 6} more</span>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Project Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-accent/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6" />
                        <span className="text-xs">Click to upload (JPG, PNG · max 4MB)</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="input-focus"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Live Project URL</Label>
                <Input
                  value={formData.project_url}
                  onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  placeholder="https://myproject.com"
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub Repository URL</Label>
                <Input
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/username/repo"
                  className="input-focus"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <Label className="font-medium">Featured Project</Label>
                  <p className="text-xs text-muted-foreground">Highlight this on your resume</p>
                </div>
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
              </div>
              <Button
                onClick={saveProject}
                disabled={saving}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingProject ? "Update Project" : "Add Project"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Yet</h3>
          <p className="text-muted-foreground mb-6">Start showcasing your work by adding your first project</p>
          <Button onClick={openAddDialog} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project) => (
            <div key={project.id} className="document-card overflow-hidden">
              {/* Project Image */}
              {project.image_url && (
                <div className="w-full h-40 -mt-1 -mx-0 mb-4 overflow-hidden rounded-t-xl">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}

              {/* SDG Badges */}
              {project.sdg_goals && project.sdg_goals.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.sdg_goals.map((sdg, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5">
                      <SDGLogo sdg={sdg} size={18} />
                      <Badge
                        className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-accent/20 to-accent/10 text-accent border-accent/30 px-2.5 py-1"
                      >
                        {sdg}
                      </Badge>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg text-foreground">{project.title}</h3>
                    {project.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                  </div>
                  {project.start_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(project.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        {project.end_date &&
                          ` - ${new Date(project.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                        {!project.end_date && " - Present"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {project.description && (
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{project.description}</p>
              )}

              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-accent hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                <div className="flex-1" />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleFeatured(project)}
                  className={project.is_featured ? "text-yellow-500" : "text-muted-foreground"}
                >
                  <Star className={`w-4 h-4 ${project.is_featured ? "fill-yellow-500" : ""}`} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openEditDialog(project)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteProject(project.id)}
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

export default Projects;
