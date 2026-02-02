import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useTheme } from './store';
import { useAuth } from './components/AuthContext';
import { tokenStore } from './services/api';

// Layout
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages (keep existing)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';

// Onboarding Pages
import { 
  WelcomePage, 
  WebsiteTypePage, 
  TrackingSetupPage, 
  VerificationPage 
} from './pages/onboarding';

// Dashboard Pages
import Overview from './pages/dashboard/Overview';
import RealTime from './pages/dashboard/RealTime';
import Traffic from './pages/dashboard/Traffic';
import Settings from './pages/dashboard/Settings';
import Pages from './pages/dashboard/Pages';
import Devices from './pages/dashboard/Devices';
import Geography from './pages/dashboard/Geography';
import Sources from './pages/dashboard/Sources';
import Interactions from './pages/dashboard/Interactions';
import Forms from './pages/dashboard/Forms';
import Ecommerce from './pages/dashboard/Ecommerce';
import Content from './pages/dashboard/Content';
import SaaS from './pages/dashboard/SaaS';
import Videos from './pages/dashboard/Videos';
import Reports from './pages/dashboard/Reports';
import Heatmaps from './pages/dashboard/Heatmaps';
import Funnels from './pages/dashboard/Funnels';
import Products from './pages/dashboard/Products';
import PurchaseFunnel from './pages/dashboard/PurchaseFunnel';
import Customers from './pages/dashboard/Customers';
import Engagement from './pages/dashboard/Engagement';
import IntegrationSetup from './pages/dashboard/IntegrationSetup';
import IntegrationGuide from './pages/dashboard/IntegrationGuide';

// Protected Route Component with Onboarding Check
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  requireOnboarding?: boolean;
}> = ({ children, requireOnboarding = true }) => {
  const { me, loading } = useAuth();
  const token = tokenStore.get();
  const location = useLocation();
  
  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Check authentication
  if (!me && !token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check onboarding status for dashboard routes
  const isOnboardingRoute = location.pathname.startsWith('/onboarding');
  const isOnboarded = me?.is_onboarded ?? false;
  
  // If user is not onboarded and trying to access dashboard, redirect to onboarding
  if (requireOnboarding && !isOnboarded && !isOnboardingRoute) {
    return <Navigate to="/onboarding/welcome" replace />;
  }
  
  // If user is onboarded and trying to access onboarding, redirect to dashboard
  if (isOnboarded && isOnboardingRoute) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Onboarding Route - doesn't require onboarding completion
const OnboardingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ProtectedRoute requireOnboarding={false}>{children}</ProtectedRoute>;
};

// Theme Provider
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { applyTheme } = useTheme();

  useEffect(() => {
    // Apply theme on mount
    const prefs = JSON.parse(localStorage.getItem('preferences-storage') || '{}');
    const theme = prefs?.state?.preferences?.theme || 'system';
    applyTheme(theme);
  }, []);

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route path="/reset-password/:token" element={<Reset />} />

          {/* Onboarding Routes */}
          <Route
            path="/onboarding/welcome"
            element={
              <OnboardingRoute>
                <WelcomePage />
              </OnboardingRoute>
            }
          />
          <Route
            path="/onboarding/website-type"
            element={
              <OnboardingRoute>
                <WebsiteTypePage />
              </OnboardingRoute>
            }
          />
          <Route
            path="/onboarding/tracking"
            element={
              <OnboardingRoute>
                <TrackingSetupPage />
              </OnboardingRoute>
            }
          />
          <Route
            path="/onboarding/verify"
            element={
              <OnboardingRoute>
                <VerificationPage />
              </OnboardingRoute>
            }
          />
          {/* Legacy route redirect */}
          <Route
            path="/onboarding/integration"
            element={<Navigate to="/onboarding/tracking" replace />}
          />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="realtime" element={<RealTime />} />
            <Route path="traffic" element={<Traffic />} />
            <Route path="pages" element={<Pages />} />
            
            {/* Audience */}
            <Route path="audience/devices" element={<Devices />} />
            <Route path="audience/geography" element={<Geography />} />
            <Route path="audience/sources" element={<Sources />} />
            
            {/* Behavior */}
            <Route path="behavior/interactions" element={<Interactions />} />
            <Route path="behavior/heatmaps" element={<Heatmaps />} />
            <Route path="behavior/funnels" element={<Funnels />} />
            
            {/* Forms */}
            <Route path="forms" element={<Forms />} />
            
            {/* E-commerce */}
            <Route path="ecommerce" element={<Ecommerce />} />
            <Route path="ecommerce/products" element={<Products />} />
            <Route path="ecommerce/funnel" element={<PurchaseFunnel />} />
            <Route path="ecommerce/customers" element={<Customers />} />
            
            {/* Content (Blog) */}
            <Route path="content" element={<Content />} />
            <Route path="content/articles" element={<Content />} />
            <Route path="content/engagement" element={<Engagement />} />
            
            {/* SaaS */}
            <Route path="saas" element={<SaaS />} />
            <Route path="saas/signups" element={<SaaS />} />
            <Route path="saas/retention" element={<SaaS />} />
            <Route path="saas/features" element={<SaaS />} />
            
            {/* Videos */}
            <Route path="videos" element={<Videos />} />
            
            {/* Reports */}
            <Route path="reports" element={<Reports />} />
            
            {/* Settings */}
            <Route path="settings" element={<Settings />} />
            <Route path="settings/profile" element={<Settings />} />
            <Route path="settings/dashboard" element={<Settings />} />
            <Route path="settings/tracking" element={<Settings />} />
            <Route path="settings/team" element={<Settings />} />
            
            {/* Integration */}
            <Route path="integration" element={<IntegrationGuide />} />
            <Route path="integration/setup" element={<IntegrationSetup />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
