import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLocation } from "wouter";
import { Heartbeat } from "@/components/ui/heartbeat";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "MediTrack" }: AppHeaderProps) {
  const { user, logoutMutation, isAdmin, isResponseTeam } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getUserRoleBadge = () => {
    if (isAdmin) {
      return (
        <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-full">
          Admin
        </span>
      );
    } else if (isResponseTeam) {
      return (
        <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-full">
          Response Team
        </span>
      );
    }
    return null;
  };

  return (
    <header className="bg-green-600 backdrop-blur-sm fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-primary border-r border-white/10 text-white">
            <div className="py-6 flex flex-col h-full">
              <div className="flex items-center space-x-2">
                <Heartbeat size="sm" />
                <h2 className="text-xl font-bold">MediTrack</h2>
              </div>
              <div className="mt-6 flex-1 flex flex-col space-y-1">
                <MenuItem
                  label="Home"
                  icon="home"
                  isActive={location === "/"}
                  onClick={() => setLocation("/")}
                />
                <MenuItem
                  label="Dashboard"
                  icon="dashboard"
                  isActive={location === "/dashboard"}
                  onClick={() => setLocation("/dashboard")}
                />
                <MenuItem
                  label="Services"
                  icon="services"
                  isActive={location === "/services"}
                  onClick={() => setLocation("/services")}
                />
                <MenuItem
                  label="Settings"
                  icon="settings"
                  isActive={location === "/settings"}
                  onClick={() => setLocation("/settings")}
                />
                
                {isAdmin && (
                  <MenuItem
                    label="Admin Panel"
                    icon="admin"
                    isActive={location === "/admin"}
                    onClick={() => setLocation("/admin")}
                  />
                )}
                
                {isResponseTeam && (
                  <MenuItem
                    label="Response Team"
                    icon="ambulance"
                    isActive={location === "/response-team"}
                    onClick={() => setLocation("/response-team")}
                  />
                )}
              </div>
              <Button 
                variant="ghost" 
                className="justify-start mt-auto text-white/80 hover:text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center">
          <Heartbeat size="sm" className="mr-2" />
          <h1 className="text-white font-semibold text-lg">{title}</h1>
        </div>

        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white rounded-full bg-white/10 h-9 w-9 flex items-center justify-center mr-2">
                <Bell size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-muted-foreground">
                  No new notifications
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {getUserRoleBadge()}
        </div>
      </div>
      <p className="text-blue-900 text-xs text-center pb-2 font-medium">Track Emergency, Save Lives</p>
    </header>
  );
}

interface MenuItemProps {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

function MenuItem({ label, icon, isActive, onClick }: MenuItemProps) {
  return (
    <button
      className={cn(
        "flex items-center w-full py-2 px-3 rounded-md transition-colors",
        isActive 
          ? "bg-secondary text-primary" 
          : "text-white/80 hover:text-white hover:bg-white/10"
      )}
      onClick={onClick}
    >
      <Icon name={icon} className="mr-3" />
      {label}
    </button>
  );
}

export default AppHeader;
