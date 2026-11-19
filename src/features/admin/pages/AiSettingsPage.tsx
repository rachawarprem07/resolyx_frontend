import React, { useState } from 'react';
import { Sparkles, Check, Sliders, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEFAULT_AI_CONFIG } from '../data/adminData';
import { AiHumanReviewCard } from '../components/ai/AiHumanReviewCard';
import type { AdminAiConfig } from '../types/admin.types';
import { getCurrentUser } from '@/lib/authSession';

export const AiSettingsPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';

  const [config, setConfig] = useState<AdminAiConfig>(DEFAULT_AI_CONFIG);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleUpdate = (updates: Partial<AdminAiConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  if (!isAdmin) {
    return (
      <div className="py-20 max-w-lg mx-auto text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Administrator Access Required</h2>
          <p className="text-xs text-foreground-muted mt-2 leading-relaxed">
            AI engine configuration, model confidence thresholds, and automated resolution policies are
            managed exclusively by Workspace Administrators.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/admin/tickets"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shadow-sm hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Tickets</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            AI Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
            Configure platform AI models, automated response behavior, and review policies.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-violet text-white hover:bg-brand-violet/90 text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          {isSaved ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          <span>{isSaved ? 'Settings Saved' : 'Save Changes'}</span>
        </button>
      </div>

      {/* 2. Model Status Banner */}
      <div className="p-5 rounded-2xl bg-surface border border-brand-violet/30 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-brand-violet/10 text-brand-violet">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">{config.modelName}</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
              </span>
            </div>
            <p className="text-xs text-foreground-muted mt-0.5">
              {config.modelVersion} • Zero external data leakage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-semibold text-foreground">
            {config.isAiEnabled ? 'AI Enabled' : 'AI Paused'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={config.isAiEnabled}
            onClick={() => handleUpdate({ isAiEnabled: !config.isAiEnabled })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              config.isAiEnabled ? 'bg-brand-violet' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                config.isAiEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. AI Response Behavior */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-5">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Sliders className="h-4 w-4 text-brand-indigo" />
          <h2 className="text-sm font-bold text-foreground">Response Behavior</h2>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-2">
            Default Response Tone
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['professional', 'friendly', 'concise'] as const).map((tone) => (
              <button
                type="button"
                key={tone}
                onClick={() => handleUpdate({ responseTone: tone })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                  config.responseTone === tone
                    ? 'border-brand-violet bg-brand-violet/10 text-brand-violet font-bold'
                    : 'border-border bg-surface-subtle text-foreground-muted hover:text-foreground'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Confidence Threshold Slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-foreground">
              Autonomous Confidence Threshold
            </label>
            <span className="text-xs font-bold text-brand-violet">
              {config.confidenceThreshold}%
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="98"
            value={config.confidenceThreshold}
            onChange={(e) => handleUpdate({ confidenceThreshold: Number(e.target.value) })}
            className="w-full accent-brand-violet cursor-pointer"
          />
          <p className="text-[11px] text-foreground-muted mt-1">
            Queries with model confidence above {config.confidenceThreshold}% can be auto-resolved
            without agent intervention.
          </p>
        </div>
      </div>

      {/* 4. Human Review Preferences */}
      <AiHumanReviewCard config={config} onUpdate={handleUpdate} />
    </div>
  );
};
