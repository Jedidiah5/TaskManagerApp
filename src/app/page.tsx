"use client";

import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import React, { useState, useEffect } from 'react';
import { taskBoardColumns as initialTaskBoardColumns } from '@/lib/mock-data';
import type { TaskColumnData, Task } from '@/types';

const LOCAL_STORAGE_KEY = 'taskBoardState';

export default function DashboardPage() {
  const [boardColumns, setBoardColumns] = useState<TaskColumnData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        setBoardColumns(JSON.parse(savedState));
      } else {
        setBoardColumns(JSON.parse(JSON.stringify(initialTaskBoardColumns)));
      }
    } catch (error) {
      setBoardColumns(JSON.parse(JSON.stringify(initialTaskBoardColumns)));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(boardColumns));
      } catch (error) {}
    }
  }, [boardColumns, isInitialized]);

  // Compute counts
  const allTasks = boardColumns.flatMap(col => col.tasks);
  const todoCount = boardColumns.find(col => col.title === 'To do')?.tasks.length || 0;
  const inProgressCount = boardColumns.find(col => col.title === 'In progress')?.tasks.length || 0;
  const doneCount = boardColumns.find(col => col.title === 'Done')?.tasks.length || 0;
  const allCount = todoCount + inProgressCount;

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        allCount={allCount}
        todoCount={todoCount}
        inProgressCount={inProgressCount}
        doneCount={doneCount}
      />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6">
          <TaskBoard
            boardColumns={boardColumns}
            setBoardColumns={setBoardColumns}
            isInitialized={isInitialized}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
