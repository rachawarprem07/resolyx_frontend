import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AuthInput, AuthInputProps } from './AuthInput';

export interface PasswordInputProps extends Omit<AuthInputProps, 'type' | 'rightElement'> {
  showToggle?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, disabled, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
      setIsVisible((prev) => !prev);
    };

    const toggleButton = showToggle ? (
      <button
        type="button"
        onClick={toggleVisibility}
        disabled={disabled}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        title={isVisible ? 'Hide password' : 'Show password'}
        className="p-1.5 text-foreground-muted hover:text-foreground rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo disabled:opacity-40 cursor-pointer"
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    ) : null;

    return (
      <AuthInput
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        rightElement={toggleButton}
        disabled={disabled}
        {...props}
      />
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
