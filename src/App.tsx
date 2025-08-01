
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

import ContactAdmin from "./pages/ContactAdmin";
import MyMessages from "./pages/MyMessages";
import MySubmissions from "./pages/MySubmissions";
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
            <Route path="/submit-local-resource" element={<SubmitLocalService />} />
            <Route path="/submit-news" element={<SubmitNews />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/approval" element={<AdminApproval />} />
            <Route path="/event/:eventId" element={<EventDetails />} />
            <Route path="/business/:businessId" element={<BusinessDetails />} />
            <Route path="/news/:newsId" element={<NewsDetails />} />
            <Route path="/news-page" element={<NewsPage />} />
            <Route path="/local-resource/:serviceId" element={<LocalServiceDetails />} />
        <Route path="/contact-admin" element={<ContactAdmin />} />
        <Route path="/my-messages" element={<MyMessages />} />
        <Route path="/my-submissions" element={<MySubmissions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
