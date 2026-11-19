export interface NavItemDef {
  id: string;
  label: string;
  href: string;
  icon: string;
  end?: boolean;
  hasMenu?: boolean;
  badge?: string;
  badgeVariant?: 'indigo' | 'emerald' | 'amber' | 'blue';
  isAi?: boolean;
  adminOnly?: boolean;
}

export interface NavSectionDef {
  title: string;
  items: NavItemDef[];
}

export const BADGE_CLASSES: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  indigo: 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20',
};

export const ADMIN_SIDEBAR_SECTIONS: NavSectionDef[] = [
  {
    title: 'GENERAL',
    items: [
      { id: 'home', label: 'Home', href: '/admin', icon: 'Home', end: true },
    ],
  },
  {
    title: 'SUPPORT OPERATIONS',
    items: [
      { id: 'tickets', label: 'Tickets', href: '/admin/tickets', icon: 'Ticket' },
      { id: 'kb', label: 'Knowledge Base', href: '/admin/kb', icon: 'BookOpen' },
      { id: 'feedback', label: 'Feedback', href: '/admin/tickets?view=feedback', icon: 'Star' },
    ],
  },
  {
    title: 'TICKET VIEWS',
    items: [
      { id: 'pending', label: 'Pending Tickets', href: '/admin/tickets?view=pending', icon: 'Hourglass' },
      { id: 'assigned', label: 'Recently Assigned', href: '/admin/tickets?view=assigned', icon: 'UserCheck' },
    ],
  },
  {
    title: 'CUSTOMER MANAGEMENT',
    items: [
      { id: 'customers', label: 'Customers', href: '/admin/customers', icon: 'Building2' },
    ],
  },
  {
    title: 'TEAMS & USERS',
    items: [
      { id: 'teams', label: 'Teams', href: '/admin/teams', icon: 'Users2' },
      { id: 'assignment-rules', label: 'Assignment Rules', href: '/admin/assignment-rules', icon: 'GitFork' },
      { id: 'users', label: 'Users & Roles', href: '/admin/users', icon: 'Users', adminOnly: true },
    ],
  },
];
