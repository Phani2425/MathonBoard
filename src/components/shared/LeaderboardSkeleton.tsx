import React from 'react';
import { Skeleton } from '../ui/skeleton';

const LeaderboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filter Section Skeleton */}
      <div className="px-3 sm:px-6">
        <div 
          className="border rounded-lg overflow-hidden"
          style={{ 
            background: 'var(--q3-surface-default)',
            borderColor: 'var(--q3-stroke-normal)'
          }}
        >
          {/* Header Skeleton */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
      </div>

      {/* Top Performers Skeleton - Desktop Only */}
      <div className="hidden md:block px-3 sm:px-6">
        <div className="grid grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              {/* Card skeleton */}
              <div 
                className="rounded-t-3xl p-6 space-y-4"
                style={{ 
                  background: 'var(--q3-surface-default)',
                  border: '1px solid var(--q3-stroke-normal)'
                }}
              >
                {/* Avatar */}
                <div className="flex justify-center">
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
                
                {/* Name */}
                <div className="text-center space-y-2">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                  <Skeleton className="h-3 w-1/2 mx-auto" />
                </div>
                
                {/* Score */}
                <div className="text-center">
                  <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                </div>
                
                {/* Subjects */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-6" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-6" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-6" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Top Performers Skeleton */}
      <div className="block md:hidden px-3">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="p-4 rounded-lg border flex items-center gap-4"
              style={{ 
                background: 'var(--q3-surface-default)',
                borderColor: 'var(--q3-stroke-normal)'
              }}
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="px-3 sm:px-6">
        <div 
          className="border rounded-xl overflow-hidden" 
          style={{ borderColor: "var(--q3-stroke-normal)" }}
        >
          {/* Header Skeleton */}
          <div 
            className="p-4 border-b" 
            style={{ 
              background: "var(--q3-surface-dim)", 
              borderColor: "var(--q3-stroke-light)" 
            }}
          >
            <div className="hidden md:flex gap-4 items-center">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            
            {/* Mobile header */}
            <div className="flex md:hidden gap-4 items-center">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-24 flex-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          
          {/* Rows Skeleton */}
          <div className="space-y-0">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div 
                key={i} 
                className="p-4 border-b flex gap-4 items-center last:border-b-0" 
                style={{ borderColor: "var(--q3-stroke-normal)" }}
              >
                {/* Desktop row */}
                <div className="hidden md:flex gap-4 items-center w-full">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
                
                {/* Mobile row */}
                <div className="flex md:hidden gap-4 items-center w-full">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div 
            className="border-t px-4 py-4 flex items-center justify-between"
            style={{ borderColor: "var(--q3-stroke-normal)" }}
          >
            <Skeleton className="h-8 w-24" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-8 rounded" />
              ))}
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;
