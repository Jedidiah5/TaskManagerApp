
import React, { useState } from 'react';
import type { TaskColumnData, Task } from '@/types';
import { TaskCard } from './TaskCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  column: TaskColumnData;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskDrop: (taskId: string, sourceColumnId: string, targetColumnId: string) => void;
  onDeleteAllTasks: (columnId: string) => void;
}

export function TaskColumn({ column, onAddTask, onEditTask, onDeleteTask, onTaskDrop, onDeleteAllTasks }: TaskColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow dropping
    const sourceColumnId = event.dataTransfer.types.includes('sourcecolumnid') ? event.dataTransfer.getData('sourceColumnId') : null;
    if (sourceColumnId && sourceColumnId !== column.id) {
      setIsDragOver(true);
    } else if (!sourceColumnId && event.dataTransfer.types.includes('taskid')) { // dragging from outside or unknown source
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
     // Check if the relatedTarget (where the mouse is going) is outside this droppable element
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
        setIsDragOver(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const taskId = event.dataTransfer.getData('taskId');
    const sourceColumnId = event.dataTransfer.getData('sourceColumnId');
    
    if (taskId && sourceColumnId && sourceColumnId !== column.id) {
      onTaskDrop(taskId, sourceColumnId, column.id);
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col bg-secondary/50 p-4 rounded-lg h-full min-h-[calc(100vh-180px)] transition-all duration-150 ease-in-out",
        isDragOver ? "border-2 border-primary ring-2 ring-primary shadow-lg" : "border-2 border-transparent",
        "mb-6 md:mb-0"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          {column.title} <span className="text-sm font-normal text-muted-foreground">({column.tasks.length})</span>
        </h2>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={onAddTask}>
            <Plus className="h-4 w-4 mr-1" /> Add new task
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            aria-label="Delete all tasks"
            onClick={() => onDeleteAllTasks(column.id)}
            disabled={column.tasks.length === 0}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div 
        className="flex-grow space-y-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent"
      >
        {column.tasks.length === 0 && !isDragOver ? ( // Hide "no tasks" message if dragging over to avoid overlap with placeholder
          <p className="text-sm text-muted-foreground text-center py-4">No tasks in this column yet.</p>
        ) : (
          [...column.tasks].sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }).map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              columnId={column.id}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask} 
            />
          ))
        )}
      </div>
      <Card 
        className={cn(
          "mt-4 border-2 border-dashed border-muted-foreground/50 bg-transparent p-6 text-center text-muted-foreground text-sm hover:border-primary transition-all duration-150 ease-in-out",
          isDragOver && "border-primary bg-primary/10 scale-105 shadow-md"
        )}
      >
        Drag your task here...
      </Card>
    </div>
  );
}
