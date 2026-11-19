import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface LoginPasswordInputProps {
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * LoginPasswordInput — Renders the password field with lock icon,
 * "Forgot password?" link, and interactive visibility toggle.
 */
export const LoginPasswordInput: React.FC<LoginPasswordInputProps> = ({
  value,
  error,
  disabled = false,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="text-left space-y-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor="password"
          className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Password
        </label>
        <Link
          to="/forgot-password"
          className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline transition-colors"
        >
          Forgot password?
        </Link>
      </div>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full h-10 rounded-xl border bg-white dark:bg-slate-950 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-200 dark:border-slate-800 focus:border-blue-600 focus:ring-blue-600/20'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-rose-500 mt-0.5 font-medium">{error}</p>}
    </div>
  );
};
