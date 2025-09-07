import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLeaderboardData } from "../../hooks/useLeaderboardData";
import ActionBar from "../shared/ActionBar";
import TopPerformers from "./TopPerformers";
import LeaderboardTable from "./LeaderboardTable";
import CurrentUserCard from "./CurrentUserCard";
import type {
  CurrentUserInfo,
  LeaderboardEntry,
} from "../../types/leaderboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  getMockCurrentUser,
  getStartingRank,
  getTableData,
} from "../../lib/utils";
import "../../assets/styles/LeaderboardPage.css";
import Pagination from "./Pagination";

const LeaderboardPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [initialTopThree, setInitialTopThree] = useState<LeaderboardEntry[]>(
    []
  );
  const [initialCurrentUser, setInitialCurrentUser] =
    useState<CurrentUserInfo | null>(null);
  const [isCurrentUserInView, setIsCurrentUserInView] = useState(false);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { leaderboardData, currentUser, totalPages, isLoading, error } =
    useLeaderboardData({
      page: currentPage,
      limit,
    });

  const tableData = useMemo(
    () => getTableData(leaderboardData, currentPage),
    [currentPage, leaderboardData]
  );

  const startingRank = useMemo(
    () => getStartingRank(currentPage, limit),
    [currentPage, limit]
  );

  const topThreeToDisplay = useMemo(() => {
    return initialTopThree.length > 0
      ? initialTopThree
      : leaderboardData.slice(0, 3);
  }, [initialTopThree, leaderboardData]);

  const userToDisplay = useMemo(() => {
    return (
      initialCurrentUser || currentUser || getMockCurrentUser(leaderboardData)
    );
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
      (entry) => entry.userId._id === userToDisplay.userId._id
    );

    setIsCurrentUserInView(userInCurrentPage);
  }, [tableData, userToDisplay]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const timeoutId = setTimeout(() => {
      const currentUserRow = document.querySelector(
        '[data-current-user="true"]'
      );

      if (currentUserRow) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              setIsCurrentUserInView(entry.isIntersecting);
            });
          },
          {
            threshold: 0.1,
            rootMargin: "0px 0px 0px 0px",
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
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const MobilePaginationComponent = () => {
    if (totalPages <= 1) return null;

    return (
      <motion.div
        className="px-3 py-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="py-0" // Remove default padding since we're adding it to the wrapper
        />
      </motion.div>
    );
  };

  const renderContent = () => {
    if (isLoading && leaderboardData.length === 0) {
      return (
        <motion.div
          key="loading"
          className="bg-card rounded-xl shadow-md p-4 sm:p-8 text-center mx-3 sm:mx-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <motion.p
            className="text-base sm:text-lg text-muted-foreground"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
          >
            Loading leaderboard data...
          </motion.p>
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          key="error"
          className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 sm:p-6 mx-3 sm:mx-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="font-bold mb-2">Error</h2>
          <p>{error instanceof Error ? error.message : String(error)}</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4 sm:space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="px-3 sm:px-6"
        >
          <TopPerformers
            topThree={topThreeToDisplay}
            currentUser={userToDisplay}
          />
        </motion.div>

        {/* Desktop Layout - Separate table and sticky current user */}
        <div className="hidden md:block">
          <div className="relative" ref={tableContainerRef}>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="page-loading"
                  className="py-4 pb-1 sm:py-8 text-center px-3 sm:px-6"
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
                      duration: 1.5,
                    }}
                  >
                    #MathBoleTohMathonGo
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="table-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-3 sm:px-6"
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
        </div>

        {/* Mobile Layout - Clean and aligned */}
        <div className="block md:hidden">
          <div ref={tableContainerRef}>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="page-loading"
                  className="py-8 text-center px-3"
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
                      duration: 1.5,
                    }}
                  >
                    #MathBoleTohMathonGo
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="table-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="space-y-0"
                >
                  {/* Table without constraining wrapper */}
                  <div className="px-3">
                    <LeaderboardTable
                      leaderboardData={tableData}
                      currentUserId={userToDisplay?.userId._id}
                      startingRank={startingRank}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      hidePagination={true} // Hide pagination inside table
                      showCurrentUserAsLastRow={true} // Show current user as last row
                      currentUserData={userToDisplay} // Pass current user data
                    />
                  </div>

                  {/* Clean Mobile Pagination - No background, proper alignment */}
                  <MobilePaginationComponent />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <ActionBar />

      {/* Main content container - Full width */}
      <div className="w-full">
        {/* Desktop container - Full width with max-width constraint only for specific content */}
        <div className="hidden md:block w-full py-4 pb-1 sm:py-6">
          <div className="max-w-[1176px] mx-auto">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </div>
        </div>

        {/* Mobile container - Full width without constraints */}
        <div className="block md:hidden w-full py-4 pb-1">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </div>

      {/* Desktop sticky bottom current user - Only show when user not in view */}
      <motion.div
        className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 hidden md:block z-10"
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: isCurrentUserInView ? 100 : 0,
          opacity: isCurrentUserInView ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{
          pointerEvents: isCurrentUserInView ? "none" : "auto",
        }}
      >
        <div className="max-w-[1176px] mx-auto px-3 sm:px-6 py-3">
          {userToDisplay && <CurrentUserCard currentUser={userToDisplay} />}
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
