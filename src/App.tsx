import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Recommendations from "./pages/Recommendations.tsx";
import AdminLogin from "./pages/admin/Login.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import AdminIdentity from "./pages/admin/Identity.tsx";
import AdminAvailability from "./pages/admin/Availability.tsx";
import AdminExperience from "./pages/admin/Experience.tsx";
import AdminProjects from "./pages/admin/Projects.tsx";
import AdminSkills from "./pages/admin/Skills.tsx";
import AdminEducation from "./pages/admin/Education.tsx";
import AdminCertifications from "./pages/admin/Certifications.tsx";
import AdminLanguages from "./pages/admin/Languages.tsx";
import AdminHero from "./pages/admin/Hero.tsx";
import AdminUsers from "./pages/admin/Users.tsx";
import AdminResume from "./pages/admin/Resume.tsx";
import AdminRecommendations from "./pages/admin/Recommendations.tsx";
import { RequireAdmin } from "./components/admin/RequireAdmin.tsx";

const queryClient = new QueryClient();

const Guarded = ({ children }: { children: React.ReactNode }) => <RequireAdmin>{children}</RequireAdmin>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/goth/login" element={<AdminLogin />} />
          <Route path="/goth" element={<Guarded><AdminDashboard /></Guarded>} />
          <Route path="/goth/identity" element={<Guarded><AdminIdentity /></Guarded>} />
          <Route path="/goth/availability" element={<Guarded><AdminAvailability /></Guarded>} />
          <Route path="/goth/experience" element={<Guarded><AdminExperience /></Guarded>} />
          <Route path="/goth/projects" element={<Guarded><AdminProjects /></Guarded>} />
          <Route path="/goth/skills" element={<Guarded><AdminSkills /></Guarded>} />
          <Route path="/goth/education" element={<Guarded><AdminEducation /></Guarded>} />
          <Route path="/goth/certifications" element={<Guarded><AdminCertifications /></Guarded>} />
          <Route path="/goth/languages" element={<Guarded><AdminLanguages /></Guarded>} />
          <Route path="/goth/hero" element={<Guarded><AdminHero /></Guarded>} />
          <Route path="/goth/users" element={<Guarded><AdminUsers /></Guarded>} />
          <Route path="/goth/resume" element={<Guarded><AdminResume /></Guarded>} />
          <Route path="/goth/recommendations" element={<Guarded><AdminRecommendations /></Guarded>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
