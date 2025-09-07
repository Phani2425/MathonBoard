import React from "react";
import type { LeaderboardEntry } from "../../types/leaderboard";
import Icon from "../shared/Icon";
import { 
  getMedalIcon, 
  getSubjectIcon, 
  getLeaderboardCardClass,
  getRankBadgeClass,
  formatRankOrdinal,
  cn
} from "../../lib/utils";
import "../../assets/styles/LeaderboardCard.css";

interface LeaderboardCardProps {
  entry: LeaderboardEntry | null;
  rank: number;
  isCurrentUser?: boolean;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  entry,
  rank,
  isCurrentUser = false,
}) => {
  if (!entry) {
    return <div className="w-full md:w-1/4" />;
  }

  const cardClass = getLeaderboardCardClass(rank, isCurrentUser);
  const rankBadgeClass = getRankBadgeClass(rank, isCurrentUser);
  const medalIcon = getMedalIcon(rank, isCurrentUser);

  return (
    <div className={cn("leaderboard-card md:w-1/4", cardClass)}>
      <div className="flex flex-col items-center gap-4 sm:gap-5 px-3 sm:px-6">
        <div className="flex flex-col items-center relative">
          <div className="avatar-container w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
            {entry.userId.profilePicture ? (
              <img
                src={entry.userId.profilePicture}
                alt={entry.userId.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement
                    ?.querySelector(".fallback-avatar")
                    ?.classList.remove("hidden");
                }}
              />
            ) : null}
            <div
              className={`fallback-avatar ${
                entry.userId.profilePicture ? "hidden" : ""
              }`}
            >
              {entry.userId.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          {medalIcon && (
            <div className="medal-icon">
              <Icon name={medalIcon} size={20} weight="fill" className="sm:hidden" />
              <Icon name={medalIcon} size={24} weight="fill" className="hidden sm:block" />
            </div>
          )}
        </div>

        <div className={`flex flex-col items-center gap-2 ${isCurrentUser ? "mt-2 sm:mt-3 md:mt-5" : ""}`}>
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-foreground text-center leading-5 sm:leading-6">
            {entry.userId.name}
            {isCurrentUser ? " " : ""}
            <span className={isCurrentUser ? "text-primary" : ""}>
              {isCurrentUser ? "(You)" : ""}
            </span>
          </h3>
          <div className={cn("rank-badge", rankBadgeClass)}>
            <span className="text-xs font-medium">
              {formatRankOrdinal(rank)} Rank
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <div className="w-5 sm:w-6 flex justify-center">
              <Icon name="checks" size={14} className="sm:hidden" />
              <Icon name="checks" size={16} className="hidden sm:block" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Overall Score
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-sm md:text-base font-bold text-foreground">
              {entry.totalMarkScored}
            </span>
            <span className="text-xs text-muted-foreground">/300</span>
          </div>
        </div>

        {entry.subjects.map((subject) => (
          <div
            key={subject.subjectId._id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <div className="w-5 sm:w-6 flex justify-center">
                <Icon
                  name={getSubjectIcon(subject.subjectId.title)}
                  size={14}
                  className="sm:hidden"
                />
                <Icon
                  name={getSubjectIcon(subject.subjectId.title)}
                  size={16}
                  className="hidden sm:block"
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {subject.subjectId.title.includes("Physics")
                  ? "Phy Score"
                  : subject.subjectId.title.includes("Chemistry")
                  ? "Chem Score"
                  : subject.subjectId.title.includes("Math")
                  ? "Maths Score"
                  : `${subject.subjectId.title} Score`}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground">
              {subject.totalMarkScored}
            </span>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <div className="w-5 sm:w-6 flex justify-center">
              <Icon name="target" size={14} className="sm:hidden" />
              <Icon name="target" size={16} className="hidden sm:block" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Accuracy
            </span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-foreground">
            {entry.accuracy.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;

