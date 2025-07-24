
"use client";

import React, { useState, useEffect } from 'react';
import { TaskColumn } from './TaskColumn';
import { TaskFormDialog } from './TaskFormDialog';
import { taskBoardColumns as initialTaskBoardColumns } from '@/lib/mock-data';
import type { TaskColumnData, Task, TaskFormData } from '@/types';
import { Plus } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'taskBoardState';

// Helper to scroll to a column by id
export function scrollToColumn(columnId: string) {
  const el = document.getElementById(columnId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function TaskBoard() {
  const [boardColumns, setBoardColumns] = useState<TaskColumnData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // State for the dialog
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<Task['status']>('To do');

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        setBoardColumns(JSON.parse(savedState));
      } else {
        setBoardColumns(JSON.parse(JSON.stringify(initialTaskBoardColumns)));
      }
    } catch (error) {
      console.error("Failed to parse board state from localStorage", error);
      setBoardColumns(JSON.parse(JSON.stringify(initialTaskBoardColumns)));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(boardColumns));
      } catch (error) {
        console.error("Failed to save board state to localStorage", error);
      }
    }
  }, [boardColumns, isInitialized]);

  const handleOpenFormForAdd = (status: Task['status']) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setIsFormOpen(true);
  };

  const handleOpenFormForEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };
  
  const handleSaveTask = (formData: TaskFormData, taskId?: string) => {
    if (taskId) {
      // Update existing task
      handleUpdateTask(taskId, formData);
    } else {
      // Add new task
      handleAddTask(formData);
    }
  };

  const handleAddTask = (formData: TaskFormData) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: formData.title,
      subtitle: formData.subtitle || '',
      status: formData.status,
      progressCurrent: formData.progressCurrent || 0,
      progressTotal: formData.progressTotal || 5, 
      dueDate: formData.dueDate ? formData.dueDate.toISOString() : 'Not set',
      priority: formData.priority || 'low',
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

  const handleUpdateTask = (taskId: string, formData: TaskFormData) => {
    setBoardColumns(prevColumns => {
      let taskToMove: Task | null = null;
      
      // First, remove the task from its original column and update it
      const newColumns = prevColumns.map(column => {
        const taskIndex = column.tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
          taskToMove = {
            ...column.tasks[taskIndex],
            ...formData,
            dueDate: formData.dueDate ? formData.dueDate.toISOString() : 'Not set',
            progressCurrent: formData.progressCurrent ?? column.tasks[taskIndex].progressCurrent,
            progressTotal: formData.progressTotal ?? column.tasks[taskIndex].progressTotal,
          };
          return {
            ...column,
            tasks: column.tasks.filter(t => t.id !== taskId),
          };
        }
        return column;
      });

      // Then, add the updated task to its new column
      if (taskToMove) {
        const targetColumnIndex = newColumns.findIndex(col => col.title === taskToMove!.status);
        if (targetColumnIndex > -1) {
          newColumns[targetColumnIndex].tasks.push(taskToMove);
        }
      }
      
      return newColumns;
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

  const handleDeleteAllTasks = (columnId: string) => {
    setBoardColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId ? { ...column, tasks: [] } : column
      )
    );
  };

  const handleTaskDrop = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    if (sourceColumnId === targetColumnId) {
      return;
    }
    let draggedTask: Task | undefined;
    let targetColumnTitle: TaskColumnData['title'] | undefined;
    const newBoardColumns = [...boardColumns];
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
    if (!draggedTask) return;
    const targetColIndex = newBoardColumns.findIndex(col => col.id === targetColumnId);
    if (targetColIndex > -1) {
      targetColumnTitle = newBoardColumns[targetColIndex].title;
      let updatedTask = { ...draggedTask, status: targetColumnTitle };
      // If moving to 'In progress', increment progressCurrent by 1 (not exceeding progressTotal)
      if (targetColumnTitle === 'In progress') {
        updatedTask.progressCurrent = Math.min(
          (updatedTask.progressCurrent || 0) + 1,
          updatedTask.progressTotal || 1
        );
      }
      newBoardColumns[targetColIndex] = {
        ...newBoardColumns[targetColIndex],
        tasks: [...newBoardColumns[targetColIndex].tasks, updatedTask],
      };
    } else {
      if (sourceColIndex > -1) {
         newBoardColumns[sourceColIndex].tasks.push(draggedTask);
      }
    }
    setBoardColumns(newBoardColumns);
  };

  if (!isInitialized) {
    return <div className="text-center p-8 text-muted-foreground">Initializing task board...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
        {boardColumns.map(column => (
          <div id={column.id} key={column.id}>
            <TaskColumn 
              column={column} 
              onAddTask={() => handleOpenFormForAdd(column.title)} 
              onEditTask={handleOpenFormForEdit}
              onDeleteTask={handleDeleteTask}
              onTaskDrop={handleTaskDrop}
              onDeleteAllTasks={handleDeleteAllTasks}
            />
          </div>
        ))}
      </div>
      {/* Floating Add Task Button (mobile only) */}
      <button
        type="button"
        className="fixed bottom-6 right-6 z-40 bg-primary text-white rounded-full shadow-lg p-4 md:hidden hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => setIsFormOpen(true)}
        aria-label="Add Task"
      >
        <Plus className="w-6 h-6" />
      </button>
      <TaskFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveTask}
        taskToEdit={editingTask}
        defaultStatus={defaultStatus}
      />
    </>
  );
}
