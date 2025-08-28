import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { MapboxProvider } from '@/contexts/MapboxContext'
import Index from '@/pages/Index'
import EventDetails from '@/pages/EventDetails'
import BusinessDetails from '@/pages/BusinessDetails'
import LocalServiceDetails from '@/pages/LocalServiceDetails'
import NewsDetails from '@/pages/NewsDetails'
import NewsPage from '@/pages/NewsPage'
import Auth from '@/pages/Auth'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminApproval from '@/pages/AdminApproval'
import SubmitEvent from '@/pages/SubmitEvent'
import SubmitBusiness from '@/pages/SubmitBusiness'
import SubmitLocalService from '@/pages/SubmitLocalService'
import SubmitNews from '@/pages/SubmitNews'
import MySubmissions from '@/pages/MySubmissions'
import BusinessDashboard from '@/pages/BusinessDashboard'
import ContactAdmin from '@/pages/ContactAdmin'
import MyMessages from '@/pages/MyMessages'
import NotFound from '@/pages/NotFound'
import RefactoredIndex from '@/pages/RefactoredIndex'
import UnifiedIndex from '@/pages/UnifiedIndex'
import MapboxTestPage from '@/pages/MapboxTestPage'
import AdminRoute from '@/components/routing/AdminRoute'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <UnifiedIndex />,
  },
  {
    path: "/mapbox-test",
    element: <MapboxTestPage />,
  },
  {
    path: "/event/:id",
    element: <EventDetails />,
  },
  {
    path: "/business/:id", 
    element: <BusinessDetails />,
  },
  {
    path: "/local-resource/:id",
    element: <LocalServiceDetails />,
  },
  {
    path: "/news/:id",
    element: <NewsDetails />,
  },
  {
    path: "/news",
    element: <NewsPage />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/approval",
    element: (
      <AdminRoute>
        <AdminApproval />
      </AdminRoute>
    ),
  },
  {
    path: "/submit-event",
    element: <SubmitEvent />,
  },
  {
    path: "/submit-business",
    element: <SubmitBusiness />,
  },
  {
    path: "/submit-local-service",
    element: <SubmitLocalService />,
  },
  {
    path: "/submit-news",
    element: <SubmitNews />,
  },
  {
    path: "/my-submissions",
    element: <MySubmissions />,
  },
  {
    path: "/business-dashboard",
    element: <BusinessDashboard />,
  },
  {
    path: "/contact-admin",
    element: <ContactAdmin />,
  },
  {
    path: "/my-messages",
    element: <MyMessages />,
  },
  {
    path: "/refactored",
    element: <RefactoredIndex />,
  },
  {
    path: "/index", 
    element: <Index />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MapboxProvider>
        <RouterProvider router={router} />
        <Toaster />
      </MapboxProvider>
    </QueryClientProvider>
  )
}

export default App
