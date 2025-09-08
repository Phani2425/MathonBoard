import React from 'react';
import type { CurrentUserInfo } from '../../types/leaderboard';

interface CurrentUserCardProps {
  currentUser: CurrentUserInfo;
}

const CurrentUserCard: React.FC<CurrentUserCardProps> = ({ currentUser }) => {
  const getSubjectScore = (subjectType: string) => {
    const subject = currentUser.subjects.find(s => 
      s.subjectId.title.toLowerCase().includes(subjectType.toLowerCase())
    );
    return subject ? subject.totalMarkScored : 0;
  };

  return (
    <div 
      className="flex items-stretch gap-0 h-16 rounded-t-2xl border w-full overflow-x-auto scrollbar-hide"
      style={{ 
        background: 'var(--q3-surface-dimmest)',
        backdropFilter: 'blur(30px)',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.08)',
        borderColor: 'var(--q3-stroke-normal)'
      }}
    >
      <div className="min-w-[94px] w-[94px] flex items-center justify-center flex-shrink-0">
        <div 
          className="w-7 h-7 rounded-full flex items-center justify-center border"
          style={{
            background: 'var(--q3-surface-dim)',
            borderColor: 'var(--q3-stroke-light)'
          }}
        >
          <span className="text-xs font-medium text-foreground">
            {currentUser.rank}
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4">
        <div className="w-8 h-8 rounded-[18px] overflow-hidden border-2 flex-shrink-0" style={{ 
          background: 'linear-gradient(0deg, #6EDAEB, #6EDAEB), linear-gradient(0deg, #D7BFE7, #D7BFE7)',
          borderColor: 'var(--q3-stroke-normal)'
        }}>
          {currentUser.userId.profilePicture ? (
            <img 
              src={currentUser.userId.profilePicture} 
              alt={currentUser.userId.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.querySelector('.fallback-avatar')?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 flex items-center justify-center text-sm font-semibold text-white fallback-avatar ${currentUser.userId.profilePicture ? 'hidden' : ''}`}>
            {currentUser.userId.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-bold text-sm text-foreground block truncate">
            {currentUser.userId.name} <span className="text-primary">(You)</span>
          </span>
        </div>
      </div>

      <div className="min-w-[128px] w-[128px] flex items-center justify-center flex-shrink-0">
        <div 
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full"
          style={{ background: 'var(--q3-surface-dim)' }}
        >
          <span className="font-bold text-base text-foreground">{currentUser.totalMarkScored}</span>
          <span className="text-xs font-medium text-muted-foreground">/</span>
          <span className="text-xs font-medium text-muted-foreground">300</span>
        </div>
      </div>

      <div className="min-w-[104px] w-[104px] flex items-center justify-center flex-shrink-0">
        <span className="font-medium text-base text-foreground">
          {getSubjectScore('physics')}
        </span>
      </div>

      <div className="min-w-[104px] w-[104px] flex items-center justify-center flex-shrink-0">
        <span className="font-medium text-base text-foreground">
          {getSubjectScore('chemistry')}
        </span>
      </div>

      <div className="min-w-[104px] w-[104px] flex items-center justify-center flex-shrink-0">
        <span className="font-medium text-base text-foreground">
          {getSubjectScore('math')}
        </span>
      </div>

      <div className="min-w-[104px] w-[104px] flex items-center justify-center flex-shrink-0">
        <span className="font-medium text-base text-foreground">
          {currentUser.accuracy.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default CurrentUserCard;
