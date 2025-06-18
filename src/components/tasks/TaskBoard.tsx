
"use client";

import React, { useState, useEffect } from 'react';
import { TaskColumn } from './TaskColumn';
import { taskBoardColumns as initialTaskBoardColumns } from '@/lib/mock-data';
import type { TaskColumnData, Task, NewTaskFormData } from '@/types';

export function TaskBoard() {
  const [boardColumns, setBoardColumns] = useState<TaskColumnData[]>([]);

  useEffect(() => {
    // Initialize with a deep copy to prevent direct mutation issues if initialTaskBoardColumns is used elsewhere
    setBoardColumns(JSON.parse(JSON.stringify(initialTaskBoardColumns)));
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

  const handleDeleteTask = (taskId: string) => {
    setBoardColumns(prevColumns => {
      return prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId),
      }));
    });
  };

  const handleTaskDrop = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    if (sourceColumnId === targetColumnId) {
      // Handle reordering within the same column if needed in the future
      return;
    }

    let draggedTask: Task | undefined;
    let targetColumnTitle: TaskColumnData['title'] | undefined;

    // Create a new state array for modification
    let newBoardColumns = [...boardColumns];

    // Find and remove task from source column
    const sourceColIndex = newBoardColumns.findIndex(col => col.id === sourceColumnId);
    if (sourceColIndex > -1) {
      draggedTask = newBoardColumns[sourceColIndex].tasks.find(t => t.id === taskId);
      if (draggedTask) {
        newBoardColumns[sourceColIndex] = {
          ...newBoardColumns[sourceColIndex],
          tasks: newBoardColumns[sourceColIndex].tasks.filter(t => t.id !== taskId),
        };
      }
    }

    if (!draggedTask) {
      console.error("Dragged task not found or source column incorrect.");
      return;
    }

    // Find target column and add task
    const targetColIndex = newBoardColumns.findIndex(col => col.id === targetColumnId);
    if (targetColIndex > -1) {
      targetColumnTitle = newBoardColumns[targetColIndex].title;
      const updatedTask = { ...draggedTask, status: targetColumnTitle }; // Update task status
      newBoardColumns[targetColIndex] = {
        ...newBoardColumns[targetColIndex],
        tasks: [...newBoardColumns[targetColIndex].tasks, updatedTask],
      };
    } else {
      console.error("Target column not found.");
      // Optionally, re-add task to source if target is invalid, or handle error
      // For now, if target not found, the task is effectively "lost" from the board in this drop action
      // To be robust, one might re-insert it into the source or provide user feedback.
      // Reverting by re-adding to source:
      if (sourceColIndex > -1) {
         newBoardColumns[sourceColIndex].tasks.push(draggedTask);
      }
      setBoardColumns(newBoardColumns); // Revert to state before trying to add to target
      return;
    }
    
    setBoardColumns(newBoardColumns);
  };


  if (boardColumns.length === 0 && initialTaskBoardColumns.length > 0) {
    // This condition might be hit briefly if initialTaskBoardColumns is fetched async or useEffect is slow
    // Better to check if boardColumns has items or show a generic loading/empty state
    return <div className="text-center p-8 text-muted-foreground">Initializing task board...</div>;
  }
  
  if (boardColumns.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">No columns to display.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
      {boardColumns.map(column => (
        <TaskColumn 
          key={column.id} 
          column={column} 
          onTaskAdd={handleAddTask} 
          onDeleteTask={handleDeleteTask}
          onTaskDrop={handleTaskDrop} 
        />
      ))}
    </div>
  );
}
