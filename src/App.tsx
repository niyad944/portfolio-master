import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/dashboard/Overview";
import AboutMe from "./pages/dashboard/AboutMe";
import Certificates from "./pages/dashboard/Certificates";
import Projects from "./pages/dashboard/Projects";
import ResumeGenerator from "./pages/dashboard/ResumeGenerator";
import ResumeAnalyzer from "./pages/dashboard/ResumeAnalyzer";
import SkillInsights from "./pages/dashboard/SkillInsights";
import ActivityLog from "./pages/dashboard/ActivityLog";
import PublicPortfolio from "./pages/PublicPortfolio";
import PublicDocumentView from "./pages/PublicDocumentView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Overview />} />
            <Route path="about" element={<AboutMe />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="projects" element={<Projects />} />
            <Route path="resume" element={<ResumeGenerator />} />
            <Route path="analyzer" element={<ResumeAnalyzer />} />
            <Route path="insights" element={<SkillInsights />} />
            <Route path="activity" element={<ActivityLog />} />
          </Route>
          <Route path="/p/:slug" element={<PublicPortfolio />} />
          <Route path="/p/:slug/document/:docId" element={<PublicDocumentView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
