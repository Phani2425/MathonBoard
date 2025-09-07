import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLeaderboardData } from '../../hooks/useLeaderboardData';
import ActionBar from '../shared/ActionBar';
import TopPerformers from './TopPerformers';
import LeaderboardTable from './LeaderboardTable';
import CurrentUserCard from './CurrentUserCard';
import type { CurrentUserInfo, LeaderboardEntry } from '../../types/leaderboard';
import { motion, AnimatePresence } from 'framer-motion';
import { getMockCurrentUser, getStartingRank, getTableData } from '../../lib/utils';
import '../../assets/styles/LeaderboardPage.css';

const LeaderboardPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  const [initialTopThree, setInitialTopThree] = useState<LeaderboardEntry[]>([]);
  const [initialCurrentUser, setInitialCurrentUser] = useState<CurrentUserInfo | null>(null);
  const [isCurrentUserInView, setIsCurrentUserInView] = useState(false);
  
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  
  const { leaderboardData, currentUser, totalPages, isLoading, error } = useLeaderboardData({
    page: currentPage,
    limit,
  });
  
  const tableData = useMemo(() => 
    getTableData(leaderboardData, currentPage), 
  [currentPage, leaderboardData]);

  const startingRank = useMemo(() => 
    getStartingRank(currentPage, limit), 
  [currentPage, limit]);

  const topThreeToDisplay = useMemo(() => {
    return initialTopThree.length > 0 ? initialTopThree : leaderboardData.slice(0, 3);
  }, [initialTopThree, leaderboardData]);
  
  const userToDisplay = useMemo(() => {
    return initialCurrentUser || (currentUser || getMockCurrentUser(leaderboardData));
  }, [initialCurrentUser, currentUser, leaderboardData]);

  useEffect(() => {
    if (leaderboardData.length > 0 && initialTopThree.length === 0) {
      setInitialTopThree(leaderboardData.slice(0, 3));
      
      if (currentUser) {
        setInitialCurrentUser(currentUser);
      } else if (leaderboardData.length > 0) {
        setInitialCurrentUser(getMockCurrentUser(leaderboardData));
      }
    }
  }, [leaderboardData, currentUser, initialTopThree.length]);

  useEffect(() => {
    if (!userToDisplay) return;

    const userInCurrentPage = tableData.some(
      entry => entry.userId._id === userToDisplay.userId._id
    );
    
    setIsCurrentUserInView(userInCurrentPage);
  }, [tableData, userToDisplay]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const timeoutId = setTimeout(() => {
      const currentUserRow = document.querySelector('[data-current-user="true"]');
      
      if (currentUserRow) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              setIsCurrentUserInView(entry.isIntersecting);
            });
          },
          { 
            threshold: 0.1,
            rootMargin: '0px 0px 0px 0px' 
          }
        );

        observer.observe(currentUserRow);
        
        return () => {
          observer.unobserve(currentUserRow);
        };
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [tableData, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (tableContainerRef.current) {
      tableContainerRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ActionBar />

      <div className="max-w-[1176px] mx-auto px-6 py-6 space-y-6">
        <AnimatePresence mode="wait">
          {isLoading && leaderboardData.length === 0 ? (
            <motion.div 
              key="loading"
              className="bg-card rounded-xl shadow-md p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.p 
                className="text-lg text-muted-foreground"
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5 
                }}
              >
                Loading leaderboard data...
              </motion.p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-bold mb-2">Error</h2>
              <p>{error instanceof Error ? error.message : String(error)}</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <TopPerformers topThree={topThreeToDisplay} currentUser={userToDisplay} />
              </motion.div>
              
              <div className="relative" ref={tableContainerRef}>
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div 
                      key="page-loading"
                      className="py-8 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.p 
                        className="text-sm text-muted-foreground"
                        animate={{ 
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1.5 
                        }}
                      >
                        Loading data for page {currentPage}...
                      </motion.p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="table-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LeaderboardTable 
                        leaderboardData={tableData} 
                        currentUserId={userToDisplay?.userId._id}
                        startingRank={startingRank}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        ref={stickyContainerRef}
        className="sticky-bottom"
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: isCurrentUserInView ? 100 : 0,
          opacity: isCurrentUserInView ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{ 
          pointerEvents: isCurrentUserInView ? 'none' : 'auto'
        }}
      >
        <div className="current-user-card">
          <CurrentUserCard currentUser={userToDisplay} />
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
