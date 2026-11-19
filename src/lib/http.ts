/**
 * Authorized JSON requests to the FastAPI backend.
 *
 * Sends the JWT saved at login, and turns error responses into `ApiError` with
 * any structured validation details (`{message, errors: [{path, message}]}`).
 */
import { API_BASE_URL } from './apiClient';

const AUTH_TOKEN_KEY = 'resolyx-auth-token';

export interface ApiFieldError {
  path: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: ApiFieldError[];

  constructor(status: number, message: string, fieldErrors: ApiFieldError[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

type Query = Record<string, string | number | boolean | null | undefined>;

function buildUrl(path: string, query?: Query): string {
  const url = `${API_BASE_URL}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

/** Converts FastAPI error bodies (string, structured, or pydantic list) to an ApiError. */
function toApiError(status: number, body: unknown): ApiError {
  const detail = (body as { detail?: unknown } | null)?.detail;
  // FastAPI's generic 404 means the route itself is missing: the running backend is
  // older than this frontend (e.g. started before an update, without --reload).
  if (status === 404 && detail === 'Not Found') {
    return new ApiError(
      status,
      'This feature is not available on the running backend. Restart the backend server (uvicorn app.main:app --reload --port 8000) to load the latest version.',
    );
  }
  if (typeof detail === 'string') return new ApiError(status, detail);
  if (detail && typeof detail === 'object' && !Array.isArray(detail)) {
    const d = detail as { message?: string; errors?: ApiFieldError[] };
    return new ApiError(status, d.message || 'Request failed.', d.errors || []);
  }
  if (Array.isArray(detail)) {
    // Pydantic: [{loc: ['body', 'name'], msg: '...'}]
    const errors = detail.map((e: { loc?: (string | number)[]; msg?: string }) => ({
      path: (e.loc || []).filter((p) => p !== 'body').join('.'),
      message: (e.msg || 'Invalid value').replace(/^Value error, /, ''),
    }));
    return new ApiError(status, errors[0]?.message || 'Validation failed.', errors);
  }
  if (status === 401) return new ApiError(status, 'Your session has expired. Please sign in again.');
  if (status === 403) return new ApiError(status, 'You do not have permission to do this.');
  return new ApiError(status, `Request failed (${status}).`);
}

export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  options: { body?: unknown; query?: Query; signal?: AbortSignal } = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.query), {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    throw new ApiError(0, 'Cannot reach the Resolyx server. Check that the backend is running.');
  }

  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => null);
  if (!response.ok) throw toApiError(response.status, body);
  return body as T;
}
