import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
    { icon: FolderLock, label: "Certificates", value: stats.certificates, link: "/dashboard/certificates" },
    { icon: Briefcase, label: "Projects", value: stats.projects, link: "/dashboard/projects" },
    { icon: Sparkles, label: "Skills", value: stats.skills, link: "/dashboard/about" },
    { icon: Award, label: "Achievements", value: stats.achievements, link: "/dashboard/about" }
  ];

  const quickActions = [
    { icon: User, label: "Complete Your Profile", desc: "Add your bio, skills, and education", link: "/dashboard/about" },
    { icon: FolderLock, label: "Upload Certificates", desc: "Store your academic documents securely", link: "/dashboard/certificates" },
    { icon: Briefcase, label: "Add Projects", desc: "Showcase your work and achievements", link: "/dashboard/projects" },
    { icon: FileText, label: "Generate Resume", desc: "Create an AI-powered professional resume", link: "/dashboard/resume" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 sm:mb-12"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-foreground mb-3 tracking-tight">
          Welcome back, <span className="lumina-text">{user?.user_metadata?.full_name?.split(" ")[0] || "there"}</span>! 👋
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Here's an overview of your professional portfolio
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-14"
      >
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Link
              to={stat.link}
              className="stats-card group cursor-pointer block"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 sm:mb-5 transition-all duration-700 group-hover:bg-accent/15 group-hover:border-accent/35 group-hover:shadow-glow">
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
              </div>
              <p className="text-3xl sm:text-4xl font-display font-semibold text-foreground mb-1.5">{stat.value}</p>
              <p className="text-sm text-muted-foreground font-mono tracking-wide">{stat.label}</p>
              <ArrowRight className="absolute top-5 right-5 sm:top-6 sm:right-6 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="mb-10 sm:mb-14"
      >
        <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-5 sm:mb-7 tracking-tight">Quick Actions</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 gap-4 sm:gap-5"
        >
          {quickActions.map((action, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link
                to={action.link}
                className="glass-card-hover rounded-2xl p-5 sm:p-7 flex items-start gap-4 sm:gap-5 group block"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 transition-all duration-700 group-hover:bg-accent/15 group-hover:border-accent/35 group-hover:shadow-glow">
                  <action.icon className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground mb-1.5 text-base sm:text-lg group-hover:text-accent transition-colors duration-400 tracking-tight">
                    {action.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{action.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-500 mt-1 shrink-0 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Getting Started Guide */}
      {stats.certificates === 0 && stats.projects === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="glass-card rounded-2xl p-6 sm:p-10 gradient-border-animated"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-7">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center shrink-0 shadow-glow">
              <Sparkles className="w-9 h-9 sm:w-10 sm:h-10 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-3 tracking-tight">
                Get Started with Your Portfolio
              </h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Your portfolio is ready to be built! Start by completing your profile, uploading your certificates, and adding your projects.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard/about">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground btn-glow shadow-glow rounded-xl min-h-[48px] px-6 transition-all duration-500 hover:shadow-bloom">
                    Complete Profile
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/dashboard/certificates">
                  <Button variant="outline" className="border-white/10 hover:bg-white/[0.05] rounded-xl min-h-[48px] px-6 transition-all duration-400">Upload Certificate</Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Overview;