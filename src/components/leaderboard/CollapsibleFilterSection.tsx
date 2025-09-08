import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Tabs, { type LeaderboardTab } from './Tabs';
import Filters from './Filters';
import type { FilterCriteria } from '../../lib/utils';

interface CollapsibleFilterSectionProps {
  activeTab: LeaderboardTab;
  onTabChange: (tab: LeaderboardTab) => void;
  onFilterChange: (filters: FilterCriteria) => void;
  availableSubjects: string[];
  activeFilters: FilterCriteria;
}

const CollapsibleFilterSection: React.FC<CollapsibleFilterSectionProps> = ({
  activeTab,
  onTabChange,
  onFilterChange,
  availableSubjects,
  activeFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = !!(
    activeFilters.searchTerm ||
    activeFilters.scoreRange ||
    activeFilters.accuracyRange ||
    (activeFilters.subjects && activeFilters.subjects.length > 0)
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.searchTerm) count++;
    if (activeFilters.scoreRange) count++;
    if (activeFilters.accuracyRange) count++;
    if (activeFilters.subjects && activeFilters.subjects.length > 0) count++;
    return count;
  };

  return (
    <div 
      className="border rounded-lg overflow-hidden"
      style={{ 
        background: 'var(--q3-surface-default)',
        borderColor: 'var(--q3-stroke-normal)'
      }}
    >
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-foreground">View & Filter</h3>
          {hasActiveFilters && (
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
            style={{ borderTop: '1px solid var(--q3-stroke-light)' }}
          >
            <div className="p-4 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <div className="lg:flex-1">
                  <Tabs
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    availableSubjects={availableSubjects}
                  />
                </div>

                <div className="lg:flex-[2]">
                  <Filters
                    onFilterChange={onFilterChange}
                    availableSubjects={availableSubjects}
                    activeFilters={activeFilters}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleFilterSection;
