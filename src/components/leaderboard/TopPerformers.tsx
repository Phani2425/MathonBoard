import React from 'react';
import type { LeaderboardEntry, CurrentUserInfo } from '../../types/leaderboard';
import LeaderboardCard from './LeaderboardCard';
import { convertCurrentUserToEntry, mockLeaderboardEntry } from '../../lib/utils';

interface TopPerformersProps {
  topThree: LeaderboardEntry[];
  currentUser?: CurrentUserInfo | null;
}

const TopPerformers: React.FC<TopPerformersProps> = ({ topThree, currentUser }) => {
  const currentUserEntry = currentUser 
    ? convertCurrentUserToEntry(currentUser) 
    : mockLeaderboardEntry(topThree);

  const cards = [
    { entry: topThree[0] || null, rank: 1, isCurrentUser: false },
    { entry: topThree[1] || null, rank: 2, isCurrentUser: false },
    { entry: topThree[2] || null, rank: 3, isCurrentUser: false },
    { entry: currentUserEntry, rank: currentUser?.rank || currentUserEntry.rank, isCurrentUser: true }
  ];

  return (
    <div className="hidden md:flex items-stretch gap-3 lg:gap-5 pb-4 overflow-x-auto">
      {cards.map((card, index) => (
        <LeaderboardCard
          key={index}
          entry={card.entry}
          rank={card.rank}
          isCurrentUser={card.isCurrentUser}
        />
      ))}
    </div>
  );
};

export default TopPerformers;
