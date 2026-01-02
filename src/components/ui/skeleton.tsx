import { memo } from 'react'

export const Skeleton = memo(({ className = '', ...props }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} {...props} />
))

export const HabitListSkeleton = memo(() => (
  <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 h-fit">
    <Skeleton className="h-6 w-20 mb-4" />
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
    <Skeleton className="h-10 w-full mt-4" />
  </div>
))

export const HabitTableSkeleton = memo(() => (
  <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
    <Skeleton className="h-6 w-24 mb-4" />
    <div className="overflow-x-auto">
      <div className="min-w-[500px]">
        <div className="flex border-b border-gray-100 pb-3 mb-3">
          <Skeleton className="h-4 w-24 mr-4" />
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-12 mx-2" />
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center py-3">
            <Skeleton className="h-4 w-24 mr-4" />
            {Array.from({ length: 7 }).map((_, j) => (
              <Skeleton key={j} className="h-6 w-6 mx-2 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
))

export const AnalyticsSkeleton = memo(() => (
  <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 space-y-6">
    <Skeleton className="h-6 w-20" />
    <div className="flex justify-center">
      <Skeleton className="w-24 h-24 rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <Skeleton className="h-8 w-8 mx-auto mb-1" />
        <Skeleton className="h-3 w-16 mx-auto" />
      </div>
      <div className="text-center">
        <Skeleton className="h-8 w-8 mx-auto mb-1" />
        <Skeleton className="h-3 w-16 mx-auto" />
      </div>
    </div>
    <div>
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-32 w-full" />
    </div>
    <div>
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
))