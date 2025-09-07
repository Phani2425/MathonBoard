import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap pb-1 scrollbar-hide">
      {items.map((item, index) => {
        // On small screens, show only first and last items with ellipsis in between
        const isFirstItem = index === 0;
        const isLastItem = index === items.length - 1;
        
        // For small screens, only show first, ellipsis, and last item
        const shouldShowOnSmall = isFirstItem || isLastItem;
        
        return (
          <React.Fragment key={index}>
            {!shouldShowOnSmall && index === 1 ? (
              <span className="text-xs text-muted-foreground mx-1 sm:hidden">...</span>
            ) : null}
            
            <button 
              className={`px-1 py-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-200 ${
                !shouldShowOnSmall ? 'hidden sm:inline' : ''
              } ${
                isLastItem ? 'max-w-[120px] sm:max-w-none truncate' : ''
              }`}
            >
              {item.label}
            </button>
            
            {index < items.length - 1 && (
              <span className={`text-xs text-muted-foreground mx-1 ${
                !shouldShowOnSmall && index !== 0 ? 'hidden sm:inline' : ''
              }`}>
                /
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
