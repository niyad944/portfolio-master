import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Shield, 
  FileText, 
  Sparkles, 
  FolderLock, 
  GraduationCap,
  ArrowRight,
  User,
  Briefcase
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: FolderLock,
      title: "Secure Document Locker",
      description: "Store and protect your academic certificates, degrees, and credentials with enterprise-grade security."
    },
    {
      icon: Sparkles,
      title: "AI Resume Generator",
      description: "Generate professional resumes instantly using AI-powered templates from your stored data."
    },
    {
      icon: Shield,
      title: "Security Monitoring",
      description: "AI-powered suspicious activity detection keeps your sensitive information protected."
    },
    {
      icon: Briefcase,
      title: "Project Showcase",
      description: "Display your academic projects and achievements in an elegant, professional portfolio."
    },
    {
      icon: User,
      title: "Personal Branding",
      description: "Create a compelling 'About Me' section that highlights your skills and accomplishments."
    },
    {
      icon: FileText,
      title: "Smart Organization",
      description: "Categorize and manage all your documents with intelligent tagging and search."
    }
  ];

  const stats = [
    { value: "100%", label: "Secure Storage" },
    { value: "AI", label: "Powered Resumes" },
    { value: "24/7", label: "Access Anywhere" },
    { value: "Free", label: "To Get Started" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden noise-overlay">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.05]"
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-display font-semibold text-foreground">ProFolioX</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/login">
                <Button variant="ghost" className="font-medium text-sm sm:text-base px-3 sm:px-4 h-9 sm:h-10 text-foreground/80 hover:text-foreground hover:bg-white/[0.05]">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-sm sm:text-base px-3 sm:px-4 h-9 sm:h-10 btn-glow">
                  <span className="hidden sm:inline">Sign Up Free</span>
                  <span className="sm:hidden">Sign Up</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-cinematic overflow-hidden pt-16 sm:pt-20 px-4">
        {/* Ambient light effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-0 sm:px-6 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full glass border border-accent/20 mb-6 sm:mb-8"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-foreground/80 font-mono">AI-Powered Portfolio Platform</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-5xl lg:text-7xl font-display font-semibold text-foreground mb-4 sm:mb-6 leading-tight"
            >
              Your Academic Journey,
              <span className="block gold-text">Professionally Showcased</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-2 leading-relaxed"
            >
              Store certificates securely, showcase your achievements, and generate stunning resumes with AI. 
              The complete portfolio platform for ambitious students.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 btn-glow min-h-[48px] shadow-glow">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/10 text-foreground hover:bg-white/[0.05] hover:border-white/20 font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 min-h-[48px]">
                  Log In
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="mt-12 sm:mt-16 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-6 sm:gap-12"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-display font-semibold gold-text">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-mono uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-background relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-3 sm:mb-4">
              Everything You Need to
              <span className="text-gradient-primary"> Stand Out</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              A complete platform designed specifically for students to manage, showcase, and leverage their academic achievements.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="feature-card group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 sm:mb-6 transition-all duration-500 group-hover:bg-accent/20 group-hover:border-accent/40 group-hover:shadow-glow">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
                </div>
                <h3 className="text-lg sm:text-xl font-display font-semibold text-foreground mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-secondary/20 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-3 sm:mb-4">
              Simple Steps to Success
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground">
              Get your professional portfolio up and running in minutes
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid sm:grid-cols-3 gap-8 sm:gap-12"
            >
              {[
                { step: "01", title: "Create Account", desc: "Sign up securely with email verification" },
                { step: "02", title: "Add Your Data", desc: "Upload certificates, skills, and projects" },
                { step: "03", title: "Generate & Share", desc: "Create AI-powered resumes instantly" }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full gold-border bg-background flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <span className="text-xl sm:text-2xl font-mono font-semibold gold-text">{item.step}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 hero-cinematic relative overflow-hidden">
        {/* Ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto px-4 sm:px-6 text-center relative z-10"
        >
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-4 sm:mb-6">
            Ready to Showcase Your Potential?
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already building their professional future with ProFolioX.
          </p>
          <Link to="/signup" className="inline-block">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-6 min-h-[48px] btn-glow shadow-glow-gold animate-glow-pulse">
              Start Building Your Portfolio
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t border-white/[0.05] py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-display font-semibold text-foreground">ProFolioX</span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm text-center font-mono">
              © 2024 ProFolioX. Empowering students to showcase their potential.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
