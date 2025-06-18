import type { TaskColumnData } from '@/types';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface TaskColumnProps {
  column: TaskColumnData;
}

export function TaskColumn({ column }: TaskColumnProps) {
  return (
    <div className="flex flex-col bg-secondary/50 p-4 rounded-lg h-full min-h-[calc(100vh-180px)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          {column.title} <span className="text-sm font-normal text-muted-foreground">({column.tasks.length})</span>
        </h2>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          <Plus className="h-4 w-4 mr-1" /> Add new task
        </Button>
      </div>
      <div className="flex-grow space-y-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
        {column.tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      <Card className="mt-4 border-2 border-dashed border-muted-foreground/50 bg-transparent p-6 text-center text-muted-foreground text-sm hover:border-primary transition-colors">
        Drag your task here...
      </Card>
    </div>
  );
}

// Helper for scrollbar styling if needed (Tailwind plugin or global CSS)
// Add this to your globals.css or a Tailwind plugin if you want custom scrollbars often:
/*
@layer utilities {
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted-foreground)) transparent;
  }
  .scrollbar-thumb-muted-foreground\/50::-webkit-scrollbar-thumb {
    background-color: hsla(var(--muted-foreground), 0.5);
    border-radius: 4px;
  }
  .scrollbar-track-transparent::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
}
*/
