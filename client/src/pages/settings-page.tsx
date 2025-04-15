import { useState } from "react";
import { Power } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch as ToggleSwitch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { EmergencyModal } from "@/components/modals/emergency-modal";
import { ProfileEditModal } from "@/components/modals/profile-edit-modal";

export default function SettingsPage() {
  const { user, logoutMutation } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    darkMode: true,
    smsNotifications: false
  });

  const handleSettingToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Settings" />

      <main className="pt-20 px-4">
        <div className="fade-in mb-6">
          <h2 className="text-white font-semibold text-xl mb-4">Settings</h2>
          
          {/* User Profile Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                  <i className="fas fa-user text-white/70 text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-medium">{user ? `${user.firstName} ${user.lastName}` : "User"}</h3>
                  <p className="text-white/60 text-sm">{user?.email || "user@example.com"}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto bg-white/10 hover:bg-white/20 text-white rounded-full h-8 w-8 flex items-center justify-center"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  <i className="fas fa-pencil-alt text-sm"></i>
                </Button>
              </div>
              <Button 
                className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary font-medium py-2 px-4 rounded-lg transition-all duration-300"
                onClick={() => setIsProfileModalOpen(true)}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* App Settings Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">App Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-sm">Push Notifications</h4>
                    <p className="text-white/60 text-xs">Receive alerts about emergencies</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.notifications}
                    onCheckedChange={() => handleSettingToggle("notifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-sm">Location Tracking</h4>
                    <p className="text-white/60 text-xs">Share your location during emergencies</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.locationTracking}
                    onCheckedChange={() => handleSettingToggle("locationTracking")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-sm">Dark Mode</h4>
                    <p className="text-white/60 text-xs">Use dark theme</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.darkMode}
                    onCheckedChange={() => handleSettingToggle("darkMode")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-sm">SMS Notifications</h4>
                    <p className="text-white/60 text-xs">Receive emergency alerts via SMS</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.smsNotifications}
                    onCheckedChange={() => handleSettingToggle("smsNotifications")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">Support</h3>
              <div className="space-y-3">
                <Button className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 p-3 rounded-lg text-left">
                  <span className="text-white font-medium text-sm">Help Center</span>
                  <i className="fas fa-chevron-right text-white/60"></i>
                </Button>
                <Button className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 p-3 rounded-lg text-left">
                  <span className="text-white font-medium text-sm">Contact Support</span>
                  <i className="fas fa-chevron-right text-white/60"></i>
                </Button>
                <Button className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 p-3 rounded-lg text-left">
                  <span className="text-white font-medium text-sm">Privacy Policy</span>
                  <i className="fas fa-chevron-right text-white/60"></i>
                </Button>
                <Button className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 p-3 rounded-lg text-left">
                  <span className="text-white font-medium text-sm">Terms of Service</span>
                  <i className="fas fa-chevron-right text-white/60"></i>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 mb-8"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
          </Button>
        </div>
      </main>

      <Navbar />
      <EmergencyModal />
      {user && (
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
        />
      )}
    </div>
  );
}
