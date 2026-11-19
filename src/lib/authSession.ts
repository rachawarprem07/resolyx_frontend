export type AppUserRole =
  | 'admin'
  | 'super_admin'
  | 'team_lead'
  | 'support_agent'
  | 'agent'
  | 'customer';

export interface AuthSessionUser {
  name: string;
  email: string;
  role: AppUserRole;
  title: string;
  department: string;
  avatarInitials: string;
}

export interface CompanyWorkspace {
  id: number;
  name: string;
  currency: string;
  timezone: string;
}

const AUTH_USER_KEY = 'resolyx-auth-user';
const AUTH_TOKEN_KEY = 'resolyx-auth-token';
const AUTH_COMPANY_KEY = 'resolyx-auth-company';

export function getStoredCompany(): CompanyWorkspace | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_COMPANY_KEY);
    if (raw) return JSON.parse(raw) as CompanyWorkspace;
  } catch {
    // fallback
  }
  return null;
}

export function setStoredCompany(company: CompanyWorkspace): void {
  try {
    localStorage.setItem(AUTH_COMPANY_KEY, JSON.stringify(company));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('resolyx-company-updated', { detail: company }));
    }
  } catch {
    // ignore
  }
}

export const DEMO_USERS: Record<AppUserRole, AuthSessionUser> = {
  admin: {
    name: 'Administrator',
    email: 'admin@resolyx.com',
    role: 'admin',
    title: 'Helpdesk Administrator',
    department: 'IT & Administration',
    avatarInitials: 'AD',
  },
  super_admin: {
    name: 'Administrator',
    email: 'admin@resolyx.com',
    role: 'admin',
    title: 'Super Administrator',
    department: 'Executive Administration',
    avatarInitials: 'AD',
  },
  team_lead: {
    name: 'Elena Vance',
    email: 'lead@resolyx.com',
    role: 'team_lead',
    title: 'Support Team Lead',
    department: 'Technical Support',
    avatarInitials: 'TL',
  },
  support_agent: {
    name: 'Alex Rivera',
    email: 'agent@resolyx.com',
    role: 'support_agent',
    title: 'Support Agent',
    department: 'Customer Care',
    avatarInitials: 'AG',
  },
  agent: {
    name: 'Alex Rivera',
    email: 'agent@resolyx.com',
    role: 'support_agent',
    title: 'Support Agent',
    department: 'Customer Care',
    avatarInitials: 'AG',
  },
  customer: {
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne.com',
    role: 'customer',
    title: 'Customer Stakeholder',
    department: 'External Customer',
    avatarInitials: 'SC',
  },
};

export function getCurrentUser(): AuthSessionUser {
  if (typeof window === 'undefined') return DEMO_USERS.admin;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email && parsed.role) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return DEMO_USERS.admin;
}

export function setAuthenticatedUser(
  user: {
    email: string;
    name?: string;
    role: AppUserRole;
    title?: string;
    department?: string;
  },
  token?: string
): AuthSessionUser {
  const base = DEMO_USERS[user.role] || DEMO_USERS.admin;
  const sessionUser: AuthSessionUser = {
    name: user.name || base.name,
    email: user.email,
    role: user.role,
    title: user.title || base.title,
    department: user.department || base.department,
    avatarInitials:
      (user.name || user.email)
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'AD',
  };

  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  } catch {
    // ignore
  }

  return sessionUser;
}

export function setCurrentUser(role: AppUserRole): AuthSessionUser {
  const user = DEMO_USERS[role];
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
  return user;
}

export function clearCurrentUser(): void {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore
  }
}
