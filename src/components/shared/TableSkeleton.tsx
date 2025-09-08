import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  showPagination?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  rows = 10, 
  showPagination = true 
}) => {
  return (
    <div 
      className="border rounded-xl overflow-hidden" 
      style={{ borderColor: "var(--q3-stroke-normal)" }}
    >
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
        
        <div className="flex md:hidden gap-4 items-center">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24 flex-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      
      <div className="space-y-0">
        {Array.from({ length: rows }, (_, i) => (
          <div 
            key={i} 
            className="p-4 border-b flex gap-4 items-center last:border-b-0" 
            style={{ borderColor: "var(--q3-stroke-normal)" }}
          >
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

      {showPagination && (
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
      )}
    </div>
  );
};

export default TableSkeleton;
