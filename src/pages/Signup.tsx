import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import FloatingOrbs from "@/components/effects/FloatingOrbs";
import Tilt3DCard from "@/components/effects/Tilt3DCard";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Welcome to ProFolioX. Let's build your portfolio!",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Secure document storage",
    "AI-powered resume generation",
    "Professional project showcase",
    "Activity monitoring & security"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, filter: "blur(8px)" },
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-background noise-overlay">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 hero-cinematic items-center justify-center p-12 relative overflow-hidden">
        <FloatingOrbs variant="hero" />
        
        {/* Ethereal ambient effects */}
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[140px] pointer-events-none animate-bloom" />
        <div className="absolute bottom-[25%] right-[20%] w-[300px] h-[300px] bg-plasma/7 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="max-w-lg relative z-10"
        >
          <Tilt3DCard maxTilt={6} scale={1.02} className="inline-block mb-10">
            <div className="w-28 h-28 rounded-2xl lumina-border bg-background/60 backdrop-blur-xl flex items-center justify-center shadow-glow float-3d">
              <GraduationCap className="w-14 h-14 text-accent" />
            </div>
          </Tilt3DCard>
          <h2 className="text-3xl lg:text-4xl font-display font-semibold text-foreground mb-5 tracking-tight">
            Start Your Professional Journey
          </h2>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            Join thousands of students showcasing their achievements and landing opportunities.
          </p>
          <ul className="space-y-5">
            {benefits.map((benefit, index) => (
              <motion.li 
                key={index} 
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.12, duration: 0.6 }}
                className="flex items-center gap-4 text-foreground/85"
              >
                <div className="w-7 h-7 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                </div>
                <span className="text-base">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12 relative"
      >
        {/* Subtle ambient light */}
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-plasma/5 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md relative z-10"
        >
          <motion.div variants={itemVariants}>
            <Link to="/" className="flex items-center gap-2.5 mb-10 sm:mb-14 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent/90 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-glow">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-display font-semibold text-foreground tracking-wide">ProFolioX</span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-foreground mb-3 tracking-tight">Create your account</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Get started with your professional portfolio in minutes
            </p>
          </motion.div>

          <motion.form 
            variants={containerVariants}
            onSubmit={handleSignup} 
            className="space-y-5 sm:space-y-6"
          >
            <motion.div variants={itemVariants} className="space-y-2.5">
              <Label htmlFor="fullName" className="text-foreground font-medium text-sm sm:text-base">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-12 h-12 sm:h-14 input-focus text-base bg-secondary/40 border-white/10 focus:border-accent/40 rounded-xl"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2.5">
              <Label htmlFor="email" className="text-foreground font-medium text-sm sm:text-base">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 sm:h-14 input-focus text-base bg-secondary/40 border-white/10 focus:border-accent/40 rounded-xl"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2.5">
              <Label htmlFor="password" className="text-foreground font-medium text-sm sm:text-base">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 sm:h-14 input-focus text-base bg-secondary/40 border-white/10 focus:border-accent/40 rounded-xl"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground font-mono pl-1">
                Must be at least 6 characters
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full h-12 sm:h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base min-h-[48px] btn-glow btn-3d-lift shadow-glow rounded-xl transition-all duration-500 hover:shadow-bloom"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>

          <motion.p 
            variants={itemVariants}
            className="mt-8 sm:mt-10 text-center text-sm sm:text-base text-muted-foreground"
          >
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-medium hover:underline transition-colors">
              Log in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
