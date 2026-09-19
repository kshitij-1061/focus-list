import React from 'react';
import type { Theme } from '../types/task';
import type { User } from '../types/user';
import { CheckSquare, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  theme: Theme;
  user: User | null;
  onToggleTheme: () => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  user,
  onToggleTheme,
  onLogout,
  onOpenAuth,
}) => {
  // Extract initials (e.g. John Doe -> JD)
  const userInitials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'FL';

  return (
    <header className="mb-8 pt-2 pb-6 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand & Personal Greeting */}
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 flex items-center justify-center">
            <CheckSquare className="w-7 h-7 stroke-[2.2]" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {user ? `Welcome back, ${user.name}` : 'FocusList'}
              </h1>
              {user && (
                <span className="text-xl" aria-hidden="true">
                  👋
                </span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
              Plan your day. Focus on what matters.
            </p>
          </div>
        </div>

        {/* Right side controls: Theme Toggle, User Avatar & Auth Buttons */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
            )}
          </button>

          {/* User Account / Profile Badge */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                  {userInitials}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-1">Logged In</p>
                </div>
              </div>

              {/* Log Out Button */}
              <button
                type="button"
                onClick={onLogout}
                aria-label="Log out"
                title="Log out of FocusList"
                className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer min-h-[44px]"
            >
              <UserIcon className="w-4 h-4" aria-hidden="true" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
