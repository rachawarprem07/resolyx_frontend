import React, { useCallback, useEffect, useState } from 'react';
import { Users, Plus, Search, Layers, Shield } from 'lucide-react';
import { getStoredTeams } from '@/lib/teamsStorage';
import { teamsApi } from '@/lib/teamsApi';
import { TeamCard } from '../components/teams/TeamCard';
import { CreateTeamModal, type TeamFormValues } from '../components/teams/CreateTeamModal';
import type { SupportTeam } from '../types/team.types';

export const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<SupportTeam[]>(getStoredTeams);
  const [search, setSearch] = useState('');
  const [strategyFilter, setStrategyFilter] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<SupportTeam | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setTeams(await teamsApi.list());
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load teams.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const strategies = ['All', 'Round-Robin', 'Least Loaded', 'Skill-Based', 'Manual Broadcast'];

  const filteredTeams = teams.filter((t) => {
    const matchesStrategy = strategyFilter === 'All' || t.routingStrategy === strategyFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.leadName.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    return matchesStrategy && matchesSearch;
  });

  const handleSaveTeam = async (values: TeamFormValues) => {
    const payload = {
      name: values.name,
      description: values.description || null,
      routing_strategy: values.routingStrategy,
      sla_target_hours: values.slaTargetHours,
      lead_user_id: values.leadUserId,
      member_ids: values.memberIds,
      is_active: editingTeam?.isActive ?? true,
    };
    if (editingTeam?.backendId) await teamsApi.update(editingTeam.backendId, payload);
    else await teamsApi.create(payload);
    setEditingTeam(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    const team = teams.find((t) => t.id === id);
    if (!team?.backendId || !window.confirm(`Delete team "${team.name}"?`)) return;
    setActionError(null);
    try {
      await teamsApi.remove(team.backendId);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete the team.');
    }
  };

  const totalMembers = teams.reduce((acc, t) => acc + t.membersCount, 0);
  const totalActiveTickets = teams.reduce((acc, t) => acc + t.activeTicketsCount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Users className="h-7 w-7 text-brand-indigo" />
            Support Teams
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
            Manage functional routing groups, team leads, SLA targets, and agent rosters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTeam(null);
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create Team</span>
        </button>
      </div>

      {(loadError || actionError) && (
        <div role="alert" className="flex items-center justify-between gap-3 p-3 rounded-xl border border-rose-500/30 bg-rose-500/5 text-xs text-rose-600 dark:text-rose-400">
          <span>{actionError || loadError}</span>
          {loadError && <button type="button" onClick={() => void load()} className="font-semibold underline">Retry</button>}
        </div>
      )}

      {/* 2. Stat Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-indigo/10 text-brand-indigo"><Layers className="h-5 w-5" /></div>
          <div>
            <span className="text-xs font-semibold text-foreground-muted">Configured Teams</span>
            <p className="text-xl font-bold text-foreground">{teams.length} Groups</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Users className="h-5 w-5" /></div>
          <div>
            <span className="text-xs font-semibold text-foreground-muted">Active Agents Assigned</span>
            <p className="text-xl font-bold text-foreground">{totalMembers} Members</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500"><Shield className="h-5 w-5" /></div>
          <div>
            <span className="text-xs font-semibold text-foreground-muted">Tickets in Team Queues</span>
            <p className="text-xl font-bold text-foreground">{totalActiveTickets} Open</p>
          </div>
        </div>
      </div>

      {/* 3. Search & Strategy Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search teams by name, lead, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-brand-indigo shadow-subtle"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {strategies.map((strat) => (
            <button
              key={strat}
              type="button"
              onClick={() => setStrategyFilter(strat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                strategyFilter === strat
                  ? 'bg-brand-indigo text-white shadow-sm'
                  : 'bg-surface border border-border text-foreground-muted hover:text-foreground'
              }`}
            >
              {strat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Teams Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTeams.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-surface border border-border">
            <p className="text-xs text-foreground-muted">{isLoading ? 'Loading teams…' : 'No support teams found matching criteria.'}</p>
          </div>
        ) : (
          filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={(t) => {
                setEditingTeam(t);
                setIsCreateOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* 5. Modal */}
      <CreateTeamModal
        isOpen={isCreateOpen}
        initialTeam={editingTeam}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingTeam(null);
        }}
        onSave={handleSaveTeam}
      />
    </div>
  );
};
