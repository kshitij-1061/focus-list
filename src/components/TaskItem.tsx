import React, { useState, useEffect, useRef } from 'react';
import type { Task, Priority } from '../types/task';
import { formatRelativeTime } from '../utils/date';
import {
  Check,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowDownCircle,
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEditTask: (id: string, newTitle: string, newPriority: Priority) => void;
  onDeleteRequest: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEditTask,
  onDeleteRequest,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editError, setEditError] = useState<string | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError(null);
  };

  const handleSaveEdit = () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setEditError('Title cannot be empty');
      return;
    }
    onEditTask(task.id, trimmedTitle, editPriority);
    setIsEditing(false);
    setEditError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const priorityBadgeConfig = {
    high: {
      label: 'HIGH',
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
      icon: AlertOctagon,
    },
    medium: {
      label: 'MEDIUM',
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
      icon: AlertTriangle,
    },
    low: {
      label: 'LOW',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
      icon: ArrowDownCircle,
    },
  };

  const priorityInfo = priorityBadgeConfig[task.priority] || priorityBadgeConfig.medium;
  const PriorityIcon = priorityInfo.icon;
  const formattedTime = formatRelativeTime(task.createdAt);

  return (
    <li
      className={`group p-4 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 opacity-75'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {isEditing ? (
        /* Dedicated Edit Mode Card */
        <div className="space-y-4 p-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Edit Task
            </h3>
            <span className="text-[11px] text-slate-400">Press Enter to save, Esc to cancel</span>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor={`edit-task-input-${task.id}`} className="sr-only">
                Task title
              </label>
              <input
                id={`edit-task-input-${task.id}`}
                ref={editInputRef}
                type="text"
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  if (editError && e.target.value.trim()) setEditError(null);
                }}
                onKeyDown={handleKeyDown}
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 ${
                  editError ? 'border-red-500 focus:ring-red-500/20' : 'border-blue-500 focus:ring-blue-500/20'
                }`}
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Priority:</span>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  aria-label="Task priority"
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Cancel</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Save changes</span>
                </button>
              </div>
            </div>
          </div>

          {editError && (
            <div className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
              <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{editError}</span>
            </div>
          )}
        </div>
      ) : (
        /* Normal Display Row Layout */
        <div className="flex items-start sm:items-center justify-between gap-3">
          {/* Checkbox and Title */}
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            <button
              type="button"
              role="checkbox"
              aria-checked={task.completed}
              aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
              onClick={() => onToggleComplete(task.id)}
              className={`mt-0.5 sm:mt-0 flex-shrink-0 w-5.5 h-5.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-h-[22px] min-w-[22px] ${
                task.completed
                  ? 'bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-500 text-white shadow-sm'
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800/60'
              }`}
            >
              {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />}
            </button>

            <div className="min-w-0 flex-1 overflow-hidden">
              <p
                className={`text-base font-extrabold leading-snug break-words transition-all ${
                  task.completed
                    ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                    : 'text-red-700 dark:text-red-400 font-black tracking-wide'
                }`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${priorityInfo.bg}`}
                >
                  <PriorityIcon className="w-3 h-3" aria-hidden="true" />
                  <span>{priorityInfo.label}</span>
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  {task.completed ? 'Completed' : `Created ${formattedTime}`}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleStartEdit}
              aria-label={`Edit task "${task.title}"`}
              className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <Edit2 className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(task)}
              aria-label={`Delete task "${task.title}"`}
              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </li>
  );
};
