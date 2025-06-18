import type { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  status: 'To do' | 'In progress' | 'Done';
  progressCurrent: number;
  progressTotal: number;
  dueDate: string; // Should be a Date object or ISO string in a real app
  assignees: User[];
  commentsCount: number;
  attachmentsCount: number;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface TaskColumnData {
  id: 'todo' | 'inprogress' | 'done';
  title: 'To do' | 'In progress' | 'Done';
  tasks: Task[];
}

export interface NavItem {
  href: string;
  label: string;
  iconName?: keyof typeof import('lucide-react'); // For dynamic icon loading
  icon?: LucideIcon; // Allow passing icon component directly
  count?: number;
  type?: 'project' | 'task' | 'standard';
  active?: boolean; // To explicitly set active state from mock data if needed
  subItems?: NavItem[]; // For nested accordions, though current design uses direct lists
}
