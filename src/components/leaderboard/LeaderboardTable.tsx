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
import {
  getSubjectScore,
  formatAccuracy,
  cn,
  sortLeaderboardData,
  type SortField,
  type SortDirection,
} from "../../lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

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
  maxHeight?: string;
}

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
  maxHeight = "600px",
}) => {
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedData = useMemo(() => {
    return sortLeaderboardData(leaderboardData, sortField, sortDirection);
  }, [leaderboardData, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "rank" ? "asc" : "desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-primary" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary" />
    );
  };

  const columnHeaders = useMemo(() => {
    return [
      {
        id: "rank" as SortField,
        name: "Rank",
        width: "min-w-[94px] w-[94px]",
        style: "text-foreground",
        sortable: true,
      },
      {
        id: "name" as SortField,
        name: "Student Name",
        width: "flex-1 min-w-[150px]",
        style: "text-foreground",
        sortable: true,
      },
      {
        id: "totalScore" as SortField,
        name: "Overall Score",
        width: "min-w-[128px] w-[128px]",
        style: "text-foreground",
        sortable: true,
      },
      {
        id: "physics" as SortField,
        name: "Phy",
        width: "min-w-[104px] w-[104px]",
        style: "text-muted-foreground",
        sortable: true,
      },
      {
        id: "chemistry" as SortField,
        name: "Chem",
        width: "min-w-[104px] w-[104px]",
        style: "text-muted-foreground",
        sortable: true,
      },
      {
        id: "maths" as SortField,
        name: "Maths",
        width: "min-w-[104px] w-[104px]",
        style: "text-muted-foreground",
        sortable: true,
      },
      {
        id: "accuracy" as SortField,
        name: "Accuracy",
        width: "min-w-[104px] w-[104px]",
        style: "text-muted-foreground",
        sortable: true,
      },
    ];
  }, []);

  if (!leaderboardData.length) {
    return (
      <div className="border rounded-xl p-8 text-center">
        <p className="text-muted-foreground">No leaderboard data available</p>
      </div>
    );
  }

  const renderRankBadge = (rank: number) => {
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

  const renderCurrentUserAsTableRow = (user: CurrentUserInfo) => {
    return (
      <motion.tr
        className="border-t-2 sticky bottom-0 z-10"
        style={{
          borderColor: "var(--q3-stroke-normal)",
          background: "var(--q3-surface-dimmest)",
          backdropFilter: "blur(30px)",
          boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.08)",
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <TableCell className="text-center border-0 py-4">
          <div className="flex justify-center">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center border"
              style={{
                background: "var(--q3-surface-dim)",
                borderColor: "var(--q3-stroke-light)",
              }}
            >
              <span className="text-xs font-medium text-foreground">
                {user.rank}
              </span>
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
              <span className="text-primary">(You)</span>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-center border-0 py-4">
          <div
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full"
            style={{ background: "var(--q3-surface-dim)" }}
          >
            <span className="font-bold text-base text-foreground">
              {user.totalMarkScored}
            </span>
            <span className="text-xs font-medium text-muted-foreground">/</span>
            <span className="text-xs font-medium text-muted-foreground">
              300
            </span>
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
    <motion.div
      className="border rounded-xl overflow-hidden"
      style={{ borderColor: "var(--q3-stroke-normal)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-auto scrollbar-hide" style={{ maxHeight }}>
        <Table>
          <TableHeader
            className="sticky top-0"
            style={{
              background: "var(--q3-surface-dim)",
              borderBottom: "1px solid var(--q3-stroke-light)",
            }}
          >
            <TableRow className="border-0">
              {columnHeaders.map((header) => (
                <TableHead
                  key={header.id}
                  className={`${
                    header.width
                  } text-center h-16 font-medium text-sm ${
                    header.style
                  } border-0 ${
                    header.sortable
                      ? "cursor-pointer hover:bg-background/50 transition-colors"
                      : ""
                  }`}
                  onClick={
                    header.sortable ? () => handleSort(header.id) : undefined
                  }
                >
                  <div
                    className={`flex items-center gap-2 ${
                      header.name == "Student Name"
                        ? "justify-start ml-14"
                        : "justify-center"
                    }`}
                  >
                    {header.name}
                    {header.sortable && getSortIcon(header.id)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <AnimatePresence mode="wait">
            <motion.tbody
              key={`page-${currentPage}-${sortField}-${sortDirection}`}
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
                        ? "[animation:highlightRow_2s_ease-out] dark:[animation:highlightRowDark_2s_ease-out]"
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
                      ease: "easeOut",
                    }}
                  >
                    <TableCell className="text-center border-0 py-0">
                      {renderRankBadge(startingRank + index)}
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

              {showCurrentUserAsLastRow &&
                currentUserData &&
                renderCurrentUserAsTableRow(currentUserData)}
            </motion.tbody>
          </AnimatePresence>
        </Table>
      </div>

      {!hidePagination && (
        <div
          className="border-t px-4"
          style={{ borderColor: "var(--q3-stroke-normal)" }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className=""
          />
        </div>
      )}
    </motion.div>
  );
};

export default LeaderboardTable;
