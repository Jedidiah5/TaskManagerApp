
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
    <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="px-4 py-3.5 border-b border-sidebar-border group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
        <Link href="/" className="flex items-center gap-2.5 text-sidebar-foreground group-data-[collapsible=icon]:justify-center">
          <Image src="/favicon.ico" alt="TaskMaster Logo" width={28} height={28} className="h-7 w-7 rounded-md group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden text-sidebar-foreground">TaskMaster</span>
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
  );
}
