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
import { connectWebSocket, disconnectWebSocket } from "@/lib/websocket";

function App() {
  useEffect(() => {
    // Connect WebSocket when component mounts
    connectWebSocket();

    // Cleanup WebSocket when component unmounts
    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EmergencyProvider>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/dashboard">
              <ProtectedRoute path="/dashboard" component={DashboardPage} />
            </Route>
            <Route path="/services">
              <ProtectedRoute path="/services" component={ServicesPage} />
            </Route>
            <Route path="/settings">
              <ProtectedRoute path="/settings" component={SettingsPage} />
            </Route>
            <Route path="/account-settings">
              <ProtectedRoute path="/account-settings" component={AccountSettingsPage} />
            </Route>
            <Route path="/help-center">
              <ProtectedRoute path="/help-center" component={HelpCenterPage} />
            </Route>
            <Route path="/contact-support">
              <ProtectedRoute path="/contact-support" component={ContactSupportPage} />
            </Route>
            <Route path="/privacy-policy">
              <ProtectedRoute path="/privacy-policy" component={PrivacyPolicyPage} />
            </Route>
            <Route path="/terms-of-service">
              <ProtectedRoute path="/terms-of-service" component={TermsOfServicePage} />
            </Route>
            <Route path="/admin">
              <ProtectedRoute 
                path="/admin" 
                component={AdminPage} 
                allowedRoles={[UserRole.ADMIN]} 
              />
            </Route>
            <Route path="/response-team">
              <ProtectedRoute 
                path="/response-team" 
                component={ResponseTeamPage} 
                allowedRoles={[UserRole.RESPONSE_TEAM]} 
              />
            </Route>
            <Route component={NotFound} />
          </Switch>
          <LiveChat />
          <Toaster />
        </EmergencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;