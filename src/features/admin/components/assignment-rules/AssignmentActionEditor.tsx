import React from 'react';
import { Check, RefreshCcw, Scale, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentOption, AssignmentConfig, AssignmentType, TeamOption } from '../../types/rule.types';
import { FieldError, Label, inputClass, inputErrorClass } from './ui';

const TYPES: { key: AssignmentType; title: string; description: string; icon: React.ElementType }[] = [
  { key: 'agent', title: 'Assign to Agent', description: 'Always the same agent', icon: User },
  { key: 'team', title: 'Assign to Team', description: 'Route to a team queue', icon: Users },
  { key: 'round_robin', title: 'Round Robin', description: 'Rotate evenly across a pool', icon: RefreshCcw },
  { key: 'least_assigned', title: 'Least Assigned', description: 'Fewest open tickets wins', icon: Scale },
];

interface Props {
  type: AssignmentType;
  config: AssignmentConfig;
  onChange: (type: AssignmentType, config: AssignmentConfig) => void;
  agents: AgentOption[];
  teams: TeamOption[];
  skipUnavailable: boolean;
  errors: Record<string, string>;
}

export const AssignmentActionEditor: React.FC<Props> = ({
  type, config, onChange, agents, teams, skipUnavailable, errors,
}) => {
  const isPool = type === 'round_robin' || type === 'least_assigned';
  const poolIds = new Set<number>(config.agent_ids ?? []);
  const team = teams.find((t) => t.id === config.team_id);
  if (isPool && team) team.member_ids.forEach((id) => poolIds.add(id));
  const pool = agents.filter((a) => poolIds.has(a.id));
  const eligible = pool.filter((a) => !skipUnavailable || a.is_available);

  const toggleAgent = (id: number) => {
    const current = config.agent_ids ?? [];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    onChange(type, { ...config, agent_ids: next });
  };

  return (
    <div className="space-y-4">
      <div role="radiogroup" aria-label="Assignment type" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {TYPES.map(({ key, title, description, icon: Icon }) => {
          const selected = type === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(key, config)}
              className={cn(
                'relative text-left rounded-lg border p-3 transition-colors',
                selected
                  ? 'border-brand-indigo bg-brand-indigo/5 ring-1 ring-brand-indigo'
                  : 'border-border bg-surface hover:border-brand-indigo/40',
              )}
            >
              <Icon className={cn('h-4 w-4 mb-2', selected ? 'text-brand-indigo' : 'text-foreground-muted')} />
              <span className="block text-sm font-semibold text-foreground">{title}</span>
              <span className="block text-xs text-foreground-muted mt-0.5">{description}</span>
              {selected && <Check className="absolute top-3 right-3 h-4 w-4 text-brand-indigo" />}
            </button>
          );
        })}
      </div>

      {type === 'agent' && (
        <div className="max-w-md">
          <Label htmlFor="rule-agent" required>Agent</Label>
          <select
            id="rule-agent"
            value={config.agent_id ?? ''}
            onChange={(e) => onChange(type, { ...config, agent_id: e.target.value ? Number(e.target.value) : null })}
            className={cn(inputClass, errors['assignment_config.agent_id'] && inputErrorClass)}
          >
            <option value="">Select an active agent…</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} · {a.open_tickets} open{a.is_available ? '' : ' · unavailable'}
              </option>
            ))}
          </select>
          <FieldError message={errors['assignment_config.agent_id']} />
        </div>
      )}

      {(type === 'team' || isPool) && (
        <div className="max-w-md">
          <Label htmlFor="rule-team" required={type === 'team'} hint={isPool ? 'members join the pool' : undefined}>
            Team
          </Label>
          <select
            id="rule-team"
            value={config.team_id ?? ''}
            onChange={(e) => onChange(type, { ...config, team_id: e.target.value ? Number(e.target.value) : null })}
            className={cn(inputClass, errors['assignment_config.team_id'] && inputErrorClass)}
          >
            <option value="">{type === 'team' ? 'Select an active team…' : 'No team (use agents below)'}</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} · {t.member_count} member{t.member_count === 1 ? '' : 's'}
              </option>
            ))}
          </select>
          <FieldError message={errors['assignment_config.team_id']} />
          {teams.length === 0 && (
            <p className="mt-1 text-xs text-foreground-muted">No active teams yet. Create one under Teams.</p>
          )}
        </div>
      )}

      {isPool && (
        <div>
          <Label hint="optional, in addition to team members">Additional agents</Label>
          {agents.length === 0 ? (
            <p className="text-xs text-foreground-muted">No active agents found.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {agents.map((a) => {
                const on = (config.agent_ids ?? []).includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleAgent(a.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                      on ? 'border-brand-indigo bg-brand-indigo/10 text-brand-indigo' : 'border-border text-foreground hover:border-brand-indigo/40',
                      !a.is_available && 'opacity-70',
                    )}
                    title={a.is_available ? `${a.open_tickets} open tickets` : 'Unavailable for assignment'}
                  >
                    {on && <Check className="h-3 w-3" />}
                    {a.name}
                    {!a.is_available && <span className="text-[10px] text-amber-600 dark:text-amber-400">away</span>}
                  </button>
                );
              })}
            </div>
          )}
          <FieldError message={errors['assignment_config.agent_ids'] || errors['assignment_config']} />
          <p className="mt-2 text-xs text-foreground-muted" data-testid="pool-summary">
            Pool: <span className="font-semibold text-foreground">{eligible.length}</span> eligible of {pool.length} agent
            {pool.length === 1 ? '' : 's'}
            {type === 'least_assigned' && eligible.length > 0 && (
              <> · next: {[...eligible].sort((a, b) => a.open_tickets - b.open_tickets || a.id - b.id)[0]!.name}</>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
