import React, { useState } from 'react';
import { Users, Clock, Zap, ChevronDown, ChevronUp, Trash2, Mail, Shield, Edit3 } from 'lucide-react';
import type { SupportTeam } from '../../types/team.types';

interface TeamCardProps {
  team: SupportTeam;
  onEdit: (team: SupportTeam) => void;
  onDelete: (id: string) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onEdit, onDelete }) => {
  const [showMembers, setShowMembers] = useState(false);

  return (
    <div className="p-5 rounded-2xl bg-surface border border-border hover:border-brand-indigo/40 transition-all shadow-subtle space-y-4">
      {/* 1. Header with Badges, Edit & Delete */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-foreground">{team.name}</h3>
          </div>
          <p className="text-xs text-foreground-muted mt-1 leading-relaxed">{team.description}</p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo text-[11px] font-semibold">
            <Zap className="h-3 w-3" />
            {team.routingStrategy}
          </span>

          <button
            type="button"
            onClick={() => onEdit(team)}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-brand-indigo hover:bg-brand-indigo/10 transition-colors"
            title="Edit Team"
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(team.id)}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Team"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
        <div className="p-2.5 rounded-xl bg-surface-subtle border border-border">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Team Lead</span>
          <span className="text-xs font-semibold text-foreground truncate block">{team.leadName}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-subtle border border-border">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Members</span>
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-brand-indigo" />
            {team.membersCount} agents
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-subtle border border-border">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">Active Tickets</span>
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-amber-500" />
            {team.activeTicketsCount} in queue
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-subtle border border-border">
          <span className="text-[10px] uppercase font-bold text-foreground-muted block">SLA Response</span>
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-emerald-500" />
            {team.slaTargetHours}h target
          </span>
        </div>
      </div>

      {/* 3. Expandable Member Roster */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowMembers((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-indigo hover:text-brand-indigo-hover transition-colors"
        >
          {showMembers ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          <span>{showMembers ? 'Hide Team Roster' : `View ${team.memberNames.length} Members`}</span>
        </button>

        {showMembers && (
          <div className="mt-2 p-3 rounded-xl bg-surface-subtle border border-border space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted">
              <Mail className="h-3 w-3" />
              <span>Contact Lead: {team.leadEmail}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {team.memberNames.map((name) => (
                <span
                  key={name}
                  className="px-2 py-0.5 rounded-md bg-surface text-xs font-medium text-foreground border border-border"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

