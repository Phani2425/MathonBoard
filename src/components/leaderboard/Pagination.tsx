import React from 'react';
import { cn } from '../../lib/utils';
import { getPageNumbers } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  // don't show pagination if there's only 1 page
  if (totalPages <= 1) {
    return null;
  }

  // get the page numbers to display
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className={cn("flex justify-center py-6", className)}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "h-8 flex items-center justify-center rounded-full border border-[var(--q3-stroke-normal)] transition-colors duration-200 cursor-pointer text-sm font-medium",
            "w-8 md:w-auto md:px-2", 
            currentPage === 1 
              ? "opacity-30 cursor-not-allowed bg-transparent text-foreground" 
              : "hover:bg-[var(--muted)] text-foreground"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 md:mr-1" />
          <span className="hidden md:inline">Previous</span>
        </button>
        
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span 
                key={`ellipsis-${index}`}
                className="h-8 w-8 flex items-center justify-center text-sm font-medium text-foreground"
              >
                ...
              </span>
            );
          } else {
            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "h-8 w-8 flex items-center justify-center text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer hover:brightness-110",
                  currentPage === page 
                    ? "bg-[var(--mode-pagination-color)] text-[var(--mode-pagination-text-color)] border-none" 
                    : "bg-transparent text-foreground border border-[var(--q3-stroke-normal)] hover:bg-[var(--muted)]"
                )}
              >
                {page}
              </button>
            );
          }
        })}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "h-8 flex items-center justify-center rounded-full border border-[var(--q3-stroke-normal)] transition-colors duration-200 cursor-pointer text-sm font-medium",
            "w-8 md:w-auto md:px-2", 
            currentPage === totalPages 
              ? "opacity-30 cursor-not-allowed bg-transparent text-foreground" 
              : "hover:bg-[var(--muted)] text-foreground"
          )}
          aria-label="Next page"
        >
          <span className="hidden md:inline">Next</span>
          <ChevronRight className="w-4 h-4 md:ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
