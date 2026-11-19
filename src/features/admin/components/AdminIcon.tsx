import React from 'react';
import {
  Home,
  LayoutDashboard,
  Ticket,
  BookOpen,
  Building2,
  Contact,
  Users,
  Users2,
  Star,
  Hourglass,
  UserCheck,
  Clock,
  Search,
  Bell,
  Sparkles,
  BarChart3,
  Settings,
  GitFork,
  Headphones,
  HelpCircle,
  MoreHorizontal,
  AlertCircle,
} from 'lucide-react';

interface AdminIconProps {
  name: string;
  className?: string;
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  LayoutDashboard,
  Ticket,
  BookOpen,
  Building2,
  Contact,
  Users,
  Users2,
  Star,
  Hourglass,
  UserCheck,
  Clock,
  Search,
  Bell,
  Sparkles,
  BarChart3,
  Settings,
  GitFork,
  Headphones,
  MoreHorizontal,
  AlertCircle,
};

export const AdminIcon: React.FC<AdminIconProps> = ({ name, className = 'h-4 w-4' }) => {
  const Component = ICONS[name] || HelpCircle;
  return <Component className={className} />;
};
