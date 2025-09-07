import React from 'react';
import Icon from './Icon';
import Breadcrumbs from './Breadcrumbs';
import { ThemeToggle } from '../theme/theme-toggle';

const ActionBar: React.FC = () => {
  const breadcrumbItems = [
    { label: 'JEE Main Test series' },
    { label: 'Quizrr Part Test' },
    { label: 'Quizrr Part Test (QPT) - 1 (Old)' },
    { label: 'Analysis' },
    { label: 'Leaderboard' }
  ];

  return (
    <div 
      className="flex flex-col gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-6"
      style={{ 
        background: 'var(--q3-surface-glass)',
        backdropFilter: 'blur(16px)'
      }}
    >
      <div className="flex items-center gap-4 justify-between">
        <div className="flex flex-col">
          <div 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2"
            style={{ background: 'var(--q3-surface-dimmer)' }}
          >
            <Icon name="arrow-left" size={16} className="sm:hidden" />
            <Icon name="arrow-left" size={20} className="hidden sm:block" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Leaderboard</h1>
        </div>
        <ThemeToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />
    </div>
  );
};

export default ActionBar;
