import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Info, ShieldAlert, UserPlus } from 'lucide-react';
import { SocialLoginButton } from './SocialLoginButton';
import { LoginPasswordInput } from './LoginPasswordInput';
import { getGeneralSettings, subscribeGeneralSettings, type GeneralSettings } from '@/lib/generalSettings';
import type { LoginFormValues, FormErrors } from '../types/auth.types';

interface LoginFormCardProps {
  values: LoginFormValues;
  errors: FormErrors<LoginFormValues>;
  isSubmitting: boolean;
  submitNotice: string | null;
  onChange: (field: keyof LoginFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
}

export const LoginFormCard: React.FC<LoginFormCardProps> = ({
  values,
  errors,
  isSubmitting,
  submitNotice,
  onChange,
  onSubmit,
  onGoogleSignIn,
}) => {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(() => getGeneralSettings());

  useEffect(() => {
    return subscribeGeneralSettings((updated) => {
      setGeneralSettings(updated);
    });
  }, []);

  return (
    <div className="w-full max-w-[430px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_50px_rgba(30,58,138,0.07)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-5 sm:p-6 md:p-7 text-slate-900 dark:text-white transition-shadow">
      {/* 1. Header */}
      <div className="text-center mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign in to Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
          Enter your credentials to access your support dashboard
        </p>
      </div>

      {/* 2. Main Form */}
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="text-left space-y-1">
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={values.email}
              onChange={onChange('email')}
              disabled={isSubmitting}
              className={`w-full h-10 rounded-xl border bg-white dark:bg-slate-950 pl-10 pr-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.email ? 'border-rose-500 focus:ring-rose-500/30' : 'border-slate-200 dark:border-slate-800 focus:border-brand-indigo focus:ring-brand-indigo/20'
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-rose-500 mt-0.5 font-medium">{errors.email}</p>}
        </div>

        <LoginPasswordInput value={values.password} error={errors.password} disabled={isSubmitting} onChange={onChange('password')} />

        {submitNotice && (
          <div role="status" className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 p-2.5 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
            <Info className="h-4 w-4 shrink-0 mt-0.5" /> <span>{submitNotice}</span>
          </div>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover active:scale-[0.99] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in to Resolyx'}
          </button>
        </div>
      </form>

      {/* 3. Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 dark:text-slate-500 font-medium">or</div>
      </div>

      <SocialLoginButton provider="google" onClick={onGoogleSignIn} disabled={isSubmitting} />

      <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <span>Don't have an account? </span>
        {generalSettings.customerSignupEnabled ? (
          <Link
            to="/signup"
            className="text-brand-indigo hover:underline font-semibold inline-flex items-center gap-1"
          >
            <span>Sign up as Customer</span>
            <UserPlus className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
            <span>Contact your administrator</span>
            <span
              title="Customer self-registration is disabled in General Settings. Only admins can invite customers."
              className="inline-flex items-center text-amber-500 dark:text-amber-400"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
            </span>
          </span>
        )}
        {!generalSettings.customerSignupEnabled && (
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Customer self-registration is disabled
          </div>
        )}
      </div>
    </div>
  );
};
