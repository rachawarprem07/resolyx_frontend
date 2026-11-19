import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LoginBackground } from '../components/LoginBackground';
import { ResolvaSupportBrand } from '../components/ResolvaSupportBrand';
import { LoginFormCard } from '../components/LoginFormCard';
import { validateLoginForm } from '../schemas/authValidation';
import { setAuthenticatedUser, type AppUserRole } from '@/lib/authSession';
import { loginApi, getSetupStatusApi } from '@/lib/apiClient';
import type { LoginFormValues, FormErrors } from '../types/auth.types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<LoginFormValues>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors<LoginFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);
  const [isSetupRequired, setIsSetupRequired] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkSetup() {
      try {
        const res = await getSetupStatusApi();
        if (isMounted && res.is_setup_required) {
          setIsSetupRequired(true);
        }
      } catch {
        // ignore offline or uninitialized
      }
    }
    checkSetup();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange =
    (field: keyof LoginFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'rememberMe' ? e.target.checked : e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (submitNotice) {
        setSubmitNotice(null);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitNotice(null);

    const validationErrors = validateLoginForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // 1. Authenticate against PostgreSQL backend via /api/v1/auth/login
      const result = await loginApi({
        email: values.email.trim(),
        password: values.password,
      });

      // 2. Set authenticated session with real user and token
      const userRole = (result.user.role?.toLowerCase() || 'admin') as AppUserRole;
      setAuthenticatedUser(
        {
          email: result.user.email,
          name: result.user.full_name || undefined,
          role: userRole,
        },
        result.access_token
      );

      // 3. Navigate to destination route based on role
      const rLower = (result.user.role || '').toLowerCase();
      if (rLower === 'customer') {
        navigate('/customer');
      } else if (rLower === 'agent' || rLower === 'support_agent') {
        navigate('/agent');
      } else {
        // admin and team_lead navigate to /admin console
        navigate('/admin');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Invalid email or password';
      setSubmitNotice(msg);
      setErrors({
        password: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    setSubmitNotice('Google SSO is not enabled in local development mode.');
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center p-4 overflow-y-auto sm:overflow-hidden">
      <LoginBackground />

      {/* Top Controls */}
      <div className="absolute top-4 left-4 sm:top-5 sm:left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Resolyx</span>
        </Link>
      </div>

      <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Center Authentication Card */}
      <main className="w-full flex flex-col items-center justify-center z-10 py-2">
        <ResolvaSupportBrand />

        {isSetupRequired && (
          <div className="w-full max-w-[440px] mb-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-brand-indigo/15 via-brand-violet/10 to-brand-indigo/10 border border-brand-indigo/30 shadow-sm flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="h-4 w-4 text-brand-indigo shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-foreground">First-Time Setup Required</p>
                <p className="text-[11px] text-foreground-muted truncate">No company workspace or super admin configured yet.</p>
              </div>
            </div>
            <Link
              to="/setup"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-indigo text-white font-semibold text-[11px] shrink-0 hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Setup Now</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        <LoginFormCard
          values={values}
          errors={errors}
          isSubmitting={isSubmitting}
          submitNotice={submitNotice}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onGoogleSignIn={handleGoogleSignIn}
        />
      </main>

      {/* Footer */}
      <footer className="absolute bottom-2.5 sm:bottom-3 text-center text-[11px] text-slate-400 dark:text-slate-500 z-10 hidden sm:block">
        &copy; {new Date().getFullYear()} Resolyx AI Inc. All rights reserved.
      </footer>
    </div>
  );
};
