import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { assignmentRulesApi } from '@/lib/assignmentRulesApi';
import type { AgentOption, TeamOption } from '../../types/rule.types';
import { ErrorBanner, Toggle } from './ui';

interface Props {
  agents: AgentOption[];
  teams: TeamOption[];
  onChange: (agent: AgentOption) => void;
}

export const AgentAvailability: React.FC<Props> = ({ agents, teams, onChange }) => {
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const teamName = (id: number) => teams.find((t) => t.id === id)?.name;

  const toggle = async (agent: AgentOption, available: boolean) => {
    setBusy(agent.id);
    setError(null);
    try {
      onChange(await assignmentRulesApi.setAgentAvailability(agent.id, available));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update availability.');
    } finally {
      setBusy(null);
    }
  };

  if (agents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-12 text-center">
        <Users className="mx-auto h-6 w-6 text-foreground-muted mb-2" />
        <p className="text-sm font-medium text-foreground">No active agents</p>
        <p className="text-xs text-foreground-muted mt-1">Invite agents under Users &amp; Roles to start assigning tickets.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-foreground-muted">
        Unavailable agents are skipped by rules that have “Skip agents unavailable for assignment” enabled. Inactive users never appear here.
      </p>
      {error && <ErrorBanner message={error} />}
      <div className="rounded-xl border border-border bg-surface overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-border bg-surface-subtle/60 text-left text-xs font-semibold text-foreground-muted">
              <th className="px-4 py-2.5">Agent</th>
              <th className="px-4 py-2.5">Teams</th>
              <th className="px-4 py-2.5">Open tickets</th>
              <th className="px-4 py-2.5">Available for assignment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {agents.map((a) => (
              <tr key={a.id} className={busy === a.id ? 'opacity-60' : undefined}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{a.name}</p>
                  <p className="text-xs text-foreground-muted">{a.email}</p>
                </td>
                <td className="px-4 py-3 text-xs text-foreground">
                  {a.team_ids.map(teamName).filter(Boolean).join(', ') || <span className="text-foreground-muted">—</span>}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-foreground">{a.open_tickets}</td>
                <td className="px-4 py-3">
                  <Toggle
                    checked={a.is_available}
                    disabled={busy === a.id}
                    onChange={(v) => void toggle(a, v)}
                    label={a.is_available ? 'Available' : 'Away'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
