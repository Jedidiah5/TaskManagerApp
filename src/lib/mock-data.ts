import type { User, Project, Task, TaskColumnData, NavItem } from '@/types';

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
  { href: "/", label: "Dashboard", imagePath: "/app-icon.png" },
  // Projects and Tasks are handled by Accordion directly in AppSidebar
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
    { href: "/tasks/all", label: "All tasks", count: 11, type: 'task' },
    { href: "/tasks/todo", label: "To do", count: 4, type: 'task' },
    { href: "/tasks/inprogress", label: "In progress", count: 4, type: 'task', active: true },
    { href: "/tasks/done", label: "Done", count: 3, type: 'task' },
];


const baseTasks: Omit<Task, 'id' | 'status' | 'projectId'>[] = [
  { 
    title: 'Design new UI presentation', 
    subtitle: 'Dribbble marketing', 
    progressCurrent: 7, 
    progressTotal: 10, 
    dueDate: 'May 20, 2022', 
    assignees: [mockUsers[0], mockUsers[1]], 
    commentsCount: 3, 
    attachmentsCount: 2 
  },
  { 
    title: 'Develop login functionality', 
    subtitle: 'Core feature', 
    progressCurrent: 3, 
    progressTotal: 10, 
    dueDate: 'May 22, 2022', 
    assignees: [mockUsers[2]], 
    commentsCount: 1, 
    attachmentsCount: 0 
  },
];

export const mockTasks: Task[] = [
  { ...baseTasks[0], id: 'task1', status: 'In progress', projectId: 'proj2' },
  { ...baseTasks[1], id: 'task2', status: 'In progress', projectId: 'proj4' },
  { id: 'task3', title: 'Write API documentation', subtitle: 'Developer portal', progressCurrent: 0, progressTotal: 5, dueDate: 'May 25, 2022', assignees: [mockUsers[1], mockUsers[3]], commentsCount: 0, attachmentsCount: 1, status: 'To do', projectId: 'proj4' },
  { id: 'task4', title: 'User testing session', subtitle: 'Feedback collection', progressCurrent: 9, progressTotal: 10, dueDate: 'May 18, 2022', assignees: [mockUsers[0]], commentsCount: 5, attachmentsCount: 3, status: 'In progress', projectId: 'proj2' },
  { id: 'task5', title: 'Deploy to staging server', subtitle: 'Release candidate', progressCurrent: 10, progressTotal: 10, dueDate: 'May 15, 2022', assignees: [mockUsers[2], mockUsers[3]], commentsCount: 2, attachmentsCount: 0, status: 'Done', projectId: 'proj5' },
  { id: 'task6', title: 'Fix critical bug #1024', subtitle: 'Hotfix', progressCurrent: 1, progressTotal: 1, dueDate: 'May 19, 2022', assignees: [mockUsers[1]], commentsCount: 8, attachmentsCount: 0, status: 'To do', projectId: 'proj3' },
  { id: 'task7', title: 'Plan next sprint features', subtitle: 'Product Roadmap', progressCurrent: 5, progressTotal: 8, dueDate: 'May 28, 2022', assignees: [mockUsers[0], mockUsers[2], mockUsers[3]], commentsCount: 4, attachmentsCount: 1, status: 'To do', projectId: 'proj3' },
  { ...baseTasks[0], id: 'task8', title: 'Update branding guidelines', subtitle: 'Marketing Docs', status: 'Done', projectId: 'proj2', progressCurrent: 10, progressTotal: 10 },
  { ...baseTasks[1], id: 'task9', title: 'Research competitor analysis', subtitle: 'Strategy', status: 'To do', projectId: 'proj3', progressCurrent: 1, progressTotal: 5 },
];

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
