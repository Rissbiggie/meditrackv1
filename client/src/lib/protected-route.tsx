import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType<any>;
  allowedRoles?: string[];
};

export function ProtectedRoute({
  path,
  component: Component,
  allowedRoles,
}: ProtectedRouteProps) {
  try {
    const { user, isLoading } = useAuth();

    return (
      <Route path={path}>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen bg-primary">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : !user ? (
          <Redirect to="/auth" />
        ) : allowedRoles && !allowedRoles.includes(user.role) ? (
          <Redirect to="/" />
        ) : (
          <Component />
        )}
      </Route>
    );
  } catch (error) {
    console.error("Error in ProtectedRoute:", error);
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }
}
