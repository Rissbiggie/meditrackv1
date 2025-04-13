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
  // Get user data directly from API
  const { 
    data: user, 
    isLoading,
    error,
    isError
  } = useQuery<SelectUser | null>({
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    retry: 1,
    staleTime: 10000, // 10 seconds
  });

  if (error) {
    console.error("Error fetching user:", error);
  }

  return (
    <Route path={path}>
      {(props) => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen bg-primary">
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
          );
        }
        
        if (!user || isError) {
          return <Redirect to="/auth" />;
        }
        
        if (allowedRoles && !allowedRoles.includes(user.role)) {
          return <Redirect to="/" />;
        }
        
        return <Component {...props} />;
      }}
    </Route>
  );
}
