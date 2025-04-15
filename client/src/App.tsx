import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { EmergencyProvider } from "@/hooks/use-emergency";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import ServicesPage from "@/pages/services-page";
import SettingsPage from "@/pages/settings-page";
import AdminPage from "@/pages/admin-page";
import ResponseTeamPage from "@/pages/response-team-page";
import HelpCenterPage from "@/pages/help-center-page";
import ContactSupportPage from "@/pages/contact-support-page";
import PrivacyPolicyPage from "@/pages/privacy-policy-page";
import TermsOfServicePage from "@/pages/terms-of-service-page";
import AccountSettingsPage from "@/pages/account-settings-page";
import { LiveChat } from "@/components/chat/live-chat";
import { ProtectedRoute } from "@/lib/protected-route";
import { UserRole } from "@shared/schema";
import { useEffect } from "react";
import { connectWebSocket } from "@/lib/websocket";

function App() {
  useEffect(() => {
    connectWebSocket();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EmergencyProvider>
          <Switch>
            <Route path="/home">
              <ProtectedRoute path="/home" component={HomePage} />
            </Route>
            <ProtectedRoute path="/" component={HomePage} />
            <ProtectedRoute path="/dashboard" component={DashboardPage} />
            <ProtectedRoute path="/services" component={ServicesPage} />
            <ProtectedRoute path="/settings" component={SettingsPage} />
            <ProtectedRoute path="/account-settings" component={AccountSettingsPage} />
            <ProtectedRoute path="/help-center" component={HelpCenterPage} />
            <ProtectedRoute path="/contact-support" component={ContactSupportPage} />
            <ProtectedRoute path="/privacy-policy" component={PrivacyPolicyPage} />
            <ProtectedRoute path="/terms-of-service" component={TermsOfServicePage} />
            <ProtectedRoute 
              path="/admin" 
              component={AdminPage} 
              allowedRoles={[UserRole.ADMIN]} 
            />
            <ProtectedRoute 
              path="/response-team" 
              component={ResponseTeamPage} 
              allowedRoles={[UserRole.RESPONSE_TEAM]} 
            />
            <Route path="/auth">
              <AuthPage />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          <LiveChat />
          <Toaster />
        </EmergencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;