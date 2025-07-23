"use client";

import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import TaskBoard, { scrollToColumn } from '@/components/tasks/TaskBoard';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import React, { useState, useEffect } from 'react';
import { taskBoardColumns as initialTaskBoardColumns } from '@/lib/mock-data';
import type { TaskColumnData, Task } from '@/types';
import UserOnboardingModal from '@/components/UserOnboardingModal';

const LOCAL_STORAGE_KEY = 'taskBoardState';

export default function DashboardPage() {
  const [boardColumns, setBoardColumns] = useState<TaskColumnData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<{ nickname: string; profilePic?: string } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

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

  useEffect(() => {
    const savedUser = localStorage.getItem('taskUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const handleUserSubmit = (nickname: string, profilePic?: string) => {
    const userData = { nickname, profilePic };
    localStorage.setItem('taskUser', JSON.stringify(userData));
    setUser(userData);
    setShowOnboarding(false);
  };

  // Compute counts
  const allTasks = boardColumns.flatMap(col => col.tasks);
  const todoCount = boardColumns.find(col => col.title === 'To do')?.tasks.length || 0;
  const inProgressCount = boardColumns.find(col => col.title === 'In progress')?.tasks.length || 0;
  const doneCount = boardColumns.find(col => col.title === 'Done')?.tasks.length || 0;
  const allCount = todoCount + inProgressCount;

  return (
    <SidebarProvider defaultOpen={true}>
      {showOnboarding && (
        <UserOnboardingModal onSubmit={handleUserSubmit} />
      )}
      <AppSidebar
        allCount={allCount}
        todoCount={todoCount}
        inProgressCount={inProgressCount}
        doneCount={doneCount}
      />
      <SidebarInset>
        <AppHeader user={user} />
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
