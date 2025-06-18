
"use client";

import React, { useState, useEffect } from 'react';
import { TaskColumn } from './TaskColumn';
import { taskBoardColumns as initialTaskBoardColumns } from '@/lib/mock-data';
import type { TaskColumnData, Task, NewTaskFormData } from '@/types';

export function TaskBoard() {
  const [boardColumns, setBoardColumns] = useState<TaskColumnData[]>([]);

  useEffect(() => {
    setBoardColumns(initialTaskBoardColumns);
  }, []);

  const handleAddTask = (newTaskData: NewTaskFormData) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: newTaskData.title,
      subtitle: newTaskData.subtitle || '',
      status: newTaskData.status,
      progressCurrent: 0,
      progressTotal: 5, 
      dueDate: 'Not set', 
      assignees: [], 
      commentsCount: 0, 
      attachmentsCount: 0, 
      projectId: 'defaultProj', 
    };

    setBoardColumns(prevColumns => {
      return prevColumns.map(column => {
        if (column.title === newTask.status) {
          return {
            ...column,
            tasks: [...column.tasks, newTask],
          };
        }
        return column;
      });
    });
  };

  if (boardColumns.length === 0 && initialTaskBoardColumns.length > 0) {
     // This helps prevent showing "Loading..." if mock data is available but state hasn't caught up yet.
     // Still, it's good to handle the truly empty/initial state.
    return <div className="text-center p-8 text-muted-foreground">Initializing task board...</div>;
  }
  
  if (boardColumns.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">No columns to display.</div>;
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
      {boardColumns.map(column => (
        <TaskColumn key={column.id} column={column} onTaskAdd={handleAddTask} />
      ))}
    </div>
  );
}
