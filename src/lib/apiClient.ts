/**
 * Backend Connection & API Client Configuration
 *
 * Configures the base URL and proxy connection between frontend and FastAPI backend.
 */

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) || '/api/v1';

export const BACKEND_URL: string =
  (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:8000';

export interface BackendHealthResponse {
  status: string;
  database?: string;
  project: string;
  version: string;
  environment: string;
}

export interface ApiUser {
  id: number;
  email: string;
  role: string;
  full_name: string | null;
  is_active: boolean;
  company_id?: number | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: ApiUser;
}

export interface SetupStatusResponse {
  is_setup_required: boolean;
  company_count: number;
  admin_count: number;
  message: string;
}

export interface CompanyDetails {
  id: number;
  name: string;
  currency: string;
  timezone: string;
}

export interface CompanySetupPayload {
  company_name: string;
  currency: string;
  timezone: string;
  full_name: string;
  email: string;
  password: string;
}

export interface CompanySetupResponse {
  access_token: string;
  token_type: string;
  user: ApiUser;
  company: CompanyDetails;
  message: string;
}

export interface UserDetail {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  department: string | null;
  is_active: boolean;
  status: 'active' | 'invited' | 'inactive';
  created_at: string;
  invite_token?: string | null;
  invite_url?: string | null;
}

export interface UserInvitePayload {
  email: string;
  full_name: string;
  role: string;
  department?: string;
}

export interface UserInviteResponse {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  department: string | null;
  status: string;
  invite_token: string;
  invite_url: string;
  email_sent: boolean;
  email_detail?: string | null;
  message: string;
}

export interface BackendEmailAccount {
  id: number;
  provider: string;
  account_name: string;
  email: string;
  password?: string;
  enable_incoming: boolean;
  enable_outgoing: boolean;
  default_incoming: boolean;
  default_outgoing: boolean;
  smtp_host: string;
  smtp_port: number;
  smtp_encryption: string;
  imap_host: string;
  imap_port: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InviteValidation {
  email: string;
  full_name: string | null;
  role: string;
  company_name: string;
  is_valid: boolean;
}

export interface AcceptInvitePayload {
  token: string;
  password: string;
  full_name?: string;
}

export interface AcceptInviteResponse {
  access_token: string;
  token_type: string;
  user: ApiUser;
  redirect_url: string;
}

export interface CustomerSignupPayload {
  email: string;
  password: string;
  full_name: string;
  company_name?: string;
  phone?: string;
}

export interface SendOtpPayload {
  email: string;
  full_name?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp_code: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  email_sent: boolean;
  email_detail?: string | null;
}

/**
 * Checks whether first-time workspace setup (company & super admin creation) is needed.
 */
export async function getSetupStatusApi(): Promise<SetupStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/setup/status`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to check setup status: ${response.status}`);
  }

  return response.json() as Promise<SetupStatusResponse>;
}

/**
 * Creates the initial company workspace and Super Administrator user.
 */
export async function setupWorkspaceApi(
  payload: CompanySetupPayload
): Promise<CompanySetupResponse> {
  const response = await fetch(`${API_BASE_URL}/setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Workspace setup failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<CompanySetupResponse>;
}

/**
 * Updates the company workspace details (name, currency, timezone).
 */
export async function updateCompanyApi(
  payload: Partial<CompanyDetails>
): Promise<CompanyDetails> {
  const response = await fetch(`${API_BASE_URL}/setup/company`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Failed to update company (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<CompanyDetails>;
}

/**
 * Verifies backend connectivity by pinging the health check endpoint.
 */
export async function checkBackendConnection(): Promise<BackendHealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Backend health check failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<BackendHealthResponse>;
}

/**
 * Authenticates user credentials against the PostgreSQL-backed FastAPI service.
 */
export async function loginApi(credentials: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Authentication failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<LoginResponse>;
}

/**
 * Fetches all users from PostgreSQL.
 */
export async function getUsersApi(): Promise<UserDetail[]> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load users: ${response.status}`);
  }

  return response.json() as Promise<UserDetail[]>;
}

/**
 * Invites a new team member/agent and returns setup link.
 */
export async function inviteUserApi(
  payload: UserInvitePayload
): Promise<UserInviteResponse> {
  const response = await fetch(`${API_BASE_URL}/users/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Failed to send invitation (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<UserInviteResponse>;
}

/**
 * Validates an invitation link and returns invited user & workspace details.
 */
export async function validateInviteTokenApi(
  token: string
): Promise<InviteValidation> {
  const response = await fetch(
    `${API_BASE_URL}/users/invite/${encodeURIComponent(token)}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Invalid or expired invitation token (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<InviteValidation>;
}

/**
 * Sets password for an invited user, activates account, and logs in.
 */
export async function acceptInviteApi(
  payload: AcceptInvitePayload
): Promise<AcceptInviteResponse> {
  const response = await fetch(`${API_BASE_URL}/users/accept-invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Failed to set password (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<AcceptInviteResponse>;
}

/**
 * Registers an external customer, creates active account, and logs in.
 */
export async function customerSignupApi(
  payload: CustomerSignupPayload
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/customer-signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Signup failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<LoginResponse>;
}

/**
 * Dispatches a 6-digit verification code to the customer email via default outgoing SMTP.
 */
export async function sendOtpApi(
  payload: SendOtpPayload
): Promise<OtpResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Failed to send verification code (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<OtpResponse>;
}

/**
 * Verifies the customer OTP code against the backend.
 */
export async function verifyOtpApi(
  payload: VerifyOtpPayload
): Promise<OtpResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Verification failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<OtpResponse>;
}

/**
 * Resends / regenerates an invitation link for a pending user.
 */
export async function resendInviteApi(
  userId: number
): Promise<UserInviteResponse> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/resend-invite`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Failed to resend invitation (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<UserInviteResponse>;
}

/**
 * Removes a user or cancels a pending invitation.
 */
export async function deleteUserApi(
  userId: number
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Failed to delete user (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<{ message: string }>;
}

/**
 * Updates a user's role, name, department, or status in PostgreSQL.
 */
export async function updateUserApi(
  userId: number,
  payload: {
    full_name?: string;
    department?: string;
    role?: string;
    status?: string;
    is_active?: boolean;
  }
): Promise<UserDetail> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Failed to update user (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<UserDetail>;
}

/**
 * Saves or updates an email account (e.g. Gmail) in the PostgreSQL backend.
 */
export async function saveEmailAccountApi(payload: {
  id?: string;
  provider: string;
  account_name: string;
  email: string;
  password?: string;
  enable_incoming: boolean;
  enable_outgoing: boolean;
  default_incoming: boolean;
  default_outgoing: boolean;
  smtp_host?: string;
  smtp_port?: number;
  smtp_encryption?: string;
  imap_host?: string;
  imap_port?: number;
}): Promise<BackendEmailAccount> {
  const response = await fetch(`${API_BASE_URL}/email-accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Failed to save email account (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<BackendEmailAccount>;
}

/**
 * Retrieves configured email accounts from the backend.
 */
export async function getEmailAccountsApi(): Promise<BackendEmailAccount[]> {
  const response = await fetch(`${API_BASE_URL}/email-accounts`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load email accounts (${response.status})`);
  }

  return response.json() as Promise<BackendEmailAccount[]>;
}

/**
 * Deletes a configured email account from backend.
 */
export async function deleteEmailAccountApi(
  id: number
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/email-accounts/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Failed to delete email account (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<{ message: string }>;
}

/**
 * Tests connection with raw credentials in form before saving.
 */
export async function testEmailAccountCredentialsApi(payload: {
  email: string;
  password: string;
  smtp_host?: string;
  smtp_port?: number;
}): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/email-accounts/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      smtp_host: payload.smtp_host || 'smtp.gmail.com',
      smtp_port: payload.smtp_port || 587,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `SMTP connection test failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<{ success: boolean; message: string }>;
}

/**
 * Tests connection with an existing saved email account in PostgreSQL.
 */
export async function testSavedEmailAccountApi(
  id: number
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/email-accounts/${id}/test`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `SMTP connection test failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<{ success: boolean; message: string }>;
}
