import React from 'react';
import { cn } from '../../lib/utils';

export type LeaderboardTab = 'overall' | 'physics' | 'chemistry' | 'maths' | 'topPerformers';

interface TabsProps {
  activeTab: LeaderboardTab;
  onTabChange: (tab: LeaderboardTab) => void;
  availableSubjects: string[];
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange, availableSubjects }) => {
  const tabs = [
    { id: 'overall' as LeaderboardTab, label: 'Overall' },
    { id: 'topPerformers' as LeaderboardTab, label: 'Top 10' },
  ];

  availableSubjects.forEach(subject => {
    if (subject.toLowerCase().includes('physics')) {
      tabs.push({ id: 'physics' as LeaderboardTab, label: 'Physics' });
    } else if (subject.toLowerCase().includes('chemistry')) {
      tabs.push({ id: 'chemistry' as LeaderboardTab, label: 'Chemistry' });
    } else if (subject.toLowerCase().includes('math')) {
      tabs.push({ id: 'maths' as LeaderboardTab, label: 'Maths' });
    }
  });

  return (
    <div className="w-full overflow-x-auto">
      <div 
        className="flex h-9 items-center rounded-md p-1 text-muted-foreground w-full"
        style={{ 
          background: 'var(--q3-surface-dim)',
          border: '1px solid var(--q3-stroke-light)'
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "hover:bg-background/60 hover:text-foreground/90"
            )}
            style={activeTab === tab.id ? {
              background: 'var(--background)',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
