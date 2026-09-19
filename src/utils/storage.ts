import type { Task, Priority, Theme } from '../types/task';

const TASKS_STORAGE_KEY = 'focuslist_tasks';
const THEME_STORAGE_KEY = 'focuslist_theme';

const VALID_PRIORITIES: Priority[] = ['high', 'medium', 'low'];

/**
 * Validates whether an unknown object conforms to the Task schema.
 */
function isValidTask(obj: unknown): obj is Task {
  if (typeof obj !== 'object' || obj === null) return false;
  const t = obj as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.priority === 'string' &&
    VALID_PRIORITIES.includes(t.priority as Priority) &&
    typeof t.completed === 'boolean' &&
    typeof t.createdAt === 'number'
  );
}

/**
 * Safely loads tasks from browser LocalStorage.
 */
export function loadTasksFromStorage(): Task[] {
  try {
    const rawData = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!rawData) {
      return [];
    }
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      console.warn('LocalStorage focuslist_tasks content was not an array. Resetting.');
      return [];
    }
    return parsed.filter(isValidTask);
  } catch (error) {
    console.error('Failed to load tasks from LocalStorage:', error);
    return [];
  }
}

/**
 * Persists tasks array to browser LocalStorage.
 */
export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to LocalStorage:', error);
  }
}

/**
 * Loads saved theme from LocalStorage or defaults to system preference.
 */
export function loadThemeFromStorage(): Theme {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Default to system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  } catch (error) {
    console.error('Failed to load theme preference:', error);
    return 'dark';
  }
}

/**
 * Persists theme preference to LocalStorage.
 */
export function saveThemeToStorage(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme preference:', error);
  }
}
