import { useState, useEffect, useMemo } from 'react';
import type { Task, Priority, StatusFilter, PriorityFilter, TaskStats, Theme } from './types/task';
import type { User } from './types/user';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadThemeFromStorage,
  saveThemeToStorage,
} from './utils/storage';
import { loadUserSession, logoutUserSession } from './utils/auth';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { TaskForm } from './components/TaskForm';
import { SearchAndFilters } from './components/SearchAndFilters';
import { TaskList } from './components/TaskList';
import { ConfirmModal } from './components/ConfirmModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

export function App() {
  const [user, setUser] = useState<User | null>(() => loadUserSession());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => !loadUserSession());
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [theme, setTheme] = useState<Theme>(() => loadThemeFromStorage());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Sync tasks to LocalStorage on mutation
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Sync theme to LocalStorage and root document class
  useEffect(() => {
    saveThemeToStorage(theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth Handlers
  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    logoutUserSession();
    setUser(null);
    setIsAuthModalOpen(true);
  };

  // Master Statistics derived strictly from master dataset
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  // Filtered tasks computation pipeline
  const displayedTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query Filter (Case-insensitive)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        if (!task.title.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter === 'active' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;

      // 3. Priority Filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      return true;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Handler: Add new task
  const handleAddTask = (title: string, priority: Priority) => {
    const newTask: Task = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      priority,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Handler: Toggle Task completion status
  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handler: Edit task title and priority
  const handleEditTask = (id: string, newTitle: string, newPriority: Priority) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, title: newTitle, priority: newPriority }
          : task
      )
    );
  };

  // Handler: Open deletion confirmation modal
  const handleDeleteRequest = (task: Task) => {
    setDeletingTask(task);
  };

  // Handler: Confirm task deletion
  const handleConfirmDelete = () => {
    if (!deletingTask) return;
    setTasks((prev) => prev.filter((task) => task.id !== deletingTask.id));
    setDeletingTask(null);
  };

  // Handler: Reset search and all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      {/* Container with max-width ~1100px */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* App Header with Personal Greeting & Auth Controls */}
        <Header
          theme={theme}
          user={user}
          onToggleTheme={handleToggleTheme}
          onLogout={handleLogout}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Master Statistics Dashboard */}
        <Stats stats={stats} />

        {/* Primary Task Creation Card */}
        <TaskForm onAddTask={handleAddTask} />

        {/* Integrated Search & Filters Toolbar */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          onResetFilters={handleResetFilters}
        />

        {/* Tasks List */}
        <TaskList
          tasks={displayedTasks}
          hasTotalTasks={tasks.length > 0}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleEditTask}
          onDeleteRequest={handleDeleteRequest}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal (Create Account / Sign In matching screenshot design) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onAuthSuccess={handleAuthSuccess}
        onClose={user ? () => setIsAuthModalOpen(false) : undefined}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingTask)}
        title="Delete task?"
        message={
          deletingTask
            ? `This task "${deletingTask.title}" will be permanently removed.`
            : ''
        }
        confirmText="Delete Task"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}

export default App;
