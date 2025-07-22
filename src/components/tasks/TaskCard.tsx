
"use client";

import type { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';

interface TaskCardProps {
  task: Task;
  columnId: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskCard({ task, columnId, onEditTask, onDeleteTask }: TaskCardProps) {
  const progressPercentage = (task.progressTotal > 0) ? (task.progressCurrent / task.progressTotal) * 100 : 0;
  
  const dueDate = task.dueDate ? parseISO(task.dueDate) : null;

  let progressBarClass = '';
  if (task.status === 'Done') {
    progressBarClass = '!bg-chart-2'; // Use a green from the theme
  } else if (progressPercentage > 0 && task.status !== 'To do') {
    progressBarClass = '!bg-chart-1'; // Use an orange from the theme
  }

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('taskId', task.id);
    event.dataTransfer.setData('sourceColumnId', columnId);
    (event.target as HTMLElement).classList.add('opacity-50', 'ring-2', 'ring-primary');
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    (event.target as HTMLElement).classList.remove('opacity-50', 'ring-2', 'ring-primary');
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="group cursor-grab hover:shadow-lg transition-shadow duration-150 ease-in-out bg-card"
    >
      <CardHeader className="p-4 pb-2 relative">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold leading-tight pr-2">{task.title}</CardTitle>
          <div className="flex items-center gap-2">
            {/* Priority Circle */}
            {task.priority === 'low' && <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" title="Low priority" />}
            {task.priority === 'medium' && <span className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-white shadow" title="Medium priority" />}
            {task.priority === 'high' && <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow" title="High priority" />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Task options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditTask(task)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {task.subtitle && (
          <CardDescription className="text-sm text-muted-foreground pt-1">{task.subtitle}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mb-3">
          {task.status === 'Done' ? (
            <div className="flex flex-col items-center justify-center py-4">
              <svg className="w-8 h-8 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-600 font-semibold text-lg">Well done!</span>
              <span className="text-muted-foreground text-sm">Great job completing this task.</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{task.progressCurrent}/{task.progressTotal}</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2"
                indicatorClassName={progressBarClass}
              />
            </>
          )}
        </div>
        <div className="flex items-center justify-between text-xs">
          {dueDate && isValid(dueDate) ? (
            <Badge variant="outline" className="py-1 px-2 font-normal">{format(dueDate, 'PPP')}</Badge>
          ) : (
            <div /> // Placeholder to keep alignment
          )}
        </div>
      </CardContent>
    </Card>
  );
}
