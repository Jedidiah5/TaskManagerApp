import type { LucideIcon } from 'lucide-react';
import type React from 'react';

export interface Task {
  id:string;
  title: string;
  subtitle: string;
  status: 'To do' | 'In progress' | 'Done';
  progressCurrent: number;
  progressTotal: number;
  dueDate: string; // Should be a Date object or ISO string in a real app
}

export interface TaskColumnData {
  id: 'todo' | 'inprogress' | 'done';
  title: 'To do' | 'In progress' | 'Done';
  tasks: Task[];
}

export interface NavItem {
  href: string;
  label: string;
  iconName?: keyof typeof import('lucide-react');
  icon?: LucideIcon; // For direct component passing
  imagePath?: string; // For using next/image
  count?: number;
  type?: 'project' | 'task' | 'standard';
  active?: boolean;
  subItems?: NavItem[];
}

// Data type for the new task form
export type NewTaskFormData = {
  title: string;
  subtitle?: string;
  status: 'To do' | 'In progress' | 'Done';
};
