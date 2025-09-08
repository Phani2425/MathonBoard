import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  LeaderboardEntry,
  CurrentUserInfo,
  SubjectScore,
} from "../types/leaderboard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSubjectScore(
  entry: LeaderboardEntry,
  subjectType: string
): number {
  const subject = entry.subjects.find((s) =>
    s.subjectId.title.toLowerCase().includes(subjectType.toLowerCase())
  );
  return subject ? subject.totalMarkScored : 0;
}

export function formatAccuracy(accuracy: number): string {
  return `${accuracy.toFixed(2)}%`;
}

export function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  const pageNumbers = [];

  if (currentPage > 1) {
    pageNumbers.push(1);
  }

  for (
    let i = Math.max(1, currentPage - 1);
    i <= Math.min(totalPages, currentPage + 1);
    i++
  ) {
    if (!pageNumbers.includes(i)) {
      pageNumbers.push(i);
    }
  }

  if (currentPage < totalPages - 1) {
    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }
    pageNumbers.push(totalPages);
  }

  return pageNumbers;
}

export function getMockCurrentUser(data: LeaderboardEntry[]): CurrentUserInfo {
  if (data.length > 0) {
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomEntry = data[randomIndex];

    return {
      ...randomEntry,
      userId: {
        ...randomEntry.userId,
        name: randomEntry.userId.name,
      },
      rank: randomEntry.rank,
    };
  }

  const mockSubjects: SubjectScore[] = [
    {
      subjectId: { _id: "physics-id", title: "Physics" },
      totalMarkScored: 65,
      accuracy: 78.5,
    },
    {
      subjectId: { _id: "chemistry-id", title: "Chemistry" },
      totalMarkScored: 72,
      accuracy: 82.3,
    },
    {
      subjectId: { _id: "maths-id", title: "Mathematics" },
      totalMarkScored: 68,
      accuracy: 75.8,
    },
  ];

  const totalScore = mockSubjects.reduce(
    (sum, subject) => sum + subject.totalMarkScored,
    0
  );

  return {
    rank: 56,
    userId: {
      _id: "current-user-id",
      name: "You",
      profilePicture: "",
    },
    totalMarkScored: totalScore,
    accuracy: 79.5,
    subjects: mockSubjects,
    marksGained: totalScore,
    marksLost: 300 - totalScore,
    unansweredMarks: 0,
  };
}

export function getStartingRank(currentPage: number, limit: number): number {
  return currentPage === 1 ? 4 : (currentPage - 1) * limit + 1;
}

export function getTableData(
  leaderboardData: LeaderboardEntry[],
  currentPage: number
): LeaderboardEntry[] {
  return currentPage === 1 ? leaderboardData.slice(3) : leaderboardData;
}

export function getMedalIcon(
  rank: number,
  isCurrentUser: boolean = false
): "1st-place-medal" | "2nd-place-medal" | "3rd-place-medal" | null {
  if (isCurrentUser) return null;

  switch (rank) {
    case 1:
      return "1st-place-medal";
    case 2:
      return "2nd-place-medal";
    case 3:
      return "3rd-place-medal";
    default:
      return null;
  }
}

export function getSubjectIcon(
  subjectName: string
): "physics-icon" | "chemistry-icon" | "maths-icon" | "checks" {
  const name = subjectName.toLowerCase();
  if (name.includes("phys")) return "physics-icon";
  if (name.includes("chem")) return "chemistry-icon";
  if (name.includes("math")) return "maths-icon";
  return "checks";
}

export function getLeaderboardCardClass(
  rank: number,
  isCurrentUser: boolean = false
): string {
  if (isCurrentUser) return "leaderboard-card--current-user";

  switch (rank) {
    case 1:
      return "leaderboard-card--rank1";
    case 2:
      return "leaderboard-card--rank2";
    case 3:
      return "leaderboard-card--rank3";
    default:
      return "leaderboard-card--default";
  }
}

export function getRankBadgeClass(
  rank: number,
  isCurrentUser: boolean = false
): string {
  if (isCurrentUser) return "rank-badge--current-user";

  switch (rank) {
    case 1:
      return "rank-badge--rank1";
    case 2:
      return "rank-badge--rank2";
    case 3:
      return "rank-badge--rank3";
    default:
      return "rank-badge--default";
  }
}

export function formatRankOrdinal(rank: number): string {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
}

export function convertCurrentUserToEntry(
  user: CurrentUserInfo
): LeaderboardEntry {
  return {
    rank: user.rank,
    userId: user.userId,
    totalMarkScored: user.totalMarkScored,
    accuracy: user.accuracy,
    subjects: user.subjects,
    marksGained: user.marksGained,
    marksLost: user.marksLost,
    unansweredMarks: user.unansweredMarks,
  };
}

export function mockLeaderboardEntry(
  topEntries: LeaderboardEntry[]
): LeaderboardEntry {
  const mockSubjects: SubjectScore[] = [];

  if (topEntries.length > 0 && topEntries[0].subjects.length > 0) {
    topEntries[0].subjects.forEach((subj) => {
      mockSubjects.push({
        subjectId: { ...subj.subjectId },
        totalMarkScored: Math.floor(Math.random() * 50) + 30,
        accuracy: Math.random() * 20 + 70,
      });
    });
  } else {
    mockSubjects.push(
      {
        subjectId: { _id: "physics-id", title: "Physics" },
        totalMarkScored: 65,
        accuracy: 78.5,
      },
      {
        subjectId: { _id: "chemistry-id", title: "Chemistry" },
        totalMarkScored: 72,
        accuracy: 82.3,
      },
      {
        subjectId: { _id: "maths-id", title: "Mathematics" },
        totalMarkScored: 68,
        accuracy: 75.8,
      }
    );
  }

  const totalScore = mockSubjects.reduce(
    (sum, subject) => sum + subject.totalMarkScored,
    0
  );

  return {
    rank: 56,
    userId: {
      _id: "current-user-id",
      name: "You",
      profilePicture: "",
    },
    totalMarkScored: totalScore,
    accuracy: 79.5,
    subjects: mockSubjects,
    marksGained: totalScore,
    marksLost: 300 - totalScore,
    unansweredMarks: 0,
  };
}

export type SortField =
  | "rank"
  | "name"
  | "totalScore"
  | "physics"
  | "chemistry"
  | "maths"
  | "accuracy";
export type SortDirection = "asc" | "desc";

export function sortLeaderboardData(
  data: LeaderboardEntry[],
  field: SortField,
  direction: SortDirection
): LeaderboardEntry[] {
  return [...data].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (field) {
      case "rank":
        aValue = a.rank;
        bValue = b.rank;
        break;
      case "name":
        aValue = a.userId.name.toLowerCase();
        bValue = b.userId.name.toLowerCase();
        break;
      case "totalScore":
        aValue = a.totalMarkScored;
        bValue = b.totalMarkScored;
        break;
      case "physics":
        aValue = getSubjectScore(a, "physics");
        bValue = getSubjectScore(b, "physics");
        break;
      case "chemistry":
        aValue = getSubjectScore(a, "chemistry");
        bValue = getSubjectScore(b, "chemistry");
        break;
      case "maths":
        aValue = getSubjectScore(a, "maths");
        bValue = getSubjectScore(b, "maths");
        break;
      case "accuracy":
        aValue = a.accuracy;
        bValue = b.accuracy;
        break;
      default:
        return 0;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    const comparison = (aValue as number) - (bValue as number);
    return direction === "asc" ? comparison : -comparison;
  });
}

export interface FilterCriteria {
  scoreRange?: { min: number; max: number };
  accuracyRange?: { min: number; max: number };
  searchTerm?: string;
  subjects?: string[];
}

export function filterLeaderboardData(
  data: LeaderboardEntry[],
  criteria: FilterCriteria
): LeaderboardEntry[] {
  return data.filter((entry) => {
    // Search term filter - Fix: properly search in student names
    if (criteria.searchTerm) {
      const searchLower = criteria.searchTerm.toLowerCase().trim();
      const studentName = entry.userId.name.toLowerCase();

      // Search should match anywhere in the name
      if (!studentName.includes(searchLower)) {
        return false;
      }
    }

    // Score range filter
    if (criteria.scoreRange) {
      const { min, max } = criteria.scoreRange;
      if (entry.totalMarkScored < min || entry.totalMarkScored > max) {
        return false;
      }
    }

    // Accuracy range filter
    if (criteria.accuracyRange) {
      const { min, max } = criteria.accuracyRange;
      if (entry.accuracy < min || entry.accuracy > max) {
        return false;
      }
    }

    // Subject filter (if user has good scores in selected subjects)
    if (criteria.subjects && criteria.subjects.length > 0) {
      const hasGoodSubjectScores = criteria.subjects.some((subject) => {
        const score = getSubjectScore(entry, subject);
        return score > 50; // Threshold for "good" score
      });
      if (!hasGoodSubjectScores) {
        return false;
      }
    }

    return true;
  });
}

export function getAvailableSubjects(data: LeaderboardEntry[]): string[] {
  const subjects = new Set<string>();
  data.forEach((entry) => {
    entry.subjects.forEach((subject) => {
      subjects.add(subject.subjectId.title);
    });
  });
  return Array.from(subjects);
}
