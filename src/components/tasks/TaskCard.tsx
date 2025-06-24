
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

interface TaskCardProps {
  task: Task;
  columnId: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskCard({ task, columnId, onEditTask, onDeleteTask }: TaskCardProps) {
  const progressPercentage = (task.progressTotal > 0) ? (task.progressCurrent / task.progressTotal) * 100 : 0;

  let progressBarColor = 'var(--primary)'; // Default blue
    if (task.status === 'Done') {
        progressBarColor = 'rgb(34 197 94)'; // green-500
    } else if (progressPercentage > 0 && task.status !== 'To do') {
        progressBarColor = 'rgb(249 115 22)'; // orange-500
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
      className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-grab" 
      role="listitem" 
      aria-labelledby={`task-title-${task.id}`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardHeader className="p-4 flex flex-row justify-between items-start">
        <div>
          <CardTitle id={`task-title-${task.id}`} className="text-base font-semibold">{task.title}</CardTitle>
          <CardDescription className="text-xs">{task.subtitle}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
             <DropdownMenuItem onClick={() => onEditTask(task)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit task
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-destructive hover:!text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mb-3">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{task.progressCurrent}/{task.progressTotal}</span>
          </div>
          <Progress value={progressPercentage} aria-label={`Progress ${progressPercentage}%`} className="h-2 [&>div]:bg-[--progress-color]" style={{ '--progress-color': progressBarColor } as React.CSSProperties} />
        </div>
        
        <div className="flex items-center justify-between text-xs">
          {task.dueDate !== 'Not set' && (
            <Badge variant="outline" className="py-1 px-2">{task.dueDate}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
