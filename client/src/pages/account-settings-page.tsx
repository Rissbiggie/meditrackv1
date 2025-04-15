import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type Tab = "profile" | "notifications" | "privacy";

interface SettingsTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function SettingsTab({ label, isActive, onClick }: SettingsTabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between p-4 cursor-pointer transition-colors",
        "bg-white/10 backdrop-blur-sm rounded-xl mb-2",
        isActive && "bg-white/20"
      )}
    >
      <span className="text-white">{label}</span>
      <ChevronRight className="h-5 w-5 text-white/60" />
    </button>
  );
}

function ProfileSettings() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567"
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Profile Settings</h3>
        <Button
          variant="secondary"
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>
      <Card className="bg-white/10 backdrop-blur-sm border-none p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-white/60 text-sm">Full Name</p>
            {isEditing ? (
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="bg-white/5 border-none text-white"
              />
            ) : (
              <p className="text-white">{formData.fullName}</p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-white/60 text-sm">Email</p>
            {isEditing ? (
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/5 border-none text-white"
              />
            ) : (
              <p className="text-white">{formData.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-white/60 text-sm">Phone Number</p>
            {isEditing ? (
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white/5 border-none text-white"
              />
            ) : (
              <p className="text-white">{formData.phone}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function NotificationPreferences() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    medicalUpdates: true,
    systemNotifications: false
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      toast({
        title: "Notification Settings Updated",
        description: `${key} notifications are now ${newState[key] ? "enabled" : "disabled"}.`,
      });
      return newState;
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold mb-4">Notification Preferences</h3>
      <Card className="bg-white/10 backdrop-blur-sm border-none p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
            <div>
              <p className="text-white">Emergency Alerts</p>
              <p className="text-white/60 text-sm">Receive notifications for emergency situations</p>
            </div>
            <Switch
              checked={notifications.emergencyAlerts}
              onCheckedChange={() => handleToggle("emergencyAlerts")}
            />
          </div>
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
            <div>
              <p className="text-white">Medical Updates</p>
              <p className="text-white/60 text-sm">Get notified when medical information is updated</p>
            </div>
            <Switch
              checked={notifications.medicalUpdates}
              onCheckedChange={() => handleToggle("medicalUpdates")}
            />
          </div>
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
            <div>
              <p className="text-white">System Notifications</p>
              <p className="text-white/60 text-sm">Receive updates about system maintenance and features</p>
            </div>
            <Switch
              checked={notifications.systemNotifications}
              onCheckedChange={() => handleToggle("systemNotifications")}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

function PrivacySettings() {
  const { toast } = useToast();
  const [privacy, setPrivacy] = useState({
    dataSharing: true,
    locationServices: true,
    profileVisibility: false
  });

  const handleToggle = (key: keyof typeof privacy) => {
    setPrivacy(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      toast({
        title: "Privacy Settings Updated",
        description: `${key} setting has been ${newState[key] ? "enabled" : "disabled"}.`,
      });
      return newState;
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold mb-4">Privacy Settings</h3>
      <Card className="bg-white/10 backdrop-blur-sm border-none p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
            <div>
              <p className="text-white">Data Sharing</p>
              <p className="text-white/60 text-sm">Control how your data is shared with emergency services</p>
            </div>
            <Switch
              checked={privacy.dataSharing}
              onCheckedChange={() => handleToggle("dataSharing")}
            />
          </div>
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
            <div>
              <p className="text-white">Location Services</p>
              <p className="text-white/60 text-sm">Manage location tracking permissions</p>
            </div>
            <Switch
              checked={privacy.locationServices}
              onCheckedChange={() => handleToggle("locationServices")}
            />
          </div>
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
            <div>
              <p className="text-white">Profile Visibility</p>
              <p className="text-white/60 text-sm">Control who can see your profile information</p>
            </div>
            <Switch
              checked={privacy.profileVisibility}
              onCheckedChange={() => handleToggle("profileVisibility")}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function AccountSettingsPage() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Parse the tab from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const tab = params.get("tab") as Tab;
    if (tab && (tab === "profile" || tab === "notifications" || tab === "privacy")) {
      setActiveTab(tab);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Account Settings" />

      <main className="pt-20 px-4">
        <div className="fade-in">
          <div className="mb-6">
            <SettingsTab
              label="Profile Settings"
              isActive={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <SettingsTab
              label="Notification Preferences"
              isActive={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
            />
            <SettingsTab
              label="Privacy Settings"
              isActive={activeTab === "privacy"}
              onClick={() => setActiveTab("privacy")}
            />
          </div>

          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "notifications" && <NotificationPreferences />}
          {activeTab === "privacy" && <PrivacySettings />}
        </div>
      </main>

      <Navbar />
    </div>
  );
} 