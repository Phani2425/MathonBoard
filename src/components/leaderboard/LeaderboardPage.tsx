import React, { useState, useEffect, useRef, useMemo } from "react";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { useLeaderboardData } from "../../hooks/useLeaderboardData";
import ActionBar from "../shared/ActionBar";
import TopPerformers from "./TopPerformers";
import LeaderboardTable from "./LeaderboardTable";
import CurrentUserCard from "./CurrentUserCard";
import CollapsibleFilterSection from "./CollapsibleFilterSection";
import AnalyticsSection from "./AnalyticsSection";
import LeaderboardSkeleton from "../shared/LeaderboardSkeleton";
import TableSkeleton from "../shared/TableSkeleton";
import type {
  CurrentUserInfo,
  LeaderboardEntry,
} from "../../types/leaderboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  getMockCurrentUser,
  getStartingRank,
  getTableData,
  filterLeaderboardData,
  getAvailableSubjects,
  getSubjectScore,
  type FilterCriteria,
} from "../../lib/utils";
import Pagination from "./Pagination";
import type { LeaderboardTab } from "./Tabs";

const SCROLL_BREAKPOINT = 1200; 

const LeaderboardPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("overall");
  const [filters, setFilters] = useState<FilterCriteria>({});
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const limit = 10;

  const [initialTopThree, setInitialTopThree] = useState<LeaderboardEntry[]>([]);
  const [initialCurrentUser, setInitialCurrentUser] = useState<CurrentUserInfo | null>(null);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { leaderboardData, currentUser, totalPages, isLoading, error } = useLeaderboardData({
    page: currentPage,
    limit,
  });

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= SCROLL_BREAKPOINT);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const processedData = useMemo(() => {
    let data = [...leaderboardData];
    
    data = filterLeaderboardData(data, filters);

    switch (activeTab) {
      case "topPerformers":
        data = data.slice(0, 10);
        break;
      case "physics":
        data = data
          .filter((entry) =>
            entry.subjects.some((s) =>
              s.subjectId.title.toLowerCase().includes("physics")
            )
          )
          .sort(
            (a, b) =>
              getSubjectScore(b, "physics") - getSubjectScore(a, "physics")
          );
        break;
      case "chemistry":
        data = data
          .filter((entry) =>
            entry.subjects.some((s) =>
              s.subjectId.title.toLowerCase().includes("chemistry")
            )
          )
          .sort(
            (a, b) =>
              getSubjectScore(b, "chemistry") - getSubjectScore(a, "chemistry")
          );
        break;
      case "maths":
        data = data
          .filter((entry) =>
            entry.subjects.some((s) =>
              s.subjectId.title.toLowerCase().includes("math")
            )
          )
          .sort(
            (a, b) => getSubjectScore(b, "maths") - getSubjectScore(a, "maths")
          );
        break;
      default:
        data = data.sort((a, b) => a.rank - b.rank);
        break;
    }

    return data;
  }, [leaderboardData, filters, activeTab]);

  const processedTotalPages = useMemo(() => {
    if (activeTab === "overall" && Object.keys(filters).length === 0 && totalPages > 0) {
      return totalPages;
    }

    const calculatedPages = Math.ceil(processedData.length / limit);
    return Math.max(calculatedPages, 1);
  }, [processedData.length, limit, activeTab, totalPages, filters]);

  const tableData = useMemo(() => {
    if (activeTab === "overall" && Object.keys(filters).length === 0) {
      return getTableData(processedData, currentPage);
    }

    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, currentPage, limit, activeTab, filters]);

  const startingRank = useMemo(() => {
    if (activeTab === "overall") {
      return getStartingRank(currentPage, limit);
    }
    return (currentPage - 1) * limit + 1;
  }, [currentPage, limit, activeTab]);

  const topThreeToDisplay = useMemo(() => {
    if (activeTab === "overall") {
      return initialTopThree.length > 0
        ? initialTopThree
        : processedData.slice(0, 3);
    }
    return processedData.slice(0, 3);
  }, [initialTopThree, processedData, activeTab]);

  const userToDisplay = useMemo(() => {
    return (
      initialCurrentUser || currentUser || getMockCurrentUser(leaderboardData)
    );
  }, [initialCurrentUser, currentUser, leaderboardData]);

  const availableSubjects = useMemo(() => {
    return getAvailableSubjects(leaderboardData);
  }, [leaderboardData]);

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
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
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

  const handleTabChange = (tab: LeaderboardTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setFilters({});
  };

  const handleFilterChange = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleAnalyticsClick = () => {
    setShowAnalytics(true);
  };

  const handleBackClick = () => {
    setShowAnalytics(false);
  };

  const renderContent = () => {
    if (isLoading && leaderboardData.length === 0) {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <LeaderboardSkeleton />
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
          role="alert"
          aria-live="polite"
        >
          <h2 className="font-bold mb-2">Error</h2>
          <p>{error instanceof Error ? error.message : String(error)}</p>
        </motion.div>
      );
    }

    if (showAnalytics) {
      return (
        <motion.div
          key="analytics-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 sm:space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="px-3 sm:px-6"
          >
            <AnalyticsSection 
              leaderboardData={leaderboardData}
              currentUser={userToDisplay}
            />
          </motion.div>
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
          <CollapsibleFilterSection
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onFilterChange={handleFilterChange}
            availableSubjects={availableSubjects}
            activeFilters={filters}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="px-3 sm:px-6"
        >
          <TopPerformers
            topThree={topThreeToDisplay}
            currentUser={userToDisplay}
            onAnalyticsClick={handleAnalyticsClick}
          />
        </motion.div>

        <div ref={tableContainerRef}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="table-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-3 sm:px-6"
                role="status"
                aria-live="polite"
                aria-label="Loading table data"
              >
                <TableSkeleton rows={limit} />
              </motion.div>
            ) : (
              <ScrollSync proportional={true} enabled={isSmallScreen}>
                <div className="w-full">
                  <motion.div
                    key={`table-${currentPage}-${activeTab}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="px-3 sm:px-6"
                  >
                    <div className="rounded-xl overflow-hidden">
                      <ScrollSyncPane>
                        <div 
                          className="bg-muted/5"
                          style={{
                            overflowX: isSmallScreen ? "auto" : "visible",
                            overflowY: "hidden",
                          }}
                        >
                          <div className={isSmallScreen ? "min-w-[1136px]" : "w-full"}>
                            <LeaderboardTable
                              leaderboardData={tableData}
                              currentUserId={userToDisplay?.userId._id}
                              startingRank={startingRank}
                              currentPage={currentPage}
                              totalPages={processedTotalPages}
                              onPageChange={handlePageChange}
                              hidePagination={isSmallScreen}
                            />
                          </div>
                        </div>
                      </ScrollSyncPane>
                    </div>
                  </motion.div>

                  {isSmallScreen && processedTotalPages > 1 && (
                    <motion.div
                      className="px-3 py-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Pagination
                        currentPage={currentPage}
                        totalPages={processedTotalPages}
                        onPageChange={handlePageChange}
                        className="py-0"
                      />
                    </motion.div>
                  )}

                  {isSmallScreen && (
                    <ScrollSyncPane>
                      <motion.div
                        className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-10 w-full"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          overflowX: "auto",
                          overflowY: "hidden",
                        }}
                        role="complementary"
                        aria-label="Current user information"
                      >
                        <div className="min-w-[1136px]">
                          {userToDisplay && <CurrentUserCard currentUser={userToDisplay} />}
                        </div>
                      </motion.div>
                    </ScrollSyncPane>
                  )}
                </div>
              </ScrollSync>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ActionBar 
        showBackButton={showAnalytics}
        onBackClick={handleBackClick}
      />

      <main className="w-full" role="main">
        <div className="w-full py-4 pb-1 sm:py-6">
          <div className="max-w-[1176px] mx-auto">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </div>
        </div>
      </main>

      {!showAnalytics && !isSmallScreen && (
        <motion.div
          className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-10 w-full"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          role="complementary"
          aria-label="Current user information"
        >
          {userToDisplay && <CurrentUserCard currentUser={userToDisplay} />}
        </motion.div>
      )}
    </div>
  );
};

export default LeaderboardPage;
