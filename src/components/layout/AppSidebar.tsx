
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { taskNavItems, mainNavItemsTop, mainNavItemsBottom } from '@/lib/mock-data';
import type { NavItem } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { scrollToColumn } from '@/components/tasks/TaskBoard';
import { useSidebar } from '@/components/ui/sidebar';

const getIcon = (name?: keyof typeof LucideIcons): React.ElementType | null => {
  if (!name) return null;
  const IconComponent = LucideIcons[name] as LucideIcons.LucideIcon;
  return IconComponent || null;
};

export function AppSidebar({ allCount = 0, todoCount = 0, inProgressCount = 0, doneCount = 0 }) {
  const pathname = usePathname();
  const isLinkActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const [showCalendar, setShowCalendar] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [reminderTasks, setReminderTasks] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsNickname, setSettingsNickname] = useState('');
  const [settingsProfilePic, setSettingsProfilePic] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const { theme, setTheme } = useTheme();
  const { isMobile, toggleSidebar } = useSidebar();

  useEffect(() => {
    if (showReminders) {
      // Load tasks with due dates from localStorage
      const saved = localStorage.getItem('taskBoardState');
      if (saved) {
        try {
          const boardColumns = JSON.parse(saved);
          const tasksWithDates = boardColumns
            .flatMap(col => col.tasks)
            .filter(task => task.dueDate && task.dueDate !== 'Not set');
          setReminderTasks(tasksWithDates);
        } catch {}
      }
    }
  }, [showReminders]);

  useEffect(() => {
    if (showSettings) {
      const savedUser = localStorage.getItem('taskUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setSettingsNickname(user.nickname || '');
        setSettingsProfilePic(user.profilePic || '');
      }
    }
  }, [showSettings]);

  const handleSettingsPicChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettingsProfilePic(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingsSave = (e) => {
    e.preventDefault();
    if (!settingsNickname.trim()) {
      setSettingsError('Nickname is required');
      return;
    }
    const userData = { nickname: settingsNickname.trim(), profilePic: settingsProfilePic };
    localStorage.setItem('taskUser', JSON.stringify(userData));
    setShowSettings(false);
    window.location.reload(); // reload to update header/avatar
  };

  // Move dynamicTaskNavItems definition here
  const dynamicTaskNavItems = [
    { href: "/tasks/all", label: "All tasks", count: allCount, type: 'task' },
    { href: "/tasks/todo", label: "To do", count: todoCount, type: 'task' },
    { href: "/tasks/inprogress", label: "In progress", count: inProgressCount, type: 'task' },
    { href: "/tasks/done", label: "Done", count: doneCount, type: 'task' },
  ];

  const renderNavItem = (item: NavItem, isSubItem = false) => {
    const isActive = item.active || isLinkActive(item.href);

    let iconElement: React.ReactNode = null;
    if (item.imagePath) {
      iconElement = <Image src={item.imagePath} alt={item.label} width={20} height={20} className="h-5 w-5 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />;
    } else if (item.iconName) {
      const IconComponent = getIcon(item.iconName);
      if (IconComponent) {
        iconElement = <IconComponent />;
      }
    } else if (item.icon) {
      const DirectIcon = item.icon;
      iconElement = <DirectIcon />;
    }
    
    const buttonContent = (
      <>
        {iconElement}
        <span>{item.label}</span>
        {item.count !== undefined && !isSubItem && (
          <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
        )}
      </>
    );
    
    const subButtonContent = (
      <span className="flex items-center justify-between w-full">
        <span>{item.label}</span>
        {item.count !== undefined && (
           <SidebarMenuBadge
            className={cn(
              isActive && item.type === 'task' ? 
              "bg-sidebar-active-foreground text-sidebar-active-background" : 
              "bg-sidebar-muted-foreground/30 text-sidebar-foreground group-hover/menu-item:bg-sidebar-accent group-hover/menu-item:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:bg-sidebar-active-foreground peer-data-[active=true]/menu-button:text-sidebar-active-background"
            )}
          >
            {item.count}
          </SidebarMenuBadge>
        )}
      </span>
    );

    if (item.label === 'Calendar') {
      return (
        <SidebarMenuItem key={item.href}>
          <button
            type="button"
            onClick={() => setShowCalendar(true)}
            className={cn(
              'flex items-center gap-2 w-full px-2 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isActive ? '!bg-sidebar-active-background !text-sidebar-active-foreground' : ''
            )}
          >
            {iconElement}
            <span>{item.label}</span>
          </button>
        </SidebarMenuItem>
      );
    }

    if (item.label === 'Reminders') {
      return (
        <SidebarMenuItem key={item.href}>
          <button
            type="button"
            onClick={() => setShowReminders(true)}
            className={cn(
              'flex items-center gap-2 w-full px-2 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isActive ? '!bg-sidebar-active-background !text-sidebar-active-foreground' : ''
            )}
          >
            {iconElement}
            <span>{item.label}</span>
          </button>
        </SidebarMenuItem>
      );
    }

    if (item.label === 'Settings') {
      return (
        <SidebarMenuItem key={item.href}>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className={cn(
              'flex items-center gap-2 w-full px-2 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isActive ? '!bg-sidebar-active-background !text-sidebar-active-foreground' : ''
            )}
          >
            {iconElement}
            <span>{item.label}</span>
          </button>
        </SidebarMenuItem>
      );
    }

    if (item.label === 'All tasks' || item.label === 'To do' || item.label === 'In progress' || item.label === 'Done') {
      return (
        <SidebarMenuSubItem key={item.label} className="py-0.5">
          <button
            type="button"
            onClick={() => {
              if (isMobile) {
                let id = '';
                if (item.label === 'All tasks') id = 'todo'; // Scroll to first column for 'All tasks'
                else if (item.label === 'To do') id = 'todo';
                else if (item.label === 'In progress') id = 'inprogress';
                else if (item.label === 'Done') id = 'done';
                if (id) {
                  scrollToColumn(id);
                  toggleSidebar();
                }
              }
            }}
            className={cn(
              'flex items-center justify-between w-full h-8 text-sm rounded-md',
              isLinkActive(item.href) ? 'bg-sidebar-active-background text-sidebar-active-foreground font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              !isMobile && 'cursor-default'
            )}
            disabled={!isMobile}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <SidebarMenuBadge
                className={cn(
                  isLinkActive(item.href) && item.type === 'task' ?
                    'bg-sidebar-active-foreground text-sidebar-active-background' :
                    'bg-sidebar-muted-foreground/30 text-sidebar-foreground group-hover/menu-item:bg-sidebar-accent group-hover/menu-item:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:bg-sidebar-active-foreground peer-data-[active=true]/menu-button:text-sidebar-active-background'
                )}
              >
                {item.count}
              </SidebarMenuBadge>
            )}
          </button>
        </SidebarMenuSubItem>
      );
    }

    if (isSubItem) {
      return (
        <SidebarMenuSubItem key={item.label} className="py-0.5">
          <Link href={item.href} asChild>
            <SidebarMenuSubButton
              isActive={isActive}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "h-8 text-sm rounded-md",
                isActive ? 
                  "bg-sidebar-active-background text-sidebar-active-foreground font-medium" : 
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {subButtonContent}
            </SidebarMenuSubButton>
          </Link>
        </SidebarMenuSubItem>
      );
    }

    return (
      <SidebarMenuItem key={item.href}>
        <Link href={item.href} asChild>
          <SidebarMenuButton
            isActive={isActive}
            aria-current={isActive ? "page" : undefined}
            tooltip={item.label}
            className={cn(
              isActive ? "!bg-sidebar-active-background !text-sidebar-active-foreground group-data-[collapsible=icon]:!text-sidebar-active-icon-foreground" : ""
            )}
          >
            {buttonContent}
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  };


  return (
    <>
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <SidebarHeader className="px-4 py-3.5 border-b border-sidebar-border group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <Link href="/" className="flex items-center gap-2.5 text-sidebar-foreground group-data-[collapsible=icon]:justify-center">
            <Image src="/favicon.ico" alt="TaskManager Logo" width={28} height={28} className="h-7 w-7 rounded-md group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden text-sidebar-foreground">TaskManager</span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="py-3 px-2.5 space-y-1 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:space-y-2">
          <SidebarMenu>
            {mainNavItemsTop.map(item => renderNavItem(item))}

            <Accordion type="multiple" defaultValue={["tasks"]} className="w-full group-data-[collapsible=icon]:hidden">
              <AccordionItem value="tasks" className="border-none">
                <AccordionTrigger className="p-2 h-10 rounded-md text-sm font-medium text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline data-[state=open]:bg-sidebar-accent [&[data-state=open]>svg]:text-sidebar-accent-foreground">
                  <div className="flex items-center gap-3">
                    <LucideIcons.ListChecks className="h-5 w-5" />
                    <span>Tasks</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <SidebarMenuSub className="ml-0 pl-0 border-l-0">
                    {dynamicTaskNavItems.map(subItem => renderNavItem(subItem, true))}
                  </SidebarMenuSub>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
              <div className="hidden group-data-[collapsible=icon]:flex flex-col space-y-2">
                   <Link href="/tasks/all" asChild>
                      <SidebarMenuButton tooltip="Tasks" isActive={pathname.startsWith('/tasks')}
                          className={cn(pathname.startsWith('/tasks') ? "!bg-sidebar-active-background !text-sidebar-active-icon-foreground" : "")}
                      >
                          <LucideIcons.ListChecks />
                      </SidebarMenuButton>
                   </Link>
              </div>

            {mainNavItemsBottom.map(item => renderNavItem(item))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-3 border-t border-sidebar-border space-y-2 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:space-y-1">
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowCalendar(false)}>
          <div className="bg-card rounded-xl shadow-2xl p-6 relative" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-lg text-muted-foreground hover:text-primary"
              onClick={() => setShowCalendar(false)}
              aria-label="Close calendar"
            >
              &times;
            </button>
            <Calendar />
          </div>
        </div>
      )}
      {showReminders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowReminders(false)}>
          <div className="bg-card rounded-xl shadow-2xl p-6 relative w-full max-w-md" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-lg text-muted-foreground hover:text-primary"
              onClick={() => setShowReminders(false)}
              aria-label="Close reminders"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Reminders</h2>
            {reminderTasks.length === 0 ? (
              <div className="text-muted-foreground text-center">No tasks with reminders.</div>
            ) : (
              <ul className="space-y-3">
                {reminderTasks.map(task => (
                  <li key={task.id} className="flex flex-col bg-muted/30 rounded p-3">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-sm text-muted-foreground">Due: {task.dueDate}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowSettings(false)}>
          <form onSubmit={handleSettingsSave} className="bg-card rounded-xl shadow-2xl p-8 relative w-full max-w-sm flex flex-col gap-5 border border-border" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-lg text-muted-foreground hover:text-primary"
              onClick={() => setShowSettings(false)}
              aria-label="Close settings"
              type="button"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">Settings</h2>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-medium">Theme</label>
              <div className="flex gap-3">
                <button type="button" className={cn('px-3 py-1 rounded', theme === 'light' ? 'bg-primary text-white' : 'bg-muted')} onClick={() => setTheme('light')}>Light</button>
                <button type="button" className={cn('px-3 py-1 rounded', theme === 'dark' ? 'bg-primary text-white' : 'bg-muted')} onClick={() => setTheme('dark')}>Dark</button>
              </div>
            </div>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Nickname <span className="text-red-500">*</span></span>
              <input
                type="text"
                value={settingsNickname}
                onChange={e => setSettingsNickname(e.target.value)}
                className="border border-border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your nickname"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Profile Picture (optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleSettingsPicChange}
                className="file:bg-primary file:text-white file:rounded file:px-3 file:py-1 file:border-0 file:mr-2"
              />
              {settingsProfilePic && (
                <img src={settingsProfilePic} alt="Preview" className="w-16 h-16 rounded-full mt-2 object-cover border-2 border-primary mx-auto" />
              )}
            </label>
            {settingsError && <div className="text-red-500 text-sm text-center">{settingsError}</div>}
            <button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded px-4 py-2 mt-2 font-semibold transition-colors">Save</button>
          </form>
        </div>
      )}
    </>
  );
}
