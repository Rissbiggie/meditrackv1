import { useState } from "react";
import { useLocation } from "wouter";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";

// Import components from Tanstack/React Query directly
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InsertUser, LoginUser } from "@shared/schema";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Create standalone mutations for this page
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginUser) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName}!`,
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", userData);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Provide a way to pass these mutations to the forms
  const handleLogin = (credentials: LoginUser) => {
    loginMutation.mutate(credentials);
  };

  const handleRegister = (userData: InsertUser) => {
    registerMutation.mutate(userData);
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 bg-primary login-bg">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <Logo size="lg" />
        
        {/* Auth Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 slide-up shadow-xl">
          <div className="flex mb-6">
            <Button
              variant="link"
              className={`flex-1 pb-2 font-medium border-b-2 ${
                activeTab === "login"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-white/60"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </Button>
            <Button
              variant="link"
              className={`flex-1 pb-2 font-medium border-b-2 ${
                activeTab === "register"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-white/60"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </Button>
          </div>
          
          {activeTab === "login" ? (
            <LoginForm onSubmit={handleLogin} isPending={loginMutation.isPending} />
          ) : (
            <RegisterForm onSubmit={handleRegister} isPending={registerMutation.isPending} />
          )}
        </div>
      </div>
    </section>
  );
}
