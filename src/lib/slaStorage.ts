import type { SlaPolicy } from '@/features/admin/types/sla.types';

const STORAGE_KEY = 'resolyx_sla_policies_v2';

// Completely empty by default - no seed/dummy policies
export const INITIAL_SLA_POLICIES: SlaPolicy[] = [];

export function getStoredSlaPolicies(): SlaPolicy[] {
  if (typeof window === 'undefined') return INITIAL_SLA_POLICIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SLA_POLICIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SLA_POLICIES;
  } catch {
    return INITIAL_SLA_POLICIES;
  }
}

export function saveStoredSlaPolicies(policies: SlaPolicy[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(policies));
  } catch {
    // ignore
  }
}

