import { Skeleton } from "@workspace/ui/components/skeleton";

interface TaskTableSkeletonProps {
  rows?: number;
}

export function TaskTableSkeleton({ rows = 5 }: TaskTableSkeletonProps) {
  return (
    <div className="container mx-auto px-8 py-10 max-w-7xl" suppressHydrationWarning>
      <div className="rounded-xl shadow-lg border border-gray-200 overflow-hidden w-full">
        {/* Header Section */}
        <div className="bg-gray-50 border-b border-gray-200 p-8">
          <Skeleton className="h-12 w-80 mb-6" />
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Skeleton className="h-14 w-full" />
            </div>
            
            {/* Select Button */}
            <Skeleton className="w-[280px] h-14" />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto px-8 py-6">
          <div className="rounded-lg border border-gray-200">
            {/* Table Header */}
            <div className="border-b-2 border-gray-200 bg-gray-50 py-4 px-6">
              <div className="flex items-center">
                <Skeleton className="h-5 w-6 mr-8" />
                <Skeleton className="h-5 w-32 mr-8" />
                <Skeleton className="h-5 w-24 mr-8" />
                <Skeleton className="h-5 w-32 mr-8" />
                <Skeleton className="h-5 w-28 mr-8" />
                <Skeleton className="h-5 w-28 mr-8" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
            
            <div className="min-h-[500px]">
              {/* Table rows */}
              {Array.from({ length: rows }).map((_, index) => (
                <div 
                  key={index} 
                  className={`flex items-center py-4 px-6 border-b border-gray-100 h-[80px] ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <Skeleton className="h-5 w-6 mr-8" />
                  <Skeleton className="h-5 w-52 mr-8" />
                  <Skeleton className="h-7 w-28 mr-8" />
                  <Skeleton className="h-5 w-32 mr-8" />
                  <Skeleton className="h-5 w-40 mr-8" />
                  <Skeleton className="h-5 w-32 mr-8" />
                  <Skeleton className="h-10 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Results Info */}
            <Skeleton className="h-5 w-64" />

            {/* Pagination */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
