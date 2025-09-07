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
          
          // The API returns totalPages at the top level, not in a meta object
          if (response.data.totalPages) {
            console.log('Total Pages from API:', response.data.totalPages);
            setTotalPages(response.data.totalPages);
          } else {
            console.log('No totalPages in response, defaulting to 1');
            setTotalPages(1);
          }
          
          console.log('API Response:', response.data);
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
