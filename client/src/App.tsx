import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
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
  // Connect to WebSocket when the app loads
  useEffect(() => {
    connectWebSocket();
  }, []);

  return (
    <>
      <Switch>
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
      
      {/* Toast notifications */}
      <Toaster />
    </>
  );
}

export default App;
