
import type { User, Project, Task, TaskColumnData, NavItem } from '@/types';
import * as LucideIcons from 'lucide-react';

export const mockUsers: User[] = [
  { id: 'user1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'user2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'user3', name: 'Charlie Chaplin', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'user4', name: 'Diana Prince', avatarUrl: 'https://placehold.co/40x40.png' },
];

export const mockProjectsData: Project[] = [
  { id: 'proj1', name: 'All projects' },
  { id: 'proj2', name: 'Design system' },
  { id: 'proj3', name: 'User flow' },
  { id: 'proj4', name: 'UX research' },
  { id: 'proj5', name: 'Marketing Campaign Q3' },
  { id: 'proj6', name: 'Mobile App Development' },
];


export const mainNavItemsTop: NavItem[] = [
  { href: "/", label: "Dashboard", imagePath: "/favicon.ico" },
];

export const mainNavItemsBottom: NavItem[] = [
    { href: "/messages", label: "Messages", iconName: "MessageSquare" },
    { href: "/calendar", label: "Calendar", iconName: "CalendarDays" },
    { href: "/reminders", label: "Reminders", iconName: "BellRing" },
    { href: "/settings", label: "Settings", iconName: "Settings" },
];

export const projectNavItems: NavItem[] = [
    { href: "/projects/all", label: "All projects", count: 3, type: 'project'},
    { href: "/projects/design-system", label: "Design system", type: 'project', active: true },
    { href: "/projects/user-flow", label: "User flow", type: 'project' },
    { href: "/projects/ux-research", label: "UX research", type: 'project' },
];

export const taskNavItems: NavItem[] = [
    { href: "/tasks/all", label: "All tasks", count: 0, type: 'task' },
    { href: "/tasks/todo", label: "To do", count: 0, type: 'task' },
    { href: "/tasks/inprogress", label: "In progress", count: 0, type: 'task', active: true },
    { href: "/tasks/done", label: "Done", count: 0, type: 'task' },
];


const baseTasks: Omit<Task, 'id' | 'status' | 'projectId'>[] = [];

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
