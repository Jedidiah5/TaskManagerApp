
import type { Task, TaskColumnData, NavItem } from '@/types';

export const mainNavItemsTop: NavItem[] = [
  { href: "/", label: "Dashboard", imagePath: "/favicon.ico" },
];

export const mainNavItemsBottom: NavItem[] = [
    { href: "/messages", label: "Messages", iconName: "MessageSquare" },
    { href: "/calendar", label: "Calendar", iconName: "CalendarDays" },
    { href: "/reminders", label: "Reminders", iconName: "BellRing" },
    { href: "/settings", label: "Settings", iconName: "Settings" },
];

export const taskNavItems: NavItem[] = [
    { href: "/tasks/all", label: "All tasks", count: 0, type: 'task' },
    { href: "/tasks/todo", label: "To do", count: 0, type: 'task' },
    { href: "/tasks/inprogress", label: "In progress", count: 0, type: 'task' },
    { href: "/tasks/done", label: "Done", count: 0, type: 'task' },
];


const baseTasks: Omit<Task, 'id' | 'status'>[] = [];

export const mockTasks: Task[] = [];

export const taskBoardColumns: TaskColumnData[] = [
  {
    id: 'todo',
    title: 'To do',
    tasks: mockTasks.filter(task => task.status === 'To do'),
  },
  {
    id: 'inprogress',
    title: 'In progress',
    tasks: mockTasks.filter(task => task.status === 'In progress'),
  },
  {
    id: 'done',
    title: 'Done',
    tasks: mockTasks.filter(task => task.status === 'Done'),
  },
];
