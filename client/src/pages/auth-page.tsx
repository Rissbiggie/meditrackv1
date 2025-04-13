import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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
                  ? "border-secondary text-white"
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
                  ? "border-secondary text-white"
                  : "border-transparent text-white/60"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </Button>
          </div>
          
          {activeTab === "login" ? (
            <LoginForm />
          ) : (
            <RegisterForm />
          )}
        </div>
      </div>
    </section>
  );
}
