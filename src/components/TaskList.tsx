import React from 'react';
import type { Task, Priority } from '../types/task';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  hasTotalTasks: boolean;
  onToggleComplete: (id: string) => void;
  onEditTask: (id: string, newTitle: string, newPriority: Priority) => void;
  onDeleteRequest: (task: Task) => void;
  onResetFilters: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  hasTotalTasks,
  onToggleComplete,
  onEditTask,
  onDeleteRequest,
  onResetFilters,
}) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        hasTotalTasks={hasTotalTasks}
        onResetFilters={onResetFilters}
      />
    );
  }

  // Display newest tasks first
  const sortedTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <ul className="space-y-3" aria-label="Tasks list">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEditTask={onEditTask}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </ul>
  );
};
