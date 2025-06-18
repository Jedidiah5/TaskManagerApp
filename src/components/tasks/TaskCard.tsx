"use client";

import type { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Paperclip } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const progressPercentage = (task.progressCurrent / task.progressTotal) * 100;

  let progressBarColorClass = 'bg-primary'; // Default or primary color
  if (task.status === 'Done') {
    progressBarColorClass = 'bg-green-500';
  } else if (progressPercentage < 30 && task.status !== 'To do') {
    progressBarColorClass = 'bg-red-500';
  } else if (task.status === 'In progress' || (task.status === 'To do' && progressPercentage > 0) ) {
    progressBarColorClass = 'bg-orange-500';
  }


  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200_ cursor-grab" role="listitem" aria-labelledby={`task-title-${task.id}`}>
      <CardHeader className="p-4">
        <CardTitle id={`task-title-${task.id}`} className="text-base font-semibold">{task.title}</CardTitle>
        <CardDescription className="text-xs">{task.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mb-3">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{task.progressCurrent}/{task.progressTotal}</span>
          </div>
          <Progress value={progressPercentage} aria-label={`Progress ${progressPercentage}%`} className="h-2 [&>div]:bg-[--progress-color]" style={{ '--progress-color': `var(${progressBarColorClass.replace('bg-','--')})` } as React.CSSProperties} />
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <Badge variant="outline" className="py-1 px-2">{task.dueDate}</Badge>
          <div className="flex -space-x-2">
            {task.assignees.slice(0, 3).map((assignee, index) => (
              <Avatar key={assignee.id} className="h-6 w-6 border-2 border-card" title={assignee.name}>
                <AvatarImage src={assignee.avatarUrl} alt={assignee.name} data-ai-hint="person face" />
                <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {task.assignees.length > 3 && (
              <Avatar className="h-6 w-6 border-2 border-card bg-muted">
                <AvatarFallback>+{task.assignees.length - 3}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-end space-x-3">
          <div className="flex items-center text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            {task.commentsCount}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Paperclip className="h-3.5 w-3.5 mr-1" />
            {task.attachmentsCount}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
