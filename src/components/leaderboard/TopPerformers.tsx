import React, { useState } from "react";
import type {
  LeaderboardEntry,
  CurrentUserInfo,
} from "../../types/leaderboard";
import LeaderboardCard from "./LeaderboardCard";
import SocialShare from "../shared/SocialShare";
import AchievementModal from "../shared/AchievementModal";
import { Button } from "../ui/button";
import { Trophy, ChartBar } from "@phosphor-icons/react";
import {
  convertCurrentUserToEntry,
  mockLeaderboardEntry,
} from "../../lib/utils";

interface TopPerformersProps {
  topThree: LeaderboardEntry[];
  currentUser?: CurrentUserInfo | null;
  onAnalyticsClick?: () => void;
}

const TopPerformers: React.FC<TopPerformersProps> = ({
  topThree,
  currentUser,
  onAnalyticsClick,
}) => {
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  const currentUserEntry = currentUser
    ? convertCurrentUserToEntry(currentUser)
    : mockLeaderboardEntry(topThree);

  const cards = [
    { entry: topThree[0] || null, rank: 1, isCurrentUser: false },
    { entry: topThree[1] || null, rank: 2, isCurrentUser: false },
    { entry: topThree[2] || null, rank: 3, isCurrentUser: false },
    {
      entry: currentUserEntry,
      rank: currentUser?.rank || currentUserEntry.rank,
      isCurrentUser: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end px-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAnalyticsClick}
            className="gap-2"
          >
            <ChartBar size={16} />
            <span className="hidden sm:inline">Analytics</span>
          </Button>
          
          {currentUser && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAchievementModal(true)}
                className="gap-2"
              >
                <Trophy size={16} />
                <span className="hidden sm:inline">Achievement</span>
              </Button>
              <SocialShare 
                currentUser={currentUser}
                variant="icon"
              />
            </>
          )}
        </div>
      </div>

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

      {currentUser && (
        <AchievementModal
          isOpen={showAchievementModal}
          onClose={() => setShowAchievementModal(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default TopPerformers;
