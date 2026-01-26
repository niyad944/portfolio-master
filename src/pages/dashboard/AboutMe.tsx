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
  Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  title: string;
  description: string;
  date_achieved: string;
  issuer: string;
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
  const [newAchievement, setNewAchievement] = useState<Omit<Achievement, "id">>({
    title: "", description: "", date_achieved: "", issuer: ""
  });

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
    if (!newAchievement.title.trim()) return;
    const { data, error } = await supabase
      .from("achievements")
      .insert({ ...newAchievement, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      setAchievements([data, ...achievements]);
      setNewAchievement({ title: "", description: "", date_achieved: "", issuer: "" });
      toast({ title: "Achievement Added" });
    }
  };

  const removeAchievement = async (id: string) => {
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (!error) {
      setAchievements(achievements.filter(a => a.id !== id));
      toast({ title: "Achievement Removed" });
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
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">About Me</h1>
        <p className="text-muted-foreground">
          Build your professional profile with your information, skills, and achievements
        </p>
      </div>

      {/* Profile Section */}
      <section className="glass-card rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <User className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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
          <div className="md:col-span-2 space-y-2">
            <Label>Bio / Summary</Label>
            <Textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Write a brief professional summary about yourself..."
              className="min-h-[120px] input-focus"
            />
          </div>
        </div>

        <Button onClick={saveProfile} disabled={saving} className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Profile
        </Button>
      </section>

      {/* Skills Section */}
      <section className="glass-card rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Skills</h2>
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

        <div className="flex flex-wrap gap-4">
          <Input
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="Skill name (e.g., Python)"
            className="flex-1 min-w-[200px] input-focus"
          />
          <Select
            value={newSkill.proficiency_level}
            onValueChange={(value) => setNewSkill({ ...newSkill, proficiency_level: value })}
          >
            <SelectTrigger className="w-[160px]">
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
            placeholder="Category (optional)"
            className="w-[180px] input-focus"
          />
          <Button onClick={addSkill} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </section>

      {/* Education Section */}
      <section className="glass-card rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Education</h2>
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

        <div className="grid md:grid-cols-2 gap-4 p-4 border border-dashed border-border rounded-xl">
          <Input
            value={newEducation.institution}
            onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
            placeholder="Institution"
            className="input-focus"
          />
          <Input
            value={newEducation.degree}
            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
            placeholder="Degree (e.g., B.Tech)"
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
          <Button onClick={addEducation} variant="outline" className="md:col-span-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Achievements</h2>
        </div>

        <div className="space-y-4 mb-6">
          {achievements.map((ach) => (
            <div key={ach.id} className="p-4 border border-border rounded-xl flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground">{ach.title}</h3>
                {ach.issuer && <p className="text-muted-foreground">{ach.issuer}</p>}
                {ach.description && <p className="text-sm text-muted-foreground mt-1">{ach.description}</p>}
                {ach.date_achieved && <p className="text-xs text-muted-foreground mt-1">{ach.date_achieved}</p>}
              </div>
              <button onClick={() => removeAchievement(ach.id)} className="text-muted-foreground hover:text-destructive">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {achievements.length === 0 && (
            <p className="text-muted-foreground text-sm">No achievements added yet.</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 p-4 border border-dashed border-border rounded-xl">
          <Input
            value={newAchievement.title}
            onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
            placeholder="Achievement title"
            className="input-focus"
          />
          <Input
            value={newAchievement.issuer}
            onChange={(e) => setNewAchievement({ ...newAchievement, issuer: e.target.value })}
            placeholder="Issuing organization"
            className="input-focus"
          />
          <Input
            type="date"
            value={newAchievement.date_achieved}
            onChange={(e) => setNewAchievement({ ...newAchievement, date_achieved: e.target.value })}
            className="input-focus"
          />
          <Textarea
            value={newAchievement.description}
            onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
            placeholder="Description (optional)"
            className="md:col-span-2 input-focus"
          />
          <Button onClick={addAchievement} variant="outline" className="md:col-span-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutMe;
