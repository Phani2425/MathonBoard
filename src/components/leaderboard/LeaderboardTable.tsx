import React, { useMemo } from 'react';
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import type { LeaderboardEntry } from '../../types/leaderboard';
import Pagination from './Pagination';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from '../shared/UserAvatar';
import { getSubjectScore, formatAccuracy, cn } from '../../lib/utils';

interface LeaderboardTableProps {
  leaderboardData: LeaderboardEntry[];
  currentUserId?: string;
  startingRank?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  leaderboardData,
  currentUserId,
  startingRank = 4,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  const columnHeaders = useMemo(() => {
    return [
      { id: 'rank', name: 'Rank', width: 'w-[94px]', style: 'text-foreground' },
      { id: 'student', name: 'Student Name', width: 'flex-1', style: 'text-foreground' },
      { id: 'overall', name: 'Overall Score', width: 'w-[128px]', style: 'text-foreground' },
      { id: 'phy', name: 'Phy', width: 'w-[104px]', style: 'text-muted-foreground' },
      { id: 'chem', name: 'Chem', width: 'w-[104px]', style: 'text-muted-foreground' },
      { id: 'maths', name: 'Maths', width: 'w-[104px]', style: 'text-muted-foreground' },
      { id: 'accuracy', name: 'Accuracy', width: 'w-[104px]', style: 'text-muted-foreground' },
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
            background: 'var(--q3-surface-dim)',
            borderColor: 'var(--q3-stroke-light)'
          }}
        >
          <span className="text-xs font-medium text-foreground">
            {rank}
          </span>
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
          {entry.userId._id === currentUserId && 
            <span className="text-primary"> (You)</span>
          }
        </span>
      </div>
    );
  };

  const renderScore = (score: number, total?: number) => {
    if (total) {
      return (
        <div 
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full"
          style={{ background: 'var(--q3-surface-dim)' }}
        >
          <span className="font-bold text-base text-foreground">{score}</span>
          <span className="text-xs font-medium text-muted-foreground">/</span>
          <span className="text-xs font-medium text-muted-foreground">{total}</span>
        </div>
      );
    }
    
    return (
      <span className="font-medium text-base text-foreground">
        {score}
      </span>
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

  return (
    <>
      <motion.div 
        className="border rounded-xl overflow-hidden mb-10" 
        style={{ borderColor: 'var(--q3-stroke-normal)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Table>
          <TableHeader>
            <TableRow 
              className="border-0"
              style={{ 
                background: 'var(--q3-surface-dim)',
                borderBottom: '1px solid var(--q3-stroke-light)'
              }}
            >
              {columnHeaders.map((header) => (
                <TableHead 
                  key={header.id}
                  className={`${header.width} text-center h-16 font-medium text-sm ${header.style} border-0`}
                >
                  {header.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={`page-${currentPage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {leaderboardData.map((entry, index) => {
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
                      borderColor: 'var(--q3-stroke-normal)',
                      background: isCurrentUser 
                        ? 'var(--primary-foreground)' 
                        : 'transparent'
                    }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: "easeOut"
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
                      {renderScore(getSubjectScore(entry, 'physics'))}
                    </TableCell>
                    <TableCell className="text-center border-0 py-0">
                      {renderScore(getSubjectScore(entry, 'chemistry'))}
                    </TableCell>
                    <TableCell className="text-center border-0 py-0">
                      {renderScore(getSubjectScore(entry, 'math'))}
                    </TableCell>
                    <TableCell className="text-center border-0 py-0">
                      {renderAccuracy(entry.accuracy)}
                    </TableCell>
                  </motion.tr>
                );
              })}
              
              <motion.tr 
                className="border-t h-16"
                style={{ 
                  borderColor: 'var(--q3-stroke-normal)'
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
            </motion.tbody>
          </AnimatePresence>
        </Table>
      </motion.div>
    </>
  );
};

export default LeaderboardTable;
