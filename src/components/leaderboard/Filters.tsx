import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '../ui/dropdown-menu';
import { Filter, X, Search } from 'lucide-react';
import type { FilterCriteria } from '../../lib/utils';

interface FiltersProps {
  onFilterChange: (filters: FilterCriteria) => void;
  availableSubjects: string[];
  activeFilters: FilterCriteria;
}

const Filters: React.FC<FiltersProps> = ({
  onFilterChange,
  availableSubjects,
  activeFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState(activeFilters.searchTerm || '');

  useEffect(() => {
    setSearchTerm(activeFilters.searchTerm || '');
  }, [activeFilters.searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange({
      ...activeFilters,
      searchTerm: value.trim() || undefined,
    });
  };

  const handleScoreRangeChange = (min: number, max: number) => {
    onFilterChange({
      ...activeFilters,
      scoreRange: { min, max },
    });
  };

  const handleAccuracyRangeChange = (min: number, max: number) => {
    onFilterChange({
      ...activeFilters,
      accuracyRange: { min, max },
    });
  };

  const handleSubjectToggle = (subject: string, checked: boolean) => {
    const currentSubjects = activeFilters.subjects || [];
    const newSubjects = checked
      ? [...currentSubjects, subject]
      : currentSubjects.filter(s => s !== subject);
    
    onFilterChange({
      ...activeFilters,
      subjects: newSubjects.length > 0 ? newSubjects : undefined,
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    onFilterChange({});
  };

  const removeFilter = (filterType: 'searchTerm' | 'scoreRange' | 'accuracyRange' | 'subjects', value?: string) => {
    const newFilters = { ...activeFilters };
    
    if (filterType === 'searchTerm') {
      setSearchTerm('');
      delete newFilters.searchTerm;
    } else if (filterType === 'scoreRange') {
      delete newFilters.scoreRange;
    } else if (filterType === 'accuracyRange') {
      delete newFilters.accuracyRange;
    } else if (filterType === 'subjects' && value) {
      const currentSubjects = newFilters.subjects || [];
      const updatedSubjects = currentSubjects.filter(s => s !== value);
      if (updatedSubjects.length > 0) {
        newFilters.subjects = updatedSubjects;
      } else {
        delete newFilters.subjects;
      }
    }
    
    onFilterChange(newFilters);
  };

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

  const getScoreRangeLabel = (range: { min: number; max: number }) => {
    if (range.min === 0 && range.max === 100) return 'Beginner';
    if (range.min === 101 && range.max === 200) return 'Intermediate';
    if (range.min === 201 && range.max === 300) return 'Advanced';
    return `${range.min}-${range.max}`;
  };

  const getAccuracyRangeLabel = (range: { min: number; max: number }) => {
    return `${range.min}%-${range.max}%`;
  };

  return (
    <div className="space-y-3">
      {/* Search and Filter Controls in One Row */}
      <div className="flex gap-2">
        {/* Search Input - Takes most space */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        {/* Filters Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-4 w-4 rounded-full p-0 text-xs">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Score Range</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleScoreRangeChange(0, 100)}>
              0 - 100 (Beginner)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleScoreRangeChange(101, 200)}>
              101 - 200 (Intermediate)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleScoreRangeChange(201, 300)}>
              201 - 300 (Advanced)
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Accuracy Range</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleAccuracyRangeChange(0, 50)}>
              0% - 50%
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAccuracyRangeChange(51, 75)}>
              51% - 75%
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAccuracyRangeChange(76, 100)}>
              76% - 100%
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Strong Subjects</DropdownMenuLabel>
            {availableSubjects.map((subject) => (
              <DropdownMenuCheckboxItem
                key={subject}
                checked={(activeFilters.subjects || []).includes(subject)}
                onCheckedChange={(checked) => handleSubjectToggle(subject, checked)}
              >
                {subject}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="gap-1 h-9"
          >
            <X className="h-4 w-4" />
            <span className="hidden lg:inline">Clear</span>
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1">
          {activeFilters.searchTerm && (
            <Badge variant="secondary" className="text-xs gap-1">
              "{activeFilters.searchTerm}"
              <button
                onClick={() => removeFilter('searchTerm')}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {activeFilters.scoreRange && (
            <Badge variant="secondary" className="text-xs gap-1">
              {getScoreRangeLabel(activeFilters.scoreRange)}
              <button
                onClick={() => removeFilter('scoreRange')}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {activeFilters.accuracyRange && (
            <Badge variant="secondary" className="text-xs gap-1">
              {getAccuracyRangeLabel(activeFilters.accuracyRange)}
              <button
                onClick={() => removeFilter('accuracyRange')}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {activeFilters.subjects?.map((subject) => (
            <Badge key={subject} variant="secondary" className="text-xs gap-1">
              {subject}
              <button
                onClick={() => removeFilter('subjects', subject)}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filters;
