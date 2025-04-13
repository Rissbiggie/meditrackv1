import React from 'react';
import { 
  Home, 
  Menu, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  User, 
  Settings, 
  Search,
  ChevronRight,
  CheckCircle,
  Ambulance,
  Hospital,
  Phone,
  PenTool,
  Bell,
  MessageSquare,
  Star,
  Shield,
  UserCheck,
  Users,
  Activity,
  Plus,
  LogOut,
  Edit,
  ExternalLink,
  HelpCircle,
  FileText,
  Zap,
  Send,
  Loader
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  // Navigation icons
  'home': <Home />,
  'dashboard': <Activity />,
  'services': <Hospital />,
  'settings': <Settings />,
  'menu': <Menu />,
  
  // Status icons
  'warning': <AlertTriangle />,
  'check': <CheckCircle />,
  'clock': <Clock />,
  
  // Medical icons
  'ambulance': <Ambulance />,
  'hospital': <Hospital />,
  'pharmacy': <Plus />,
  'doctor': <UserCheck />,
  
  // User icons
  'user': <User />,
  'admin': <Shield />,
  'response-team': <Bell />,
  'users': <Users />,
  
  // Action icons
  'search': <Search />,
  'edit': <Edit />,
  'logout': <LogOut />,
  'plus': <Plus />,
  'arrow-right': <ChevronRight />,
  'external-link': <ExternalLink />,
  'send': <Send />,
  
  // Location icons
  'map-pin': <MapPin />,
  'map': <MapPin />,
  
  // Communication icons
  'message': <MessageSquare />,
  'bell': <Bell />,
  'phone': <Phone />,
  
  // Misc icons
  'star': <Star />,
  'help': <HelpCircle />,
  'file': <FileText />,
  'activity': <Activity />,
  'zap': <Zap />,
  'loader': <Loader className="animate-spin" />
};

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className = '' }: IconProps) {
  // Return the icon if it exists in our map
  if (iconMap[name]) {
    return (
      <span className={className}>
        {iconMap[name]}
      </span>
    );
  }
  
  // Default icon if not found
  console.warn(`Icon "${name}" not found`);
  return <span className={className}><HelpCircle /></span>;
}