import React from 'react';
import { CheckCircle2, SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  hasTotalTasks: boolean;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasTotalTasks,
  onResetFilters,
}) => {
  if (!hasTotalTasks) {
    return (
      <div className="py-14 px-6 text-center rounded-2xl bg-white dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 my-6 shadow-sm">
        <div className="inline-flex p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 mb-3 shadow-sm">
          <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">You're all caught up!</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xs mx-auto font-medium">
          Create your first task above and start focusing on what matters.
        </p>
      </div>
    );
  }

  return (
    <div className="py-14 px-6 text-center rounded-2xl bg-white dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 my-6 shadow-sm">
      <div className="inline-flex p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 mb-3 shadow-sm">
        <SearchX className="w-8 h-8" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">No matching tasks</h3>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xs mx-auto font-medium">
        Try changing your search query or priority and status filters.
      </p>
      {onResetFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer min-h-[40px]"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
