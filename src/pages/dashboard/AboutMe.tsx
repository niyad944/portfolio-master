import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Save,
  Plus,
  X,
  GraduationCap,
  Award,
  Loader2,
  MapPin,
  Phone,
  Linkedin,
  Github,
  Globe,
  Upload,
  Eye,
  Trash2,
  Pencil,
  CalendarIcon,
  Trophy,
  Medal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface DashboardContext {
  user: SupabaseUser;
}

interface Profile {
  full_name: string;
  bio: string;
  phone: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
}

interface Skill {
  id: string;
  name: string;
  proficiency_level: string;
  category: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  grade: string;
}

interface Achievement {
  id: string;
  event_name: string;
  venue: string;
  date_achieved: string;
  achievement_level: string;
  achievement_type: string;
  position: string | null;
  certificate_url: string | null;
  title: string;
}

const AboutMe = () => {
  const { user } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    bio: "",
    phone: "",
    location: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: ""
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [newSkill, setNewSkill] = useState({ name: "", proficiency_level: "intermediate", category: "" });
  const [newEducation, setNewEducation] = useState<Omit<Education, "id">>({
    institution: "", degree: "", field_of_study: "", start_date: "", end_date: "", grade: ""
  });
  const [newAchievement, setNewAchievement] = useState({
    event_name: "", venue: "", date_achieved: "", achievement_level: "college",
    achievement_type: "participation", position: "", title: ""
  });
  const [achievementFile, setAchievementFile] = useState<File | null>(null);
  const [uploadingAchievement, setUploadingAchievement] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const fetchData = async () => {
    setLoading(true);
    const [profileRes, skillsRes, educationRes, achievementsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("skills").select("*").eq("user_id", user.id),
      supabase.from("education").select("*").eq("user_id", user.id).order("start_date", { ascending: false }),
      supabase.from("achievements").select("*").eq("user_id", user.id).order("date_achieved", { ascending: false })
    ]);

    if (profileRes.data) {
      setProfile({
        full_name: profileRes.data.full_name || "",
        bio: profileRes.data.bio || "",
        phone: profileRes.data.phone || "",
        location: profileRes.data.location || "",
        linkedin_url: profileRes.data.linkedin_url || "",
        github_url: profileRes.data.github_url || "",
        portfolio_url: profileRes.data.portfolio_url || ""
      });
    }
    if (skillsRes.data) setSkills(skillsRes.data);
    if (educationRes.data) setEducation(educationRes.data);
    if (achievementsRes.data) setAchievements(achievementsRes.data);
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile Updated", description: "Your profile has been saved." });
    }
    setSaving(false);
  };

  const addSkill = async () => {
    if (!newSkill.name.trim()) return;
    const { data, error } = await supabase
      .from("skills")
      .insert({ ...newSkill, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      setSkills([...skills, data]);
      setNewSkill({ name: "", proficiency_level: "intermediate", category: "" });
      toast({ title: "Skill Added" });
    }
  };

  const removeSkill = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (!error) {
      setSkills(skills.filter(s => s.id !== id));
      toast({ title: "Skill Removed" });
    }
  };

  const addEducation = async () => {
    if (!newEducation.institution.trim() || !newEducation.degree.trim()) return;
    const { data, error } = await supabase
      .from("education")
      .insert({ ...newEducation, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      setEducation([data, ...education]);
      setNewEducation({ institution: "", degree: "", field_of_study: "", start_date: "", end_date: "", grade: "" });
      toast({ title: "Education Added" });
    }
  };

  const removeEducation = async (id: string) => {
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (!error) {
      setEducation(education.filter(e => e.id !== id));
      toast({ title: "Education Removed" });
    }
  };

  const addAchievement = async () => {
    if (!newAchievement.event_name.trim() || !newAchievement.venue.trim() || !newAchievement.date_achieved) return;

    setUploadingAchievement(true);
    let certificateUrl: string | null = null;

    // Upload certificate file if provided
    if (achievementFile) {
      const fileExt = achievementFile.name.split(".").pop();
      const filePath = `${user.id}/achievements/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("certificates")
        .upload(filePath, achievementFile);

      if (uploadError) {
        toast({ title: "Upload Error", description: uploadError.message, variant: "destructive" });
        setUploadingAchievement(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("certificates").getPublicUrl(filePath);
      certificateUrl = urlData.publicUrl;
    }

    const insertData = {
      event_name: newAchievement.event_name,
      venue: newAchievement.venue,
      date_achieved: newAchievement.date_achieved,
      achievement_level: newAchievement.achievement_level,
      achievement_type: newAchievement.achievement_type,
      position: newAchievement.achievement_type === "winning" ? newAchievement.position || null : null,
      certificate_url: certificateUrl,
      title: newAchievement.event_name,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("achievements")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      setAchievements([data, ...achievements]);
      setNewAchievement({
        event_name: "", venue: "", date_achieved: "", achievement_level: "college",
        achievement_type: "participation", position: "", title: ""
      });
      setAchievementFile(null);
      toast({ title: "Achievement Added" });
    }
    setUploadingAchievement(false);
  };

  const removeAchievement = async (id: string) => {
    const ach = achievements.find(a => a.id === id);
    // Delete certificate file from storage if exists
    if (ach?.certificate_url) {
      const path = ach.certificate_url.split("/certificates/").pop();
      if (path) {
        await supabase.storage.from("certificates").remove([decodeURIComponent(path)]);
      }
    }
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (!error) {
      setAchievements(achievements.filter(a => a.id !== id));
      toast({ title: "Achievement Removed" });
    }
  };

  const getLevelBadgeColor = (level: string) => {
    const colors: Record<string, string> = {
      college: "bg-secondary text-secondary-foreground",
      zonal: "bg-accent/15 text-accent",
      state: "bg-accent/25 text-accent",
      national: "bg-accent/35 text-accent",
      international: "bg-accent/50 text-accent-foreground",
    };
    return colors[level] || "bg-secondary text-secondary-foreground";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">About Me</h1>
        <p className="text-muted-foreground">
          Build your professional profile with your information, skills, and achievements
        </p>
      </div>

      {/* Profile Section */}
      <section className="glass-card rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <User className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Personal Information</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="Your full name"
              className="input-focus"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+1 234 567 8900"
                className="pl-10 input-focus"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="City, Country"
                className="pl-10 input-focus"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>LinkedIn URL</Label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={profile.linkedin_url}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
                className="pl-10 input-focus"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>GitHub URL</Label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={profile.github_url}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                placeholder="https://github.com/yourusername"
                className="pl-10 input-focus"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Portfolio URL</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={profile.portfolio_url}
                onChange={(e) => setProfile({ ...profile, portfolio_url: e.target.value })}
                placeholder="https://yourportfolio.com"
                className="pl-10 input-focus"
              />
            </div>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Bio / Summary</Label>
            <Textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Write a brief professional summary about yourself..."
              className="min-h-[100px] sm:min-h-[120px] input-focus"
            />
          </div>
        </div>

        <Button onClick={saveProfile} disabled={saving} className="mt-6 w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Profile
        </Button>
      </section>

      {/* Skills Section */}
      <section className="glass-card rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Skills</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {skills.map((skill) => (
            <Badge
              key={skill.id}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-2"
            >
              {skill.name}
              <span className="text-xs text-muted-foreground">({skill.proficiency_level})</span>
              <button onClick={() => removeSkill(skill.id)} className="hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {skills.length === 0 && (
            <p className="text-muted-foreground text-sm">No skills added yet. Add your first skill below.</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Input
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="Skill name"
            className="input-focus"
          />
          <Select
            value={newSkill.proficiency_level}
            onValueChange={(value) => setNewSkill({ ...newSkill, proficiency_level: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            placeholder="Category"
            className="input-focus"
          />
          <Button onClick={addSkill} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </section>

      {/* Education Section */}
      <section className="glass-card rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Education</h2>
        </div>

        <div className="space-y-4 mb-6">
          {education.map((edu) => (
            <div key={edu.id} className="p-4 border border-border rounded-xl flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                <p className="text-muted-foreground">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">
                  {edu.field_of_study} {edu.grade && `• ${edu.grade}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {edu.start_date} - {edu.end_date || "Present"}
                </p>
              </div>
              <button onClick={() => removeEducation(edu.id)} className="text-muted-foreground hover:text-destructive">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {education.length === 0 && (
            <p className="text-muted-foreground text-sm">No education added yet.</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 border border-dashed border-border rounded-xl">
          <Input
            value={newEducation.institution}
            onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
            placeholder="Institution"
            className="input-focus"
          />
          <Input
            value={newEducation.degree}
            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
            placeholder="Degree"
            className="input-focus"
          />
          <Input
            value={newEducation.field_of_study}
            onChange={(e) => setNewEducation({ ...newEducation, field_of_study: e.target.value })}
            placeholder="Field of Study"
            className="input-focus"
          />
          <Input
            value={newEducation.grade}
            onChange={(e) => setNewEducation({ ...newEducation, grade: e.target.value })}
            placeholder="Grade/CGPA"
            className="input-focus"
          />
          <Input
            type="date"
            value={newEducation.start_date}
            onChange={(e) => setNewEducation({ ...newEducation, start_date: e.target.value })}
            className="input-focus"
          />
          <Input
            type="date"
            value={newEducation.end_date}
            onChange={(e) => setNewEducation({ ...newEducation, end_date: e.target.value })}
            className="input-focus"
          />
          <Button onClick={addEducation} variant="outline" className="sm:col-span-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="glass-card rounded-2xl p-4 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Achievements</h2>
        </div>

        {/* Achievement Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {achievements.map((ach) => (
            <div key={ach.id} className="p-5 border border-border rounded-xl bg-card/30 hover:border-accent/20 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {ach.achievement_type === "winning" ? (
                    <Medal className="w-5 h-5 text-accent" />
                  ) : (
                    <Award className="w-5 h-5 text-muted-foreground" />
                  )}
                  <h3 className="font-semibold text-foreground text-sm">{ach.event_name || ach.title}</h3>
                </div>
                <button onClick={() => removeAchievement(ach.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-2">{ach.venue}</p>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                {ach.achievement_level && (
                  <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium capitalize", getLevelBadgeColor(ach.achievement_level))}>
                    {ach.achievement_level === "state" ? "State (University)" : ach.achievement_level}
                  </span>
                )}
                {ach.achievement_type && (
                  <span className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-medium capitalize",
                    ach.achievement_type === "winning" ? "bg-accent/20 text-accent" : "bg-secondary text-secondary-foreground"
                  )}>
                    {ach.achievement_type}
                  </span>
                )}
                {ach.achievement_type === "winning" && ach.position && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-accent/30 text-accent">
                    {ach.position}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                {ach.date_achieved && (
                  <p className="text-xs text-muted-foreground">
                    {ach.date_achieved}
                  </p>
                )}
                {ach.certificate_url && (
                  <a
                    href={ach.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Certificate
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {achievements.length === 0 && (
          <p className="text-muted-foreground text-sm mb-6">No achievements added yet. Add your first achievement below.</p>
        )}

        {/* Add Achievement Form */}
        <div className="p-4 sm:p-5 border border-dashed border-border rounded-xl space-y-4">
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label>Event Name <span className="text-destructive">*</span></Label>
              <Input
                value={newAchievement.event_name}
                onChange={(e) => setNewAchievement({ ...newAchievement, event_name: e.target.value })}
                placeholder="e.g. National Hackathon 2024"
                className="input-focus"
              />
            </div>
            <div className="space-y-2">
              <Label>Venue / Organized By <span className="text-destructive">*</span></Label>
              <Input
                value={newAchievement.venue}
                onChange={(e) => setNewAchievement({ ...newAchievement, venue: e.target.value })}
                placeholder="e.g. IIT Bombay"
                className="input-focus"
              />
            </div>
            <div className="space-y-2">
              <Label>Date <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newAchievement.date_achieved && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newAchievement.date_achieved
                      ? format(new Date(newAchievement.date_achieved), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newAchievement.date_achieved ? new Date(newAchievement.date_achieved) : undefined}
                    onSelect={(date) =>
                      setNewAchievement({
                        ...newAchievement,
                        date_achieved: date ? format(date, "yyyy-MM-dd") : "",
                      })
                    }
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Achievement Level</Label>
              <Select
                value={newAchievement.achievement_level}
                onValueChange={(value) => setNewAchievement({ ...newAchievement, achievement_level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="zonal">Zonal</SelectItem>
                  <SelectItem value="state">State (University)</SelectItem>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Achievement Type</Label>
              <Select
                value={newAchievement.achievement_type}
                onValueChange={(value) => setNewAchievement({ ...newAchievement, achievement_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="participation">Participation</SelectItem>
                  <SelectItem value="winning">Winning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newAchievement.achievement_type === "winning" && (
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={newAchievement.position}
                  onChange={(e) => setNewAchievement({ ...newAchievement, position: e.target.value })}
                  placeholder="e.g. 1st Place, Runner Up"
                  className="input-focus"
                />
              </div>
            )}

            <div className={cn("space-y-2", newAchievement.achievement_type !== "winning" && "sm:col-span-2")}>
              <Label>Certificate (PDF, JPG, PNG)</Label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-border rounded-lg hover:border-accent/40 transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">
                      {achievementFile ? achievementFile.name : "Choose file..."}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size > 10 * 1024 * 1024) {
                        toast({ title: "File too large", description: "Max 10MB allowed", variant: "destructive" });
                        return;
                      }
                      setAchievementFile(file || null);
                    }}
                  />
                </label>
                {achievementFile && (
                  <button onClick={() => setAchievementFile(null)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={addAchievement}
            variant="outline"
            className="w-full"
            disabled={uploadingAchievement || !newAchievement.event_name.trim() || !newAchievement.venue.trim() || !newAchievement.date_achieved}
          >
            {uploadingAchievement ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {uploadingAchievement ? "Uploading..." : "Add Achievement"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutMe;
