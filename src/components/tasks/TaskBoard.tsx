import { TaskColumn } from './TaskColumn';
import { taskBoardColumns } from '@/lib/mock-data'; // Using mock data

export function TaskBoard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
      {taskBoardColumns.map(column => (
        <TaskColumn key={column.id} column={column} />
      ))}
    </div>
  );
}
