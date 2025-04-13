import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { User as SelectUser } from "@shared/schema";

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
  // Get user data directly instead of using useAuth
  const { 
    data: user = null, 
    isLoading,
    error
  } = useQuery<SelectUser | null>({
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    retry: false,
  });

  if (error) {
    console.error("Error fetching user:", error);
  }

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
}
