import { useState } from "react";
import { Power, HelpCircle, MessageCircle, Shield, FileText, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch as ToggleSwitch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { EmergencyModal } from "@/components/modals/emergency-modal";
import { ProfileEditModal } from "@/components/modals/profile-edit-modal";
import { useLocation } from "wouter";

export default function SettingsPage() {
  const { logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Settings" />

      <main className="pt-20 px-4">
        <div className="fade-in">
          <h2 className="text-white font-semibold text-xl mb-4">Settings</h2>

          {/* Account Settings */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-4">Account Settings</h3>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 hover:bg-white/10 text-white justify-between"
                  onClick={() => setLocation("/account-settings")}
                >
                  <span>Profile Settings</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 hover:bg-white/10 text-white justify-between"
                  onClick={() => setLocation("/account-settings")}
                >
                  <span>Notification Preferences</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 hover:bg-white/10 text-white justify-between"
                  onClick={() => setLocation("/account-settings")}
                >
                  <span>Privacy Settings</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-4">Help & Support</h3>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 hover:bg-white/10 text-white justify-between"
                  onClick={() => setLocation("/help-center")}
                >
                  <div className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span>Help Center</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 hover:bg-white/10 text-white justify-between"
                  onClick={() => setLocation("/contact-support")}
                >
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <span>Contact Support</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Legal */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 hover:bg-white/10 text-white justify-between"
                  onClick={() => setLocation("/privacy-policy")}
                >
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Privacy Policy</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 hover:bg-white/10 text-white justify-between"
                  onClick={() => setLocation("/terms-of-service")}
                >
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Terms of Service</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      </main>

      <Navbar />
    </div>
  );
}
