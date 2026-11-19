import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Bell,
  MessageSquare,
  Mail,
  Grid,
  Settings,
  Users,
  Paperclip,
  Smile,
  Send,
  CheckCircle2,
  MoreHorizontal,
  ChevronDown,
  Plus,
  Bot,
} from 'lucide-react';
import { BrandMark } from '@/components/brand/BrandMark';

export const AutonomousHelpdeskShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'messages' | 'knowledge'>('chat');
  const [isResolved, setIsResolved] = useState<boolean>(true);
  const [smartMode, setSmartMode] = useState<string>('Autonomous');

  return (
    <div className="relative mx-auto w-full max-w-6xl pt-6 select-none">
      {/* Decorative ambient 4-pointed stars matching reference */}
      <div
        className="pointer-events-none absolute -left-8 top-1/4 text-slate-300 dark:text-slate-700 animate-pulse hidden md:block"
        aria-hidden="true"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>
      <div
        className="pointer-events-none absolute -left-12 top-2/3 text-slate-200 dark:text-slate-800 hidden md:block"
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>
      <div
        className="pointer-events-none absolute -right-8 top-1/3 text-slate-300 dark:text-slate-700 animate-pulse hidden md:block"
        aria-hidden="true"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      {/* Main Hardware / Browser Bezel */}
      <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 p-2 sm:p-3.5 shadow-[0_30px_70px_-15px_rgba(15,23,42,0.16)] dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] border border-slate-300/70 dark:border-slate-700/80">
        {/* Inner Screen Canvas */}
        <div className="relative rounded-[1.5rem] sm:rounded-[2rem] bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col min-h-[540px]">
          {/* Main App Header */}
          <div className="flex h-12 items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-4 sm:px-6 bg-white dark:bg-slate-950">
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                Dashboard
              </span>
              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Incoming (12)
                </span>
                <div className="flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-400">
                  <Search className="h-3 w-3" />
                  <span>Search tickets...</span>
                  <kbd className="ml-1 text-[9px] bg-slate-200/80 dark:bg-slate-800 rounded px-1 text-slate-500">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Autonomous AI Active
                </span>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              <div className="relative h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center text-[10px] font-bold">
                JD
                <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-white" />
              </div>
            </div>
          </div>

          {/* App Workspace Body: Sidebar + 3 Columns */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Nav Rail */}
            <div className="w-12 sm:w-14 border-r border-slate-100 dark:border-slate-800/80 flex flex-col items-center py-3.5 gap-4 bg-slate-50/50 dark:bg-slate-900/30">
              <BrandMark size={24} />

              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className={`p-2 rounded-xl transition-all ${
                    activeTab === 'chat'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  aria-label="Support Tickets"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('messages')}
                  className={`p-2 rounded-xl transition-all ${
                    activeTab === 'messages'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  aria-label="Direct Messages"
                >
                  <Mail className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('knowledge')}
                  className={`p-2 rounded-xl transition-all ${
                    activeTab === 'knowledge'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  aria-label="Knowledge Base"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Team Activity"
                >
                  <Users className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-auto">
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-slate-600"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Main Content: 3 Panes */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800/80">
              {/* Column 1: Customer Inquiry Card (4 Cols) */}
              <div className="md:col-span-4 p-4 sm:p-5 flex flex-col justify-between bg-white dark:bg-slate-950">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold text-xs flex items-center justify-center">
                        KS
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                          Karine Smith
                        </h4>
                        <span className="text-[10px] text-slate-400">Yesterday, 09:30 AM</span>
                      </div>
                    </div>
                    <button type="button" className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                      How do I update my billing info?
                    </h5>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      How do I update my billing info? I need to update my company corporate card
                      before the renewal cycle tomorrow.
                    </p>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition"
                      >
                        View message &rarr;
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom message composer preview */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 px-3 py-2 text-xs text-slate-400">
                    <span className="flex-1">Write a message...</span>
                    <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                    <Smile className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Column 2: AI-Generated Response (5 Cols) */}
              <div className="md:col-span-5 p-4 sm:p-5 flex flex-col justify-between bg-slate-50/40 dark:bg-slate-900/20">
                <div>
                  {/* AI Response Header with Smart dropdown & AI Agent badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/80 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        AI-generated response
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setSmartMode((prev) =>
                            prev === 'Autonomous' ? 'Human-in-Loop' : 'Autonomous',
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
                      >
                        <span>{smartMode}</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 text-white px-2 py-0.5 text-[10px] font-semibold tracking-wide">
                        <Bot className="h-2.5 w-2.5" /> AI Agent
                      </span>
                    </div>
                  </div>

                  {/* Classification Tags */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                      Categorized &bull; Billing &amp; Invoices
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:text-indigo-400">
                      Autoresponse
                    </span>
                  </div>

                  {/* AI Draft Bubble */}
                  <div className="mt-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 shadow-sm">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-indigo-500" /> Automated response draft
                      </span>
                      <span>2h ago</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      Hello Karine, you can update your billing info directly in your workspace.
                      Navigate to <strong>Account Settings &rarr; Billing &amp; Invoices</strong>,
                      select <em>Edit Payment Method</em>, and input your new corporate card. Your
                      upcoming subscription will automatically apply to the updated method.
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        View response logs &rarr;
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">99.2% match</span>
                    </div>
                  </div>

                  {/* Auto-Resolved Status Pill Banner */}
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setIsResolved((prev) => !prev)}
                      className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                        isResolved
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2
                          className={`h-3.5 w-3.5 ${
                            isResolved
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        />
                        <span>{isResolved ? 'Auto-Resolved' : 'Pending Verification'}</span>
                        <span className="text-[11px] opacity-80 hidden sm:inline">
                          &bull; In ticket resolution pool
                        </span>
                      </div>
                      <span className="text-[10px] font-mono">
                        {isResolved ? '14s avg' : 'awaiting agent'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Bottom reply field */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-400 shadow-sm">
                    <span className="flex-1">Write a message...</span>
                    <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                    <button
                      type="button"
                      className="h-6 w-6 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center hover:scale-105 transition"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 3: Team Network & Activity (3 Cols) */}
              <div className="md:col-span-3 p-4 sm:p-5 flex flex-col justify-between bg-white dark:bg-slate-950">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      Team network
                    </span>
                    <button type="button" className="text-slate-400 hover:text-slate-600 text-xs">
                      &times;
                    </button>
                  </div>

                  {/* Team Activity Feed */}
                  <div className="mt-3.5 space-y-3">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                      Team activity
                    </span>

                    <div className="flex items-start gap-2.5">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                        TD
                      </div>
                      <div className="text-[11px] leading-tight">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          Team Dana{' '}
                          <span className="text-slate-400 font-normal">&bull; 3d ago</span>
                        </p>
                        <p className="text-slate-500 text-[10px] mt-0.5">Celebration team feed.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                        AA
                      </div>
                      <div className="text-[11px] leading-tight">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          Alain Anderson{' '}
                          <span className="text-slate-400 font-normal">&bull; 2d ago</span>
                        </p>
                        <p className="text-slate-500 text-[10px] mt-0.5">
                          Activity in escalations.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="h-6 w-6 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                        TD
                      </div>
                      <div className="text-[11px] leading-tight">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          Team Dutch{' '}
                          <span className="text-slate-400 font-normal">&bull; 3d ago</span>
                        </p>
                        <p className="text-slate-500 text-[10px] mt-0.5">
                          Automations tested for accuracy.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                        MS
                      </div>
                      <div className="text-[11px] leading-tight">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          Maxim Smith{' '}
                          <span className="text-slate-400 font-normal">&bull; 1h ago</span>
                        </p>
                        <p className="text-slate-500 text-[10px] mt-0.5">Pending for approval.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom plus button */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    className="h-7 w-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow hover:scale-105 transition"
                    aria-label="Add team member"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Card 1: Bottom Left Resolution Rates Bar Chart */}
        <div className="absolute -bottom-8 -left-4 sm:-bottom-10 sm:-left-6 z-20 w-56 sm:w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Resolution rates
            </span>
            <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Bar Chart Visualization */}
          <div className="flex items-end justify-between h-20 pt-2 px-1">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-2.5 rounded-full bg-indigo-500 h-9 transition-all" />
              <span className="text-[9px] font-medium text-slate-400">Jan</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-2.5 rounded-full bg-sky-400 h-12 transition-all" />
              <span className="text-[9px] font-medium text-slate-400">Feb</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-2.5 rounded-full bg-amber-400 h-7 transition-all" />
              <span className="text-[9px] font-medium text-slate-400">Mar</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-2.5 rounded-full bg-rose-400 h-14 transition-all" />
              <span className="text-[9px] font-medium text-slate-400">Apr</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-2.5 rounded-full bg-emerald-400 h-16 transition-all" />
              <span className="text-[9px] font-medium text-slate-400">May</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-2.5 rounded-full bg-violet-500 h-11 transition-all" />
              <span className="text-[9px] font-medium text-slate-400">Jun</span>
            </div>
          </div>
        </div>

        {/* Floating Card 2: Right Resolution Rates + Circular Gauge */}
        <div className="absolute top-1/4 -right-4 sm:-right-8 z-20 hidden sm:block w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Resolution rates
            </span>
            <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Days Mini Bar Chart */}
            <div className="flex items-end gap-1.5 h-16">
              <div className="w-2 rounded-full bg-emerald-400 h-8" title="Sun" />
              <div className="w-2 rounded-full bg-indigo-500 h-14" title="Mon" />
              <div className="w-2 rounded-full bg-sky-400 h-10" title="Wed" />
              <div className="w-2 rounded-full bg-violet-500 h-16" title="Thu" />
              <div className="w-2 rounded-full bg-emerald-500 h-12" title="Nov" />
            </div>

            {/* Circular Gauge 66% */}
            <div className="flex flex-col items-center">
              <div className="relative h-14 w-14 flex items-center justify-center">
                <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-600 dark:text-indigo-400 stroke-current"
                    strokeWidth="3.5"
                    strokeDasharray="66, 100"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-slate-900 dark:text-white">
                  66%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 font-medium">Resolution rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
