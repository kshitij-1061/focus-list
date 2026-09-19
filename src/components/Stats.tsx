import React from 'react';
import type { TaskStats } from '../types/task';
import { ListTodo, CheckCircle2, Clock } from 'lucide-react';

interface StatsProps {
  stats: TaskStats;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <section aria-label="Task statistics" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {/* Total Tasks Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
        <div>
          <div className="flex items-center gap-1.5">
            <ListTodo className="w-4 h-4 text-blue-500" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Tasks</p>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 group-hover:scale-105 transition-transform origin-left">
            {stats.total}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">All recorded items</p>
        </div>
      </div>

      {/* Completed Tasks Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
        <div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Completed</p>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 group-hover:scale-105 transition-transform origin-left">
            {stats.completed}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
            {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% completed` : '0 tasks finished'}
          </p>
        </div>
      </div>

      {/* Pending Tasks Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
        <div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pending</p>
          </div>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2 group-hover:scale-105 transition-transform origin-left">
            {stats.pending}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Awaiting action</p>
        </div>
      </div>
    </section>
  );
};
