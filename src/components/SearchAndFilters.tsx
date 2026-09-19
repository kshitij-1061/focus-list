import React from 'react';
import type { StatusFilter, PriorityFilter } from '../types/task';
import { Search, X, Filter } from 'lucide-react';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  priorityFilter: PriorityFilter;
  onPriorityFilterChange: (priority: PriorityFilter) => void;
  onResetFilters: () => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onResetFilters,
}) => {
  const isFiltered = searchQuery.trim() !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Integrated Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <label htmlFor="search-tasks-input" className="sr-only">
            Search your tasks
          </label>
          <input
            id="search-tasks-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your tasks..."
            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search input"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Toolbar Filter Group */}
        <div className="flex flex-wrap items-center gap-2 max-w-full overflow-x-auto pb-1 md:pb-0">
          {/* Status Tabs */}
          <div
            role="tablist"
            aria-label="Filter tasks by status"
            className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl flex-shrink-0"
          >
            {(['all', 'active', 'completed'] as StatusFilter[]).map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onStatusFilterChange(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer min-h-[32px] ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* Priority Select Filter */}
          <div className="relative flex-shrink-0">
            <label htmlFor="priority-filter-select" className="sr-only">
              Filter by Priority
            </label>
            <div className="relative">
              <select
                id="priority-filter-select"
                value={priorityFilter}
                onChange={(e) => onPriorityFilterChange(e.target.value as PriorityFilter)}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat pr-8 min-h-[36px]"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Priorities</option>
                <option value="high" className="bg-white dark:bg-slate-900 text-red-600 dark:text-red-400">High</option>
                <option value="medium" className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400">Medium</option>
                <option value="low" className="bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400">Low</option>
              </select>
            </div>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 min-h-[36px]"
            >
              <Filter className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
