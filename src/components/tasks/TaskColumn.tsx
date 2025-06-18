
import type { TaskColumnData, NewTaskFormData } from '@/types';
import { TaskCard } from './TaskCard';
import { Card } from '@/components/ui/card';
import { AddTaskDialog } from './AddTaskDialog';

interface TaskColumnProps {
  column: TaskColumnData;
  onTaskAdd: (taskData: NewTaskFormData) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskColumn({ column, onTaskAdd, onDeleteTask }: TaskColumnProps) {
  return (
    <div className="flex flex-col bg-secondary/50 p-4 rounded-lg h-full min-h-[calc(100vh-180px)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          {column.title} <span className="text-sm font-normal text-muted-foreground">({column.tasks.length})</span>
        </h2>
        <AddTaskDialog defaultStatus={column.title} onTaskAdd={onTaskAdd} />
      </div>
      <div className="flex-grow space-y-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
        {column.tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No tasks in this column yet.</p>
        ) : (
          column.tasks.map(task => (
            <TaskCard key={task.id} task={task} onDeleteTask={onDeleteTask} />
          ))
        )}
      </div>
      <Card className="mt-4 border-2 border-dashed border-muted-foreground/50 bg-transparent p-6 text-center text-muted-foreground text-sm hover:border-primary transition-colors">
        Drag your task here...
      </Card>
    </div>
  );
}
