import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  DollarSign,
  Globe,
  User,
  Mail,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { BRAND_ASSET_PATHS, PRODUCT_NAME } from '@/lib/constants';
import { getSetupStatusApi, setupWorkspaceApi } from '@/lib/apiClient';
import { setAuthenticatedUser, setStoredCompany } from '@/lib/authSession';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar (CAD)' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar (AUD)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)' },
  { code: 'SGD', symbol: '$', name: 'Singapore Dollar (SGD)' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)' },
];

const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
];

export const CompanySetupPage: React.FC = () => {
  const navigate = useNavigate();

  // Initial form values
  const [companyName, setCompanyName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  });
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [alreadyConfigured, setAlreadyConfigured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function checkStatus() {
      try {
        const res = await getSetupStatusApi();
        if (isMounted && !res.is_setup_required) {
          setAlreadyConfigured(true);
        }
      } catch {
        // Fallback: allow filling setup if status fails or offline
      } finally {
        if (isMounted) setIsLoadingStatus(false);
      }
    }
    checkStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Basic Validations
    if (!companyName.trim()) {
      setErrorMsg('Please enter your company or workspace name.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Please enter the Super Administrator full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await setupWorkspaceApi({
        company_name: companyName.trim(),
        currency: currency.trim(),
        timezone: timezone.trim(),
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      // Save session credentials
      setAuthenticatedUser(
        {
          email: response.user.email,
          name: response.user.full_name || fullName.trim(),
          role: 'super_admin',
          title: 'Super Administrator',
          department: companyName.trim(),
        },
        response.access_token
      );

      // Save company workspace details
      setStoredCompany({
        id: response.company.id,
        name: response.company.name,
        currency: response.company.currency,
        timezone: response.company.timezone,
      });

      setSuccessMsg('Workspace & Super Admin created successfully! Launching console...');

      setTimeout(() => {
        navigate('/admin');
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Setup failed. Please try again.';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingStatus) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-indigo" />
          <p className="text-sm font-medium text-foreground-muted">Checking workspace status...</p>
        </div>
      </div>
    );
  }

  if (alreadyConfigured) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full p-8 rounded-3xl bg-surface border border-border shadow-elevated text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Workspace Already Initialized</h2>
          <p className="text-xs text-foreground-muted leading-relaxed">
            A company and super administrator have already been created for this instance.
            Please sign in with your credentials to access the console.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-brand-indigo text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Go to Login</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-surface-subtle/60 via-background to-surface-subtle/30 overflow-y-auto">
      {/* Top Navbar */}
      <div className="w-full max-w-2xl flex items-center justify-between pb-6">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-surface border border-border p-1.5 shadow-sm flex items-center justify-center">
            <img src={BRAND_ASSET_PATHS.symbol} alt={PRODUCT_NAME} className="h-full w-full object-contain" />
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-tight text-foreground block">{PRODUCT_NAME}</span>
            <span className="text-[10px] text-brand-indigo font-bold uppercase tracking-wider block">First-Run Setup</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login" className="text-xs font-medium text-foreground-muted hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg">
            Login
          </Link>
        </div>
      </div>

      {/* Main Setup Card */}
      <div className="w-full max-w-2xl rounded-3xl bg-surface border border-border shadow-elevated p-6 sm:p-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 text-xs font-bold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Workspace Setup Wizard</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Company & Super Admin</h1>
          <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
            Welcome! Set up your company details, default currency, and create the primary Super Administrator account to manage your helpdesk.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 animate-bounce" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Company Profile */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-border text-xs font-bold uppercase tracking-wider text-foreground">
              <Building2 className="h-4 w-4 text-brand-indigo" />
              <span>1. Company & Localization Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Company / Organization Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-2.5 h-4 w-4 text-foreground-muted" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corporation, Resolyx Inc"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo transition-all placeholder:text-foreground-muted"
                  />
                </div>
              </div>

              {/* Currency */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Primary Currency <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-2.5 h-4 w-4 text-foreground-muted" />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo transition-all"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Timezone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Operational Timezone
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-2.5 h-4 w-4 text-foreground-muted" />
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo transition-all"
                  >
                    {COMMON_TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Super Admin Account */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border text-xs font-bold uppercase tracking-wider text-foreground">
              <ShieldCheck className="h-4 w-4 text-brand-indigo" />
              <span>2. Super Administrator Account</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-2.5 h-4 w-4 text-foreground-muted" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo transition-all placeholder:text-foreground-muted"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-foreground-muted" />
                  <input
                    type="email"
                    required
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo transition-all placeholder:text-foreground-muted"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-foreground-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo transition-all placeholder:text-foreground-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-2.5 text-foreground-muted hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-foreground-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo transition-all placeholder:text-foreground-muted"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-indigo text-white font-semibold text-sm shadow-md hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Configuring Workspace & Super Admin...</span>
                </>
              ) : (
                <>
                  <span>Create Workspace & Super Admin</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-foreground-muted">
        <p>This setup will create the root Super Administrator account with full platform governance.</p>
      </div>
    </div>
  );
};

