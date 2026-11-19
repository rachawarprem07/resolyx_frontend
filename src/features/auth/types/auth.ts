export type UserRole = 'admin' | 'team_lead' | 'support_agent';

export type AuthMode = 'agent' | 'super_admin' | 'sso';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  permissions: string[];
  mfaVerified: boolean;
  clusterAccess: 'root_vpc' | 'standard_queue';
  lastLogin: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  totpCode?: string;
  securityKeyId?: string;
}

export interface SSOProvider {
  id: 'okta' | 'azure_ad' | 'google' | 'keycloak';
  name: string;
  badge?: string;
}
