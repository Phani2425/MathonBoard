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
      className="flex flex-col gap-4 px-6 py-6"
      style={{ 
        background: 'var(--q3-surface-glass)',
        backdropFilter: 'blur(16px)'
      }}
    >
      <div className="flex items-center gap-4 justify-between">
        <div className="flex flex-col">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
            style={{ background: 'var(--q3-surface-dimmer)' }}
          >
            <Icon name="arrow-left" size={20} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
        </div>
        <ThemeToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />
    </div>
  );
};

export default ActionBar;
