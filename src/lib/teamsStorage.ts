import type { SupportTeam } from '@/features/admin/types/team.types';

const TEAMS_STORAGE_KEY = 'resolyx-teams-v3';

export const INITIAL_SUPPORT_TEAMS: SupportTeam[] = [];

export function getStoredTeams(): SupportTeam[] {
  if (typeof window === 'undefined') return INITIAL_SUPPORT_TEAMS;
  try {
    const raw = localStorage.getItem(TEAMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_SUPPORT_TEAMS;
}

export function saveStoredTeams(teams: SupportTeam[]): void {
  try {
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  } catch {
    // ignore
  }
}
