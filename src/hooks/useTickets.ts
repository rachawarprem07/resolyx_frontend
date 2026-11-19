import { useCallback, useEffect, useState } from 'react';
import type { AgentTicket } from '@/features/agent/types/agent.types';
import { getStoredAgentTickets, syncTicketsFromBackend, TICKETS_UPDATED_EVENT } from '@/lib/ticketsStorage';

/**
 * Tickets from the local cache, refreshed from the backend on mount and whenever
 * the cache changes (create/update anywhere in the app, or another tab).
 */
export function useTickets(): {
  tickets: AgentTicket[];
  isSyncing: boolean;
  syncError: string | null;
  refresh: () => Promise<void>;
} {
  const [tickets, setTickets] = useState<AgentTicket[]>(getStoredAgentTickets);
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsSyncing(true);
    try {
      await syncTicketsFromBackend();
      setSyncError(null);
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Could not load tickets.');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    const reload = () => setTickets(getStoredAgentTickets());
    window.addEventListener(TICKETS_UPDATED_EVENT, reload);
    window.addEventListener('storage', reload);
    void refresh();
    return () => {
      window.removeEventListener(TICKETS_UPDATED_EVENT, reload);
      window.removeEventListener('storage', reload);
    };
  }, [refresh]);

  return { tickets, isSyncing, syncError, refresh };
}
