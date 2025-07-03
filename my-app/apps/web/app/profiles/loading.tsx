import { Skeleton } from '@workspace/ui/components/skeleton'
import React from 'react'

const Loading = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-9 w-48" />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Table Caption Skeleton */}
        <div className="text-lg font-semibold py-4 bg-gray-50 flex justify-center">
          <Skeleton className="h-7 w-32" />
        </div>

        {/* Table Header Skeleton */}
        <div className="bg-gray-100 border-b">
          <div className="flex">
            <div className="w-1/6 py-4 px-6">
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="w-1/4 py-4 px-6">
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="w-7/12 py-4 px-6">
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
        </div>

        {/* Table Body Skeleton Rows */}
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex hover:bg-gray-50 transition-colors">
              <div className="w-1/6 py-4 px-6">
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              <div className="w-1/4 py-4 px-6">
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="w-7/12 py-4 px-6">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading
