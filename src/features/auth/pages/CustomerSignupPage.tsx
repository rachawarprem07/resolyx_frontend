import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  User,
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Loader2,
  KeyRound,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LoginBackground } from '../components/LoginBackground';
import { ResolvaSupportBrand } from '../components/ResolvaSupportBrand';
import { getGeneralSettings, subscribeGeneralSettings, type GeneralSettings } from '@/lib/generalSettings';
import { setAuthenticatedUser } from '@/lib/authSession';
import { customerSignupApi, sendOtpApi, verifyOtpApi } from '@/lib/apiClient';
import type { AdminOrganization, CustomerContact } from '@/features/admin/types/admin.types';

type SignupStep = 'details' | 'otp' | 'password' | 'success';

const CUSTOMERS_STORAGE_KEY = 'resolyx_customers_data';

export const CustomerSignupPage: React.FC = () => {
  const navigate = useNavigate();

  // General Settings Access Control
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(() => getGeneralSettings());

  useEffect(() => {
    return subscribeGeneralSettings((updated) => {
      setGeneralSettings(updated);
    });
  }, []);

  // Flow State
  const [step, setStep] = useState<SignupStep>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Step 1: Name, Email & Company
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Step 2: OTP
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3: Password & Confirm
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // --- STEP 1: Submit Details & Send OTP via SMTP ---
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorNotice('Please enter your full name.');
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorNotice('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      // Dispatches real 6-digit OTP code to customer email via default outgoing SMTP
      await sendOtpApi({
        email: cleanEmail,
        full_name: cleanName,
      });

      setIsLoading(false);
      setStep('otp');
      setResendCooldown(30);
      setOtpValues(['', '', '', '', '', '']);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Failed to send verification code.';
      setErrorNotice(msg);
    }
  };

  // --- STEP 2: Handle OTP Input & Verify via Backend ---
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newValues = [...otpValues];
    newValues[index] = digit;
    setOtpValues(newValues);
    setErrorNotice(null);

    // Auto advance focus
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newValues = [...otpValues];
    for (let i = 0; i < 6; i++) {
      newValues[i] = pasted[i] || '';
    }
    setOtpValues(newValues);
    if (pasted.length === 6) {
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    setIsLoading(true);
    setErrorNotice(null);

    try {
      await sendOtpApi({
        email: cleanEmail,
        full_name: cleanName,
      });
      setIsLoading(false);
      setResendCooldown(30);
      setOtpValues(['', '', '', '', '', '']);
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Failed to resend verification code.';
      setErrorNotice(msg);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    const enteredOtp = otpValues.join('');
    if (enteredOtp.length !== 6) {
      setErrorNotice('Please enter the full 6-digit verification code.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    setIsLoading(true);

    try {
      await verifyOtpApi({
        email: cleanEmail,
        otp_code: enteredOtp,
      });

      setIsLoading(false);
      // OTP Verified successfully! Proceed to password setup
      setStep('password');
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Invalid verification code. Please check your email and try again.';
      setErrorNotice(msg);
    }
  };

  // --- STEP 3: Set Password & Confirm Password ---
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (password.length < 6) {
      setErrorNotice('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorNotice('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const resolvedCompany = companyName.trim() || `${cleanName.split(' ')[0]}'s Organization`;

    try {
      // 1. Attempt backend PostgreSQL signup
      try {
        await customerSignupApi({
          email: cleanEmail,
          password,
          full_name: cleanName,
          company_name: resolvedCompany,
        });
      } catch (backendErr) {
        console.warn('Backend signup error (falling back to client session):', backendErr);
      }

      // 2. Register customer in localStorage Customers Directory for Admin visibility
      try {
        const stored = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
        const existingCustomers: AdminOrganization[] = stored ? JSON.parse(stored) : [];

        const primaryContact: CustomerContact = {
          id: `ct-${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          phone: '+1 (555) 019-2831',
          company: resolvedCompany,
          role: 'Primary Contact',
          openTickets: 0,
          status: 'active',
        };

        const newCustomerOrg: AdminOrganization = {
          id: `org-${Date.now()}`,
          name: resolvedCompany,
          contactEmail: cleanEmail,
          plan: 'Starter',
          usersCount: 1,
          status: 'active',
          createdAt: 'Just now',
          primaryContactName: cleanName,
          primaryContactRole: 'Primary Contact',
          primaryContactPhone: '+1 (555) 019-2831',
          openTickets: 0,
          contacts: [primaryContact],
        };

        // Prepend new customer
        localStorage.setItem(
          CUSTOMERS_STORAGE_KEY,
          JSON.stringify([newCustomerOrg, ...existingCustomers])
        );
      } catch (storageErr) {
        console.error('Failed to update customers storage', storageErr);
      }

      // 3. Establish active authenticated session
      setAuthenticatedUser({
        email: cleanEmail,
        name: cleanName,
        role: 'customer',
        title: 'Customer',
        department: resolvedCompany,
      });

      setStep('success');

      // 4. Redirect into Customer Portal
      setTimeout(() => {
        navigate('/customer');
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setErrorNotice(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-y-auto selection:bg-brand-indigo/20">
      <LoginBackground />

      {/* Top Left: Back link */}
      <div className="absolute top-4 left-4 sm:top-5 sm:left-6 z-20">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>

      {/* Top Right: Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Brand Lockup */}
        <div className="mb-4 sm:mb-6">
          <ResolvaSupportBrand />
        </div>

        {/* --- CASE A: Customer Self-Signup is DISABLED in General Settings --- */}
        {!generalSettings.customerSignupEnabled ? (
          <div className="w-full max-w-[460px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_50px_rgba(30,58,138,0.07)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-7 text-slate-900 dark:text-white text-center space-y-5">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Customer Self-Registration Closed
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Self-signup is currently disabled by your workspace administrator.
                New customers must be invited or added directly by support staff.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-indigo" />
                How to get access:
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Contact your workspace administrator to receive an invitation link sent to your work email.
                Admins can also enable customer self-registration at any time in <strong>Settings &gt; General</strong>.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className="w-full h-10 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          /* --- CASE B: Customer Self-Signup is ENABLED --- */
          <div className="w-full max-w-[460px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_50px_rgba(30,58,138,0.07)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-7 text-slate-900 dark:text-white transition-all">
            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                  step === 'details'
                    ? 'bg-brand-indigo text-white'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                }`}
              >
                <span>1. Details</span>
              </div>
              <div className="w-3 h-0.5 bg-slate-200 dark:bg-slate-800" />
              <div
                className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                  step === 'otp'
                    ? 'bg-brand-indigo text-white'
                    : step === 'password' || step === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <span>2. Verify OTP</span>
              </div>
              <div className="w-3 h-0.5 bg-slate-200 dark:bg-slate-800" />
              <div
                className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                  step === 'password' || step === 'success'
                    ? 'bg-brand-indigo text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <span>3. Password</span>
              </div>
            </div>

            {/* Error Banner */}
            {errorNotice && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorNotice}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 1: Take Name & Email                                  */}
            {/* ========================================================= */}
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Customer Sign Up
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Enter your name and work email to receive a verification OTP
                  </p>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20 transition-all"
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="alex.morgan@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20 transition-all"
                    />
                  </div>
                </div>

                {/* Company Name (Optional) */}
                <div className="space-y-1">
                  <label htmlFor="companyName" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Company / Organization <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="companyName"
                      type="text"
                      placeholder="e.g. Acme Corporation"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover active:scale-[0.99] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                  <span>Already have an account? </span>
                  <Link to="/login" className="text-brand-indigo hover:underline font-semibold">
                    Sign in
                  </Link>
                </div>
              </form>
            )}

            {/* ========================================================= */}
            {/* STEP 2: Ask OTP & Verify OTP                              */}
            {/* ========================================================= */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center mb-3">
                  <div className="mx-auto w-10 h-10 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center mb-2">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Enter Verification Code
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    We sent a 6-digit verification code to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>
                  </p>
                </div>

                {/* 6-Digit Inputs */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 py-2">
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handlePasteOtp}
                      className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20 transition-all"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="hover:text-brand-indigo hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Change Email</span>
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0}
                    onClick={handleResendOtp}
                    className="hover:text-brand-indigo hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 font-semibold text-brand-indigo"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>
                      {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend Code'}
                    </span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover active:scale-[0.99] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Code</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================= */}
            {/* STEP 3: Set Password & Confirm Password                   */}
            {/* ========================================================= */}
            {step === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="text-center mb-3">
                  <div className="mx-auto w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Set Your Password
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Verified as <strong className="text-slate-800 dark:text-slate-200">{email}</strong>. Choose a secure password for your account.
                  </p>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label htmlFor="pass" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    New Password *
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="pass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1">
                  <label htmlFor="confirmPass" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="confirmPass"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-[11px] text-rose-500 font-medium">Passwords do not match</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || password !== confirmPassword || password.length < 6}
                    className="w-full h-10 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover active:scale-[0.99] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Activating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Sign Up &amp; Enter Portal</span>
                        <Sparkles className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================= */}
            {/* STEP 4: Success View                                      */}
            {/* ========================================================= */}
            {step === 'success' && (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Account Created Successfully!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Welcome to Resolyx Support, <strong>{fullName}</strong>.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-brand-indigo font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Redirecting to Customer Portal...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
