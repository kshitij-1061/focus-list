import React, { useState } from 'react';
import type { User } from '../types/user';
import { registerUser, loginUser } from '../utils/auth';
import {
  Sparkles,
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onAuthSuccess: (user: User) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onAuthSuccess,
  onClose,
}) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      const trimmedName = fullName.trim();
      if (!trimmedName) {
        setError('Please enter your full name.');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      if (!agreeTerms) {
        setError('Please agree to the Terms of Service and Privacy Policy.');
        return;
      }

      const res = registerUser(trimmedName, trimmedEmail, password);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else {
        setError(res.error || 'Registration failed.');
      }
    } else {
      // Sign In mode
      const res = loginUser(trimmedEmail, password);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else {
        setError(res.error || 'Login failed.');
      }
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'signup' ? 'login' : 'signup'));
    setError(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="w-full max-w-md bg-gradient-to-b from-blue-50/95 via-sky-50/95 to-slate-100/95 dark:from-slate-900/95 dark:via-slate-900/95 dark:to-slate-950/95 border border-white/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-slate-800 dark:text-slate-100 relative my-8">
        
        {/* Back Button (if dismissible) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Go back"
            className="absolute top-6 left-6 p-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 shadow-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
        )}

        {/* Title Header */}
        <div className="text-center pt-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 dark:text-white tracking-tight">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-600/80 dark:text-blue-400 font-medium mt-1">
            Focus on what matters.
          </p>

          {/* Sparkle Logo Icon Box */}
          <div className="mt-4 mx-auto w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 flex items-center justify-center shadow-lg shadow-blue-500/10 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-8 h-8 stroke-[2.2]" aria-hidden="true" />
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          {/* Full Name Input (Create Account only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-full-name" className="block text-xs font-bold text-blue-900 dark:text-slate-300 mb-1 pl-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="auth-full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Email Address Input */}
          <div>
            <label htmlFor="auth-email" className="block text-xs font-bold text-blue-900 dark:text-slate-300 mb-1 pl-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="auth-password" className="block text-xs font-bold text-blue-900 dark:text-slate-300 mb-1 pl-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-10 py-3 bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input (Create Account only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-confirm-password" className="block text-xs font-bold text-blue-900 dark:text-slate-300 mb-1 pl-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="auth-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-10 py-3 bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
            </div>
          )}

          {/* Terms Checkbox (Create Account only) */}
          {mode === 'signup' && (
            <div className="flex items-start gap-2.5 pt-1 px-1">
              <input
                id="agree-terms-checkbox"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="agree-terms-checkbox" className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-tight">
                I agree to the <span className="font-bold text-blue-800 dark:text-blue-300">Terms of Service</span> and <span className="font-bold text-blue-800 dark:text-blue-300">Privacy Policy</span>
              </label>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full min-h-[48px] py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] cursor-pointer mt-3"
          >
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="text-center pt-2 border-t border-slate-200/60 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer ml-1"
            >
              {mode === 'signup' ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
