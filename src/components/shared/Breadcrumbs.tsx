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
    <nav className="flex items-center gap-1">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <button className="px-1 py-0.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-200">
            {item.label}
          </button>
          {index < items.length - 1 && (
            <span className="text-xs text-muted-foreground mx-1">/</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
