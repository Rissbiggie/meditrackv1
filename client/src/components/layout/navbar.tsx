import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [location, setLocation] = useLocation();
  
  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 bg-secondary text-primary shadow-lg z-10", className)}>
      <div className="flex justify-around">
        <NavItem 
          icon="home" 
          label="Home" 
          isActive={location === "/"} 
          onClick={() => setLocation("/")}
        />
        <NavItem 
          icon="dashboard" 
          label="Dashboard" 
          isActive={location === "/dashboard"} 
          onClick={() => setLocation("/dashboard")}
        />
        <NavItem 
          icon="services" 
          label="Services" 
          isActive={location === "/services"} 
          onClick={() => setLocation("/services")}
        />
        <NavItem 
          icon="settings" 
          label="Settings" 
          isActive={location === "/settings"} 
          onClick={() => setLocation("/settings")}
        />
      </div>
    </nav>
  );
}

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button 
      className={cn(
        "flex flex-col items-center py-3 px-4 transition-colors duration-300",
        isActive ? "text-primary" : "text-primary/70 hover:text-primary"
      )}
      onClick={onClick}
    >
      <Icon name={icon} className="text-lg" />
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );
}

export default Navbar;
