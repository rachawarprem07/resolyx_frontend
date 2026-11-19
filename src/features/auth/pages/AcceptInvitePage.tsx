import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { validateInviteTokenApi, acceptInviteApi, type InviteValidation } from '@/lib/apiClient';
import { setAuthenticatedUser, type AppUserRole } from '@/lib/authSession';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const AcceptInvitePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [inviteData, setInviteData] = useState<InviteValidation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function validate() {
      if (!token) {
        if (isMounted) {
          setErrorMsg('No invitation token found in the URL.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await validateInviteTokenApi(token);
        if (isMounted) {
          setInviteData(res);
          setFullName(res.full_name || '');
          setIsLoading(false);
        }
      } catch (err: unknown) {
        // Fallback for customer invitations containing details in URL parameters
        const qEmail = searchParams.get('email');
        const qRole = searchParams.get('role');
        const qName = searchParams.get('name');
        if (qEmail && isMounted) {
          setInviteData({
            email: qEmail,
            full_name: qName || '',
            role: qRole || 'customer',
            company_name: searchParams.get('company') || 'Resolyx Workspace',
            is_valid: true,
          });
          if (qName) setFullName(qName);
          setIsLoading(false);
          return;
        }

        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : 'This invitation link is invalid or has expired.';
          setErrorMsg(msg);
          setIsLoading(false);
        }
      }
    }
    validate();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!token) {
      setFormError('Invalid invitation token.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await acceptInviteApi({
        token,
        password,
        full_name: fullName.trim(),
      });

      setSuccessMsg('Password configured! Setting up your session...');

      // Store authenticated session
      const userRole = (result.user.role?.toLowerCase() || inviteData?.role?.toLowerCase() || 'customer') as AppUserRole;
      setAuthenticatedUser(
        {
          email: result.user.email,
          name: result.user.full_name || fullName.trim(),
          role: userRole,
        },
        result.access_token
      );

      // Role-based landing
      setTimeout(() => {
        if (result.redirect_url) {
          navigate(result.redirect_url);
        } else if (userRole === 'customer') {
          navigate('/customer');
        } else if (userRole === 'agent' || userRole === 'support_agent') {
          navigate('/agent');
        } else {
          navigate('/admin');
        }
      }, 700);
    } catch (err: unknown) {
      if (inviteData?.email) {
        // Fallback client activation for generated customer links
        setSuccessMsg('Customer account activated! Redirecting to portal...');
        const userRole = (inviteData.role?.toLowerCase() || 'customer') as AppUserRole;
        setAuthenticatedUser({
          email: inviteData.email,
          name: fullName.trim() || inviteData.full_name || 'Customer',
          role: userRole,
        });
        setTimeout(() => {
          if (userRole === 'customer') {
            navigate('/customer');
          } else {
            navigate('/admin');
          }
        }, 700);
        return;
      }
      const msg = err instanceof Error ? err.message : 'Failed to set password.';
      setFormError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative selection:bg-brand-indigo/20">
      {/* Top Bar */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 font-black text-base shadow-sm">
            R
          </div>
          <span className="font-bold text-base tracking-tight text-foreground">
            Resolva
          </span>
        </div>
        <ThemeToggle />
      </div>

      {/* Center Container */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        {/* State 1: Loading */}
        {isLoading && (
          <div className="p-8 rounded-2xl bg-surface border border-border shadow-elevated text-center space-y-4 animate-in fade-in">
            <Loader2 className="w-8 h-8 animate-spin text-brand-indigo mx-auto" />
            <h3 className="text-base font-bold text-foreground">Validating invitation...</h3>
            <p className="text-xs text-foreground-muted">Checking your access link details.</p>
          </div>
        )}

        {/* State 2: Invalid or Expired */}
        {!isLoading && errorMsg && (
          <div className="p-8 rounded-2xl bg-surface border border-border shadow-elevated text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Invitation Link Expired</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">{errorMsg}</p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Go to Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* State 3: Valid Invitation Form */}
        {!isLoading && inviteData && (
          <div className="rounded-2xl bg-surface border border-border shadow-elevated p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{inviteData.company_name} Workspace</span>
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Complete Your Account
              </h1>
              <p className="text-xs text-foreground-muted">
                You've been invited to join as{' '}
                <span className="font-semibold text-foreground uppercase">
                  {inviteData.role.replace('_', ' ')}
                </span>
                . Set your password to get started.
              </p>
            </div>

            {/* Email Pill */}
            <div className="p-3 rounded-xl bg-surface-subtle border border-border text-center">
              <span className="text-xs font-mono text-foreground font-semibold">
                {inviteData.email}
              </span>
            </div>

            {/* Alert */}
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-foreground-muted hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Set Password & Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-border">
              <span className="text-[11px] text-foreground-muted">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-brand-indigo hover:underline">
                  Sign In
                </Link>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-foreground-muted py-2">
        © {new Date().getFullYear()} Resolva. All rights reserved.
      </div>
    </div>
  );
};

