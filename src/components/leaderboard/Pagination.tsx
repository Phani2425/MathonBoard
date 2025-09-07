import React from 'react';
import { cn } from '../../lib/utils';
import { getPageNumbers } from '../../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className={cn("flex justify-center py-6", className)}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "h-8 px-2 flex items-center justify-center rounded-full border border-[var(--q3-stroke-normal)] transition-colors duration-200 cursor-pointer",
            currentPage === 1 ? "opacity-30 cursor-not-allowed bg-transparent text-foreground" : "hover:bg-[var(--muted)]"
          )}
          aria-label="Previous page"
        >
          <span className="text-foreground">Previous</span>
        </button>
        
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span 
              key={`ellipsis-${index}`}
              className="h-8 w-8 flex items-center justify-center text-sm font-medium text-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              className={cn(
                "h-8 w-8 flex items-center justify-center text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer hover:brightness-110",
                currentPage === page 
                  ? "bg-[var(--mode-pagination-color)] text-[var(--mode-pagination-text-color)] border-none" 
                  : "bg-transparent text-foreground border border-[var(--q3-stroke-normal)]"
              )}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "h-8 px-2 flex items-center justify-center rounded-full border border-[var(--q3-stroke-normal)] transition-colors duration-200 cursor-pointer",
            currentPage === totalPages ? "opacity-30 cursor-not-allowed bg-transparent text-foreground" : "hover:bg-[var(--muted)]"
          )}
          aria-label="Next page"
        >
          <span className="text-foreground">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
