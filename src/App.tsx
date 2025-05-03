
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LearningPath from "./pages/LearningPath";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import LearningInfo from "./pages/LearningInfo";
import Index from "./pages/Index";
import Lessons from "./pages/Lessons";
import CourseLesson from "./pages/CourseLesson";
import ConversationAI from "./pages/ConversationAI";
import LessonRoadmap from "./pages/LessonRoadmap";

const queryClient = new QueryClient();

const App = () => {
  // Check if user has already gone through onboarding
  const hasOnboarded = localStorage.getItem('learningLanguage') !== null;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={hasOnboarded ? <LearningPath /> : <Navigate to="/welcome" />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/learning-info" element={<LearningInfo />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lesson" element={<CourseLesson />} />
            <Route path="/flashcards" element={<Index />} />
            <Route path="/conversation-ai" element={<ConversationAI />} />
            <Route path="/lesson-roadmap" element={<LessonRoadmap />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
