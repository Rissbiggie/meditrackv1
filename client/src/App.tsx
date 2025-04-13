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
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            </Route>
            <ProtectedRoute path="/" component={HomePage} />
            <ProtectedRoute path="/dashboard" component={DashboardPage} />
            <ProtectedRoute path="/services" component={ServicesPage} />
            <ProtectedRoute path="/settings" component={SettingsPage} />
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
          <Toaster />
        </EmergencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;