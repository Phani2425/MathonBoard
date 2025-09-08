import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ApiResponse, LeaderboardEntry, CurrentUserInfo } from '../types/leaderboard';

interface UseLeaderboardParams {
  page?: number;
  limit?: number;
}

interface UseLeaderboardReturn {
  leaderboardData: LeaderboardEntry[];
  currentUser: CurrentUserInfo | null;
  totalPages: number;
  isLoading: boolean;
  error: Error | string | null;
}

export const useLeaderboardData = ({ 
  page = 1, 
  limit = 10 
}: UseLeaderboardParams = {}): UseLeaderboardReturn => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUserInfo | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<ApiResponse>(
          'https://api.quizrr.in/api/hiring/leaderboard',
          {
            params: {
              page,
              limit
            }
          }
        );

        if (response.data.success) {
          setLeaderboardData(response.data.data.results);
          
          if (response.data.me) {
            setCurrentUser(response.data.me);
          }
          
          if (response.data.totalPages) {
            setTotalPages(response.data.totalPages);
          } else {
            setTotalPages(1);
          }
        } else {
          setError(response.data.message || 'Failed to fetch leaderboard data');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [page, limit]);

  return {
    leaderboardData,
    currentUser,
    totalPages,
    isLoading,
    error
  };
};
