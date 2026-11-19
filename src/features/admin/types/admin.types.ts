export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  badge?: string;
  isAi?: boolean;
}

export interface AdminKpiMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  subtext: string;
  iconName: string;
  isAi?: boolean;
}

export type OrgPlan = 'Enterprise' | 'Pro' | 'Starter' | 'Trial';
export type OrgStatus = 'active' | 'pending' | 'suspended';

export interface AdminOrganization {
  id: string;
  name: string;
  contactEmail: string;
  plan: OrgPlan;
  usersCount: number;
  status: OrgStatus;
  createdAt: string;
  logoUrl?: string;
  primaryContactName?: string;
  primaryContactRole?: string;
  primaryContactPhone?: string;
  openTickets?: number;
  contacts?: CustomerContact[];
}

export type UserRole = string;
export type UserStatus = 'active' | 'invited' | 'inactive';

export type PermissionCategory = 'Helpdesk' | 'AI & Automation' | 'Users & Roles' | 'Security';

export interface PermissionItem {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
}

export interface PlatformRole {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: string[];
  usersCount: number;
  color?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  department?: string;
  organization?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  inviteUrl?: string;
  inviteToken?: string;
}

export interface TicketCategory {
  id: string;
  name: string;
  description: string;
  defaultPriority: 'Low' | 'Medium' | 'High' | 'Urgent';
  ticketCount: number;
}

export interface PriorityLevel {
  id: string;
  name: string;
  description?: string;
  slaHours: number;
  firstResponseMinutes?: number;
  coverage?: '24x7' | 'business_hours';
  autoEscalate?: boolean;
  color: string;
}

export interface TicketStatusItem {
  id: string;
  name: string;
  description: string;
  isClosed: boolean;
  color: string;
}

export interface AdminAiConfig {
  modelName: string;
  modelVersion: string;
  isModelOnline: boolean;
  isAiEnabled: boolean;
  responseTone: 'professional' | 'friendly' | 'concise';
  confidenceThreshold: number;
  requireHumanReview: boolean;
  autoResolveAboveThreshold: boolean;
}

export interface AdminActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  type: 'org' | 'user' | 'ai' | 'helpdesk' | 'system';
}

export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'ai';
}

export interface CustomerContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  openTickets: number;
  status: 'active' | 'inactive';
}
