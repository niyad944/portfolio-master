import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { logActivity } from "@/hooks/useActivityLogger";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        // Log successful login
        await logActivity(data.user.id, "login");
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
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
      {/* Left Side - Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12 relative"
      >
        {/* Subtle ambient light */}
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        
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
            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-foreground mb-3 tracking-tight">Welcome back</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enter your credentials to access your portfolio
            </p>
          </motion.div>

          <motion.form 
            variants={containerVariants}
            onSubmit={handleLogin} 
            className="space-y-6 sm:space-y-7"
          >
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 sm:h-14 input-focus text-base bg-secondary/40 border-white/10 focus:border-accent/40 rounded-xl"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full h-12 sm:h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base min-h-[48px] btn-glow shadow-glow rounded-xl transition-all duration-500 hover:shadow-bloom"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Log In
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
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent font-medium hover:underline transition-colors">
              Sign up for free
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 hero-cinematic items-center justify-center p-12 relative overflow-hidden">
        {/* Ethereal ambient effects */}
        <div className="absolute top-[20%] right-[25%] w-[350px] h-[350px] bg-accent/10 rounded-full blur-[130px] pointer-events-none animate-bloom" />
        <div className="absolute bottom-[25%] left-[20%] w-[280px] h-[280px] bg-plasma/8 rounded-full blur-[110px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="max-w-lg text-center relative z-10"
        >
          <div className="w-28 h-28 rounded-2xl lumina-border bg-background/60 backdrop-blur-xl flex items-center justify-center mx-auto mb-10 shadow-glow">
            <GraduationCap className="w-14 h-14 text-accent" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-semibold text-foreground mb-5 tracking-tight">
            Your Professional Portfolio Awaits
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Access your secure document locker, manage your projects, and generate AI-powered resumes.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;