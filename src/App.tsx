import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { MapboxProvider } from "@/contexts/MapboxContext";
import { FilterProvider } from "@/contexts/FilterContext";
import Index from "./pages/Index";
import AdminRoute from "./components/routing/AdminRoute";
import { supabase } from "@/integrations/supabase/client";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";

// Route-level code-splitting: lazy load everything except home (Index)
const Auth = lazy(() => import("./pages/Auth"));
const SubmitEvent = lazy(() => import("./pages/SubmitEvent"));
const SubmitBusiness = lazy(() => import("./pages/SubmitBusiness"));
const SubmitLocalService = lazy(() => import("./pages/SubmitLocalService"));
const SubmitNews = lazy(() => import("./pages/SubmitNews"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const BusinessDetails = lazy(() => import("./pages/BusinessDetails"));
const BusinessDashboard = lazy(() => import("./pages/BusinessDashboard"));
const NewsDetails = lazy(() => import("./pages/NewsDetails"));
const LocalServiceDetails = lazy(() => import("./pages/LocalServiceDetails"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const ContactAdmin = lazy(() => import("./pages/ContactAdmin"));
const MyMessages = lazy(() => import("./pages/MyMessages"));
const MySubmissions = lazy(() => import("./pages/MySubmissions"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const EditProfile = lazy(() => import("./pages/EditProfile").then(m => ({ default: m.EditProfile })));
const MapboxTest = lazy(() => import("./components/MapboxTest").then(m => ({ default: m.MapboxTest })));
const FAQ = lazy(() => import("./pages/FAQ").then(m => ({ default: m.FAQ })));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const About = lazy(() => import("./pages/About"));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background" role="status" aria-label="Loading page">
    <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
  </div>
);

const TRACKING_QUERY_KEYS = new Set([
  "fbclid",
  "gclid",
  "dclid",
  "msclkid",
  "mc_cid",
  "mc_eid",
  "igshid",
  "ref",
  "ref_src",
  "_hsenc",
  "_hsmi",
]);

const UrlTrackingParamCleaner = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    let changed = false;

    for (const key of Array.from(url.searchParams.keys())) {
      const lowered = key.toLowerCase();
      if (TRACKING_QUERY_KEYS.has(lowered) || lowered.startsWith("utm_")) {
        url.searchParams.delete(key);
        changed = true;
      }
    }

    if (!changed) return;
    const query = url.searchParams.toString();
    const cleanUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
    window.history.replaceState(window.history.state, "", cleanUrl);
  }, []);

  return null;
};

// Recovery redirect component to handle email link redirects (client-only; hash is not sent to server)
const RecoveryRedirect = () => {
  if (typeof window === 'undefined') {
    return <Index />;
  }
  const hasRecoveryTokens = window.location.hash.includes('type=recovery') ||
                           window.location.hash.includes('access_token');
  if (hasRecoveryTokens) {
    window.location.href = '/auth' + window.location.hash;
    return null;
  }
  return <Index />;
};

// Configure React Query with auth-aware settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
          console.error('🔒 Auth error detected, clearing cache and stopping retries');
          queryClient.clear();
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Listen for auth changes and clear query cache (client-only)
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      console.log(`🔄 Auth event: ${event}, clearing query cache`);
      queryClient.clear();
    }
  });
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MapboxProvider>
          <FilterProvider>
            <UrlTrackingParamCleaner />
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              <OnboardingTour />
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<RecoveryRedirect />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/submit-event" element={<SubmitEvent />} />
                  <Route path="/submit-business" element={<SubmitBusiness />} />
                  <Route path="/submit-local-resource" element={<SubmitLocalService />} />
                  <Route path="/submit-news" element={<SubmitNews />} />
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/event/:eventSlug" element={<EventDetails />} />
                  <Route path="/business/:businessId" element={<BusinessDetails />} />
                  <Route path="/business-dashboard" element={<BusinessDashboard />} />
                  <Route path="/news/:newsId" element={<NewsDetails />} />
                  <Route path="/news-page" element={<NewsPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/local-resource/:serviceId" element={<LocalServiceDetails />} />
                  <Route path="/contact-admin" element={<ContactAdmin />} />
                  <Route path="/my-messages" element={<MyMessages />} />
                  <Route path="/my-submissions" element={<MySubmissions />} />
                  <Route path="/user/:userId" element={<UserProfile />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/mapbox-test" element={<MapboxTest />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </FilterProvider>
        </MapboxProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
