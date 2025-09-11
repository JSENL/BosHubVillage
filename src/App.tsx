
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { MapboxProvider } from "@/contexts/MapboxContext";
import { FilterProvider } from "@/contexts/FilterContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SubmitEvent from "./pages/SubmitEvent";
import SubmitBusiness from "./pages/SubmitBusiness";
import SubmitLocalService from "./pages/SubmitLocalService";
import SubmitNews from "./pages/SubmitNews";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/routing/AdminRoute";
import EventDetails from "./pages/EventDetails";
import BusinessDetails from "./pages/BusinessDetails";
import BusinessDashboard from "./pages/BusinessDashboard";
import NewsDetails from "./pages/NewsDetails";
import LocalServiceDetails from "./pages/LocalServiceDetails";
import NewsPage from "./pages/NewsPage";
import ContactAdmin from "./pages/ContactAdmin";
import MyMessages from "./pages/MyMessages";
import MySubmissions from "./pages/MySubmissions";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import { EditProfile } from "./pages/EditProfile";
import { MapboxTest } from "./components/MapboxTest";
import { FAQ } from "./pages/FAQ";

// Recovery redirect component to handle email link redirects
const RecoveryRedirect = () => {
  const hasRecoveryTokens = window.location.hash.includes('type=recovery') || 
                           window.location.hash.includes('access_token');
  
  if (hasRecoveryTokens) {
    // Redirect to auth page preserving the hash
    window.location.href = '/auth' + window.location.hash;
    return null;
  }
  
  return <Index />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MapboxProvider>
          <FilterProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
          <Routes>
            <Route path="/" element={<RecoveryRedirect />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/submit-event" element={<SubmitEvent />} />
            <Route path="/submit-business" element={<SubmitBusiness />} />
            <Route path="/submit-local-resource" element={<SubmitLocalService />} />
            <Route path="/submit-news" element={<SubmitNews />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            
            
            <Route path="/event/:eventId" element={<EventDetails />} />
            <Route path="/business/:businessId" element={<BusinessDetails />} />
            <Route path="/business-dashboard" element={<BusinessDashboard />} />
            <Route path="/news/:newsId" element={<NewsDetails />} />
            <Route path="/news-page" element={<NewsPage />} />
            <Route path="/local-resource/:serviceId" element={<LocalServiceDetails />} />
        <Route path="/contact-admin" element={<ContactAdmin />} />
        <Route path="/my-messages" element={<MyMessages />} />
        <Route path="/my-submissions" element={<MySubmissions />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/mapbox-test" element={<MapboxTest />} />
        <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
          </FilterProvider>
        </MapboxProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
