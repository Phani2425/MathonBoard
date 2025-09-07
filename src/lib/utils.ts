import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { LeaderboardEntry, CurrentUserInfo, SubjectScore } from '../types/leaderboard';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a mock current user from available leaderboard data or creates a default one
 */
export function getMockCurrentUser(data: LeaderboardEntry[]): CurrentUserInfo {
  // If we have leaderboard data, select a random entry to use as current user
  if (data.length > 0) {
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomEntry = data[randomIndex];
    
    return {
      ...randomEntry,
      userId: {
        ...randomEntry.userId,
        name: randomEntry.userId.name
      },
      rank: randomEntry.rank
    };
  }
  
  // Fallback if no leaderboard data is available
  const mockSubjects: SubjectScore[] = [
    {
      subjectId: { _id: 'physics-id', title: 'Physics' },
      totalMarkScored: 65,
      accuracy: 78.5
    },
    {
      subjectId: { _id: 'chemistry-id', title: 'Chemistry' },
      totalMarkScored: 72,
      accuracy: 82.3
    },
    {
      subjectId: { _id: 'maths-id', title: 'Mathematics' },
      totalMarkScored: 68,
      accuracy: 75.8
    }
  ];
  
  // Calculate total score
  const totalScore = mockSubjects.reduce((sum, subject) => sum + subject.totalMarkScored, 0);
  
  return {
    rank: 56, // Mock rank
    userId: {
      _id: 'current-user-id',
      name: 'You',
      profilePicture: ''
    },
    totalMarkScored: totalScore,
    accuracy: 79.5,
    subjects: mockSubjects,
    marksGained: totalScore,
    marksLost: 300 - totalScore,
    unansweredMarks: 0
  };
}

/**
 * Calculate starting rank for the leaderboard table based on current page
 */
export function getStartingRank(currentPage: number, limit: number): number {
  return currentPage === 1 ? 4 : (currentPage - 1) * limit + 1;
}

/**
 * Get table data by slicing leaderboard data appropriately
 */
export function getTableData(leaderboardData: LeaderboardEntry[], currentPage: number): LeaderboardEntry[] {
  return currentPage === 1 ? leaderboardData.slice(3) : leaderboardData;
}
