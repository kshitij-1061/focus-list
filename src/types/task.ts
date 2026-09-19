export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}

export type StatusFilter = 'all' | 'active' | 'completed';

export type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

export type Theme = 'dark' | 'light';
