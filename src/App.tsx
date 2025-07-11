
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SubmitEvent from "./pages/SubmitEvent";
import SubmitBusiness from "./pages/SubmitBusiness";
import SubmitLocalService from "./pages/SubmitLocalService";
import SubmitNews from "./pages/SubmitNews";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApproval from "./pages/AdminApproval";
import EventDetails from "./pages/EventDetails";
import BusinessDetails from "./pages/BusinessDetails";
import NewsDetails from "./pages/NewsDetails";
import LocalServiceDetails from "./pages/LocalServiceDetails";
import NewsPage from "./pages/NewsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/submit-event" element={<SubmitEvent />} />
            <Route path="/submit-business" element={<SubmitBusiness />} />
            <Route path="/submit-local-service" element={<SubmitLocalService />} />
            <Route path="/submit-news" element={<SubmitNews />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/approval" element={<AdminApproval />} />
            <Route path="/business/:businessId" element={<BusinessDetails />} />
            <Route path="/news/:newsId" element={<NewsDetails />} />
            <Route path="/news-page" element={<NewsPage />} />
            <Route path="/local-service/:serviceId" element={<LocalServiceDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
