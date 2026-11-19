import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ROUTE_LABELS: Record<string, string> = {
  '/admin': 'Home',
  '/admin/home': 'Home',
  '/admin/dashboard': 'Dashboard',
  '/admin/tickets': 'Tickets',
  '/admin/kb': 'Knowledge Base',
  '/admin/customers': 'Customers',
  '/admin/contacts': 'Customers',
  '/admin/users': 'Users & Roles',
  '/admin/teams': 'Teams',
  '/admin/assignment-rules': 'Assignment Rules',
  '/admin/helpdesk': 'Helpdesk',
  '/admin/ai-settings': 'AI Settings',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
  '/admin/profile': 'My Profile',
};

export const AdminBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentLabel = ROUTE_LABELS[currentPath] || 'Overview';

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-xs font-medium text-foreground-muted select-none"
    >
      <Link to="/admin" className="hover:text-foreground transition-colors">
        Admin
      </Link>
      <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-slate-400 shrink-0" />
      <span className="text-foreground font-semibold truncate max-w-[160px] sm:max-w-none">
        {currentLabel}
      </span>
    </nav>
  );
};
