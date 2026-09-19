import React, { useState } from 'react';
import type { Priority } from '../types/task';
import { PlusCircle, AlertCircle } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (title: string, priority: Priority) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Task title cannot be empty.');
      return;
    }

    onAddTask(trimmedTitle, priority);
    setTitle('');
    setPriority('medium');
    setError(null);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error && e.target.value.trim()) {
      setError(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
      noValidate
    >
      <label htmlFor="task-title-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        What needs to be done?
      </label>

      <div className="flex flex-col gap-3">
        {/* Title Input */}
        <div className="relative">
          <input
            id="task-title-input"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Write a task..."
            className={`w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-500 focus:ring-red-500/20 dark:focus:ring-red-500/30'
                : 'border-slate-200 dark:border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/20 dark:focus:ring-blue-500/30'
            }`}
          />
        </div>

        {/* Priority Selector & Submit Button Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Priority:</span>
            <div className="relative">
              <label htmlFor="task-priority-select" className="sr-only">
                Priority
              </label>
              <select
                id="task-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat pr-7"
              >
                <option value="high" className="bg-white dark:bg-slate-900 text-red-600 dark:text-red-400">High</option>
                <option value="medium" className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400">Medium</option>
                <option value="low" className="bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400">Low</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" aria-hidden="true" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 mt-2 text-xs font-medium text-red-500 dark:text-red-400 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};
