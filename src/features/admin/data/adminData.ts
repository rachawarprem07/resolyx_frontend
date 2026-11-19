import type {
  AdminNavItem,
  AdminKpiMetric,
  AdminOrganization,
  AdminUser,
  TicketCategory,
  PriorityLevel,
  TicketStatusItem,
  AdminAiConfig,
  AdminActivityItem,
  AdminNotification,
  PermissionItem,
  PlatformRole,
} from '../types/admin.types';

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: 'home', label: 'Home', href: '/admin', iconName: 'Home' },
  { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', iconName: 'LayoutDashboard' },
  { id: 'tickets', label: 'Tickets', href: '/admin/tickets', iconName: 'Ticket' },
  { id: 'kb', label: 'Knowledge Base', href: '/admin/kb', iconName: 'BookOpen' },
  { id: 'customers', label: 'Customers', href: '/admin/customers', iconName: 'Building2' },
  { id: 'teams', label: 'Teams', href: '/admin/teams', iconName: 'Users2' },
  { id: 'assignment-rules', label: 'Assignment Rules', href: '/admin/assignment-rules', iconName: 'GitFork' },
  { id: 'users', label: 'Users & Roles', href: '/admin/users', iconName: 'Users' },
];

export const PUBLIC_VIEWS_NAV = [
  { id: 'feedback', label: 'My Feedback', href: '/admin/tickets?view=feedback', iconName: 'Star' },
  { id: 'pending', label: 'Pending Tickets', href: '/admin/tickets?view=pending', iconName: 'Hourglass', hasMenu: true },
  { id: 'assigned', label: 'Recently Assigned Tickets', href: '/admin/tickets?view=assigned', iconName: 'UserCheck' },
  { id: 'sla-alerts', label: 'SLA Alerts', href: '/admin/tickets?view=sla-alerts', iconName: 'Clock' },
];

export const MOCK_CONTACTS: {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  openTickets: number;
  status: 'active' | 'inactive';
}[] = [];

export const DASHBOARD_KPIS: AdminKpiMetric[] = [
  {
    id: 'tickets',
    title: 'Total Tickets',
    value: '0',
    change: '0%',
    trend: 'neutral',
    subtext: 'No active tickets',
    iconName: 'Headphones',
  },
  {
    id: 'users',
    title: 'Active Users',
    value: '1',
    change: '+1',
    trend: 'up',
    subtext: 'System Administrator',
    iconName: 'Users',
  },
  {
    id: 'ai-resolution',
    title: 'AI Auto-Resolution',
    value: '100%',
    change: 'Ready',
    trend: 'up',
    subtext: 'Private AI Copilot Online',
    iconName: 'Sparkles',
    isAi: true,
  },
  {
    id: 'ai-activity',
    title: 'AI Inquiries',
    value: '0',
    change: '0',
    trend: 'neutral',
    subtext: 'Awaiting customer tickets',
    iconName: 'Sparkles',
    isAi: true,
  },
];

export const MOCK_ORGANIZATIONS: AdminOrganization[] = [];

export const MOCK_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'System Administrator',
    email: 'admin@resolyx.com',
    department: 'IT & Administration',
    organization: 'Resolyx Platform',
    role: 'Admin',
    status: 'active',
    createdAt: 'Active',
  },
];

export const MOCK_CATEGORIES: TicketCategory[] = [
  {
    id: 'cat-1',
    name: 'Billing & Invoices',
    description: 'Credit cards, renewals, invoices, charges',
    defaultPriority: 'Medium',
    ticketCount: 0,
  },
  {
    id: 'cat-2',
    name: 'Technical Support',
    description: 'Software errors, VPN, connectivity, crashes',
    defaultPriority: 'High',
    ticketCount: 0,
  },
  {
    id: 'cat-3',
    name: 'Account & Access',
    description: 'Password reset, permissions, 2FA setup',
    defaultPriority: 'High',
    ticketCount: 0,
  },
  {
    id: 'cat-4',
    name: 'Feature Requests',
    description: 'Enhancements, integrations, product feedback',
    defaultPriority: 'Low',
    ticketCount: 0,
  },
  {
    id: 'cat-5',
    name: 'General Inquiries',
    description: 'Company info, schedules, office questions',
    defaultPriority: 'Low',
    ticketCount: 0,
  },
];

export const MOCK_PRIORITIES: PriorityLevel[] = [
  {
    id: 'pri-1',
    name: 'Low',
    slaHours: 24,
    firstResponseMinutes: 480,
    coverage: 'business_hours',
    autoEscalate: false,
    color: 'text-slate-500 bg-slate-100 dark:bg-slate-800',
  },
  {
    id: 'pri-2',
    name: 'Medium',
    slaHours: 8,
    firstResponseMinutes: 120,
    coverage: 'business_hours',
    autoEscalate: true,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40',
  },
  {
    id: 'pri-3',
    name: 'High',
    slaHours: 2,
    firstResponseMinutes: 30,
    coverage: '24x7',
    autoEscalate: true,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
  },
  {
    id: 'pri-4',
    name: 'Urgent',
    slaHours: 0.5,
    firstResponseMinutes: 15,
    coverage: '24x7',
    autoEscalate: true,
    color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40',
  },
];

export const MOCK_STATUSES: TicketStatusItem[] = [
  {
    id: 'st-1',
    name: 'Open',
    description: 'New ticket waiting for assignment or AI resolution',
    isClosed: false,
    color: 'text-blue-600',
  },
  {
    id: 'st-2',
    name: 'In Progress',
    description: 'Agent or AI currently investigating the request',
    isClosed: false,
    color: 'text-amber-600',
  },
  {
    id: 'st-3',
    name: 'Waiting on Customer',
    description: 'Pending user reply or verification info',
    isClosed: false,
    color: 'text-purple-600',
  },
  {
    id: 'st-4',
    name: 'Resolved',
    description: 'Solution provided and confirmed by customer or AI',
    isClosed: true,
    color: 'text-emerald-600',
  },
  {
    id: 'st-5',
    name: 'Closed',
    description: 'Ticket archived and SLA concluded',
    isClosed: true,
    color: 'text-slate-400',
  },
];

export const DEFAULT_AI_CONFIG: AdminAiConfig = {
  modelName: 'Resolyx Private LLM',
  modelVersion: 'v2.4 (Fine-tuned Helpdesk)',
  isModelOnline: true,
  isAiEnabled: true,
  responseTone: 'professional',
  confidenceThreshold: 85,
  requireHumanReview: false,
  autoResolveAboveThreshold: true,
};

export const MOCK_RECENT_ACTIVITY: AdminActivityItem[] = [];

export const MOCK_NOTIFICATIONS: AdminNotification[] = [];

export const DEFAULT_PERMISSIONS: PermissionItem[] = [
  {
    id: 'tickets.view',
    name: 'View & Search Tickets',
    description: 'Access ticket inboxes and search through customer conversations',
    category: 'Helpdesk',
  },
  {
    id: 'tickets.reply',
    name: 'Reply to Conversations',
    description: 'Send replies, internal notes, and customer emails',
    category: 'Helpdesk',
  },
  {
    id: 'tickets.resolve',
    name: 'Resolve & Close Tickets',
    description: 'Change ticket statuses, assign solutions, and close requests',
    category: 'Helpdesk',
  },
  {
    id: 'tickets.delete',
    name: 'Delete Tickets',
    description: 'Permanently remove or purge spam tickets',
    category: 'Helpdesk',
  },
  {
    id: 'ai.use',
    name: 'Use AI Suggestions',
    description: 'Generate smart replies and accept autonomous resolution suggestions',
    category: 'AI & Automation',
  },
  {
    id: 'ai.configure',
    name: 'Configure AI Models',
    description: 'Tune confidence thresholds, change response tone, and toggle AI features',
    category: 'AI & Automation',
  },
  {
    id: 'ai.knowledge',
    name: 'Train Knowledge Base',
    description: 'Upload documentation and sync private data sources with AI models',
    category: 'AI & Automation',
  },
  {
    id: 'teams.manage',
    name: 'Manage Teams & Routing',
    description: 'Assign agents to departments and configure routing rules',
    category: 'Users & Roles',
  },
  {
    id: 'users.invite',
    name: 'Invite & Manage Users',
    description: 'Send invitations and manage user accounts across departments',
    category: 'Users & Roles',
  },
  {
    id: 'roles.manage',
    name: 'Manage Roles & Permissions',
    description: 'Create custom roles and modify access permission sets',
    category: 'Users & Roles',
  },
  {
    id: 'audit.view',
    name: 'View Audit Logs',
    description: 'Access administrative activity and security change logs',
    category: 'Security',
  },
];

export const DEFAULT_ROLES: PlatformRole[] = [
  {
    id: 'role-admin',
    name: 'Admin',
    description: 'Full administrative access across Resolyx helpdesk, users, platform roles, settings, and AI configuration',
    isSystem: true,
    usersCount: 1,
    color: 'brand-indigo',
    permissions: [
      'tickets.view',
      'tickets.reply',
      'tickets.resolve',
      'tickets.delete',
      'ai.use',
      'ai.configure',
      'ai.knowledge',
      'teams.manage',
      'users.invite',
      'roles.manage',
      'audit.view',
    ],
  },
  {
    id: 'role-team-lead',
    name: 'Team Lead',
    description: 'Manage helpdesk queues, monitor team SLAs, triage and reassign tickets, and review customer satisfaction feedback',
    isSystem: true,
    usersCount: 1,
    color: 'brand-violet',
    permissions: [
      'tickets.view',
      'tickets.reply',
      'tickets.resolve',
      'ai.use',
      'teams.manage',
    ],
  },
  {
    id: 'role-support-agent',
    name: 'Support Agent',
    description: 'Day-to-day frontline ticket queue resolution, customer conversations, and AI-assisted replies',
    isSystem: true,
    usersCount: 1,
    color: 'emerald',
    permissions: ['tickets.view', 'tickets.reply', 'tickets.resolve', 'ai.use'],
  },
];
