import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  User,
  FolderLock,
  Briefcase,
  FileText,
  ArrowRight,
  Award,
  Sparkles
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface DashboardContext {
  user: SupabaseUser;
}

const Overview = () => {
  const { user } = useOutletContext<DashboardContext>();
  const [stats, setStats] = useState({
    certificates: 0,
    projects: 0,
    skills: 0,
    achievements: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [certificates, projects, skills, achievements] = await Promise.all([
        supabase.from("certificates").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("projects").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("skills").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("achievements").select("id", { count: "exact" }).eq("user_id", user.id)
      ]);

      setStats({
        certificates: certificates.count || 0,
        projects: projects.count || 0,
        skills: skills.count || 0,
        achievements: achievements.count || 0
      });
    };

    fetchStats();
  }, [user.id]);

  const statCards = [
    { icon: FolderLock, label: "Certificates", value: stats.certificates, color: "from-blue-500 to-blue-600", link: "/dashboard/certificates" },
    { icon: Briefcase, label: "Projects", value: stats.projects, color: "from-purple-500 to-purple-600", link: "/dashboard/projects" },
    { icon: Sparkles, label: "Skills", value: stats.skills, color: "from-accent to-accent/80", link: "/dashboard/about" },
    { icon: Award, label: "Achievements", value: stats.achievements, color: "from-orange-500 to-orange-600", link: "/dashboard/about" }
  ];

  const quickActions = [
    { icon: User, label: "Complete Your Profile", desc: "Add your bio, skills, and education", link: "/dashboard/about" },
    { icon: FolderLock, label: "Upload Certificates", desc: "Store your academic documents securely", link: "/dashboard/certificates" },
    { icon: Briefcase, label: "Add Projects", desc: "Showcase your work and achievements", link: "/dashboard/projects" },
    { icon: FileText, label: "Generate Resume", desc: "Create an AI-powered professional resume", link: "/dashboard/resume" }
  ];

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "there"}! 👋
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Here's an overview of your professional portfolio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="stats-card group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 sm:mb-4`}>
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <ArrowRight className="absolute top-4 right-4 sm:top-6 sm:right-6 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="glass-card rounded-xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 group hover:border-accent/50 transition-all duration-300"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base group-hover:text-accent transition-colors">
                  {action.label}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started Guide */}
      {stats.certificates === 0 && stats.projects === 0 && (
        <div className="glass-card rounded-2xl p-8 gradient-border">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Get Started with Your Portfolio
              </h3>
              <p className="text-muted-foreground mb-4">
                Your portfolio is ready to be built! Start by completing your profile, uploading your certificates, and adding your projects.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/dashboard/about">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Complete Profile
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/dashboard/certificates">
                  <Button variant="outline">Upload Certificate</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
