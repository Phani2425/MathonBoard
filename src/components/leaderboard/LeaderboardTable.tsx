import React, { useMemo, useState } from "react";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import type {
  CurrentUserInfo,
  LeaderboardEntry,
} from "../../types/leaderboard";
import Pagination from "./Pagination";
import { motion, AnimatePresence } from "framer-motion";
import UserAvatar from "../shared/UserAvatar";
import { getSubjectScore, formatAccuracy, cn } from "../../lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface LeaderboardTableProps {
  leaderboardData: LeaderboardEntry[];
  currentUserId?: string;
  startingRank?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  hidePagination?: boolean;
  showCurrentUserAsLastRow?: boolean;
  currentUserData?: CurrentUserInfo | null;
}

type SortField = "rank" | "overall" | "phy" | "chem" | "maths" | "accuracy" | null;
type SortDirection = "asc" | "desc" | null;

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  leaderboardData,
  currentUserId,
  startingRank = 4,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  hidePagination = false,
  showCurrentUserAsLastRow = false,
  currentUserData,
}) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const columnHeaders = useMemo(() => [
      {
        id: "rank",
        name: "Rank",
        width: "min-w-[94px] w-[94px]",
        style: "text-foreground",
        sortable: true,
      },
      {
        id: "student",
        name: "Student Name",
        width: "flex-1 min-w-[150px]",
        style: "text-foreground",
        sortable: false,
      },
      {
        id: "overall",
        name: "Overall Score",
        width: "min-w-[128px] w-[128px]",
        style: "text-foreground",
        sortable: true,
      },
      {
        id: "phy",
        name: "Phy",
        width: "min-w-[104px] w-[104px]",
        style: "text-muted-foreground",
        sortable: true,
      },
      {
        id: "chem",
        name: "Chem",
        width: "min-w-[104px] w-[104px]",
        style: "text-muted-foreground",
        sortable: true,
      },
      {
        id: "maths",
        name: "Maths",
        width: "min-w-[104px] w-[104px]",
        style: "text-muted-foreground",
        sortable: true,
      },
      {
        id: "accuracy",
        name: "Accuracy",
        width: "min-w-[104px] w-[104px]",
        style: "text-muted-foreground",
        sortable: true,
      },
    ], []);

  const handleSort = (field: string) => {
    if (!["rank", "overall", "phy", "chem", "maths", "accuracy"].includes(field)) {
      return;
    }
    
    const newSortField = field as SortField;
    
    if (sortField === newSortField) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(newSortField);
      setSortDirection("asc");
    }
  };

  const originalRanks = useMemo(() => {
    const rankMap = new Map<string, number>();
    leaderboardData.forEach((entry, index) => {
      rankMap.set(entry.userId._id, startingRank + index);
    });
    return rankMap;
  }, [leaderboardData, startingRank]);

  const sortedData = useMemo(() => {
    if (!leaderboardData.length || !sortField || !sortDirection) {
      return leaderboardData;
    }

    const sorted = [...leaderboardData];
    
    sorted.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortField) {
        case "rank":
          valueA = originalRanks.get(a.userId._id) || 0;
          valueB = originalRanks.get(b.userId._id) || 0;
          break;
        case "overall":
          valueA = a.totalMarkScored;
          valueB = b.totalMarkScored;
          break;
        case "phy":
          valueA = getSubjectScore(a, "physics");
          valueB = getSubjectScore(b, "physics");
          break;
        case "chem":
          valueA = getSubjectScore(a, "chemistry");
          valueB = getSubjectScore(b, "chemistry");
          break;
        case "maths":
          valueA = getSubjectScore(a, "math");
          valueB = getSubjectScore(b, "math");
          break;
        case "accuracy":
          valueA = a.accuracy;
          valueB = b.accuracy;
          break;
        default:
          return 0;
      }
      
      if (valueA === valueB) {
        return a.totalMarkScored > b.totalMarkScored ? -1 : 1;
      }
      
      return sortDirection === "asc" 
        ? valueA - valueB 
        : valueB - valueA;
    });
    
    return sorted;
  }, [leaderboardData, sortField, sortDirection, originalRanks]);

  if (!leaderboardData.length) {
    return (
      <div className="border rounded-xl p-8 text-center">
        <p className="text-muted-foreground">No leaderboard data available</p>
      </div>
    );
  }

  const renderRankBadge = (entry: LeaderboardEntry) => {
    const rank = originalRanks.get(entry.userId._id) || 0;
    
    return (
      <div className="flex justify-center">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center border"
          style={{
            background: "var(--q3-surface-dim)",
            borderColor: "var(--q3-stroke-light)",
          }}
        >
          <span className="text-xs font-medium text-foreground">{rank}</span>
        </div>
      </div>
    );
  };

  const renderUserInfo = (entry: LeaderboardEntry) => {
    return (
      <div className="flex items-center gap-4 px-4">
        <UserAvatar user={entry.userId} />
        <span className="font-bold text-sm text-foreground">
          {entry.userId.name}
          {entry.userId._id === currentUserId && (
            <span className="text-primary"> (You)</span>
          )}
        </span>
      </div>
    );
  };

  const renderScore = (score: number, total?: number) => {
    if (total) {
      return (
        <div
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full"
          style={{ background: "var(--q3-surface-dim)" }}
        >
          <span className="font-bold text-base text-foreground">{score}</span>
          <span className="text-xs font-medium text-muted-foreground">/</span>
          <span className="text-xs font-medium text-muted-foreground">
            {total}
          </span>
        </div>
      );
    }

    return (
      <span className="font-medium text-base text-foreground">{score}</span>
    );
  };

  const renderAccuracy = (accuracy: number) => {
    return (
      <div className="flex items-center justify-center">
        <span className="font-medium text-base text-foreground">
          {formatAccuracy(accuracy)}
        </span>
      </div>
    );
  };

  const renderSortIcon = (columnId: string) => {
    if (sortField !== columnId) {
      return (
        <div className="inline-flex flex-col ml-1 h-4 opacity-40">
          <ChevronUp className="h-4 w-4" />
          <ChevronDown className="h-4 w-4 -mt-1" />
        </div>
      );
    }
    
    if (sortDirection === "asc") {
      return <ChevronUp className="h-4 w-4 inline-block ml-1" />;
    } else if (sortDirection === "desc") {
      return <ChevronDown className="h-4 w-4 inline-block ml-1" />;
    } else {
      return (
        <div className="inline-flex flex-col ml-1 h-4">
          <ChevronUp className="h-2 w-4" />
          <ChevronDown className="h-2 w-4 -mt-1" />
        </div>
      );
    }
  };

  const renderCurrentUserAsTableRow = (user: CurrentUserInfo) => {
    return (
      <motion.tr
        className="border-t-2 border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10"
        style={{
          borderColor: "var(--primary)",
        }}
        data-current-user="true"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <TableCell className="text-center border-0 py-4">
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground font-bold text-sm shadow-lg">
              {user.rank}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-left border-0 py-4">
          <div className="flex items-center gap-4 px-4">
            <UserAvatar user={user.userId} />
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">
                {user.userId.name}
              </span>
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                You
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-center border-0 py-4">
          <div className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-primary/20 border border-primary/30">
            <span className="font-bold text-base text-foreground">{user.totalMarkScored}</span>
            <span className="text-xs font-medium text-muted-foreground">/</span>
            <span className="text-xs font-medium text-muted-foreground">300</span>
          </div>
        </TableCell>
        <TableCell className="text-center border-0 py-4">
          <span className="font-medium text-base text-foreground">
            {getSubjectScore(user, "physics")}
          </span>
        </TableCell>
        <TableCell className="text-center border-0 py-4">
          <span className="font-medium text-base text-foreground">
            {getSubjectScore(user, "chemistry")}
          </span>
        </TableCell>
        <TableCell className="text-center border-0 py-4">
          <span className="font-medium text-base text-foreground">
            {getSubjectScore(user, "math")}
          </span>
        </TableCell>
        <TableCell className="text-center border-0 py-4">
          <span className="font-medium text-base text-foreground">
            {formatAccuracy(user.accuracy)}
          </span>
        </TableCell>
      </motion.tr>
    );
  };

  return (
    <>
      <motion.div
        className="border rounded-xl overflow-x-auto mb-10"
        style={{ borderColor: "var(--q3-stroke-normal)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Table>
          <TableHeader>
            <TableRow
              className="border-0"
              style={{
                background: "var(--q3-surface-dim)",
                borderBottom: "1px solid var(--q3-stroke-light)",
              }}
            >
              {columnHeaders.map((header) => (
                <TableHead
                  key={header.id}
                  className={`${header.width} text-center h-16 font-medium text-sm ${header.style} border-0 ${
                    header.sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" : ""
                  }`}
                  onClick={() => header.sortable && handleSort(header.id)}
                >
                  <div className="flex items-center justify-center">
                    {header.name}
                    {header.sortable && renderSortIcon(header.id)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={`page-${currentPage}-sort-${sortField || "default"}-${sortDirection || "default"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {sortedData.map((entry, index) => {
                const isCurrentUser = entry.userId._id === currentUserId;
                return (
                  <motion.tr
                    key={entry.userId._id}
                    data-current-user={isCurrentUser ? "true" : "false"}
                    className={cn(
                      "border-t h-16 transition-colors duration-300",
                      isCurrentUser
                        ? "[animation:highlightRow_2s_ease-in-out]"
                        : "transition-all duration-200 ease-in-out hover:bg-[var(--q3-surface-dim)] hover:translate-y-[-2px] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:hover:bg-[var(--q3-surface-dimmer)] dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                    )}
                    style={{
                      borderColor: "var(--q3-stroke-normal)",
                      background: isCurrentUser
                        ? "var(--primary-foreground)"
                        : "transparent",
                    }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                  >
                    <TableCell className="text-center border-0 py-0">
                      {renderRankBadge(entry)}
                    </TableCell>
                    <TableCell className="text-left border-0 py-0">
                      {renderUserInfo(entry)}
                    </TableCell>
                    <TableCell className="text-center border-0 py-0">
                      {renderScore(entry.totalMarkScored, 300)}
                    </TableCell>
                    <TableCell className="text-center border-0 py-0">
                      {renderScore(getSubjectScore(entry, "physics"))}
                    </TableCell>
                    <TableCell className="text-center border-0 py-0">
                      {renderScore(getSubjectScore(entry, "chemistry"))}
                    </TableCell>
                    <TableCell className="text-center border-0 py-0">
                      {renderScore(getSubjectScore(entry, "math"))}
                    </TableCell>
                    <TableCell className="text-center border-0 py-0">
                      {renderAccuracy(entry.accuracy)}
                    </TableCell>
                  </motion.tr>
                );
              })}

              {showCurrentUserAsLastRow && currentUserData && (
                renderCurrentUserAsTableRow(currentUserData)
              )}

              {!hidePagination && (
                <motion.tr
                  className="border-t h-auto"
                  style={{
                    borderColor: "var(--q3-stroke-normal)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <TableCell colSpan={7} className="p-0">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={onPageChange}
                      className=""
                    />
                  </TableCell>
                </motion.tr>
              )}
            </motion.tbody>
          </AnimatePresence>
        </Table>
      </motion.div>
    </>
  );
};

export default LeaderboardTable;
