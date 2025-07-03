import { Skeleton } from "../components/skeleton";
import { Card } from "../components/card";

interface KanbanBoardSkeletonProps {
  columns?: number;
  tasksPerColumn?: number;
}

export function KanbanBoardSkeleton({
  columns = 3,
  tasksPerColumn = 4,
}: KanbanBoardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {Array.from({ length: columns }).map((_, columnIndex) => (
        <div key={columnIndex} className="space-y-4">
          {/* Column header */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-8 rounded-full" />
          </div>

          {/* Tasks */}
          {Array.from({ length: tasksPerColumn }).map((_, taskIndex) => (
            <Card key={taskIndex} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
