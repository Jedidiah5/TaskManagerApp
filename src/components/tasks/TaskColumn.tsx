
import React, { useState } from 'react';
import type { TaskColumnData, NewTaskFormData } from '@/types';
import { TaskCard } from './TaskCard';
import { Card } from '@/components/ui/card';
import { AddTaskDialog } from './AddTaskDialog';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  column: TaskColumnData;
  onTaskAdd: (taskData: NewTaskFormData) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskDrop: (taskId: string, sourceColumnId: string, targetColumnId: string) => void;
}

export function TaskColumn({ column, onTaskAdd, onDeleteTask, onTaskDrop }: TaskColumnProps) {
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
        isDragOver ? "border-2 border-primary ring-2 ring-primary shadow-lg" : "border-2 border-transparent"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          {column.title} <span className="text-sm font-normal text-muted-foreground">({column.tasks.length})</span>
        </h2>
        <AddTaskDialog defaultStatus={column.title} onTaskAdd={onTaskAdd} />
      </div>
      <div 
        className="flex-grow space-y-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent"
      >
        {column.tasks.length === 0 && !isDragOver ? ( // Hide "no tasks" message if dragging over to avoid overlap with placeholder
          <p className="text-sm text-muted-foreground text-center py-4">No tasks in this column yet.</p>
        ) : (
          column.tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              columnId={column.id} 
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
