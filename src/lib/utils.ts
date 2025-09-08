import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  LeaderboardEntry,
  CurrentUserInfo,
  SubjectScore,
  ShareData,
  SocialPlatform,
  AchievementLevel,
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
  // Array to store page numbers
  const pageNumbers = [];

  // Always show first page if we're not on it
  if (currentPage > 1) {
    pageNumbers.push(1);
  }

  // Show current page and one page before and after
  for (
    let i = Math.max(1, currentPage - 1);
    i <= Math.min(totalPages, currentPage + 1);
    i++
  ) {
    if (!pageNumbers.includes(i)) {
      pageNumbers.push(i);
    }
  }

  // Add last page with ellipsis if needed
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
  // Don't show medal for current user
  if (isCurrentUser) return null;

  // Return medal based on rank
  if (rank === 1) return "1st-place-medal";
  if (rank === 2) return "2nd-place-medal";
  if (rank === 3) return "3rd-place-medal";
  
  // No medal for other ranks
  return null;
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
  let filteredData = data;
  
  // Filter by search term
  if (criteria.searchTerm) {
    const searchLower = criteria.searchTerm.toLowerCase().trim();
    filteredData = filteredData.filter(entry => 
      entry.userId.name.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by score range
  if (criteria.scoreRange) {
    const { min, max } = criteria.scoreRange;
    filteredData = filteredData.filter(entry => 
      entry.totalMarkScored >= min && entry.totalMarkScored <= max
    );
  }
  
  // Filter by accuracy range
  if (criteria.accuracyRange) {
    const { min, max } = criteria.accuracyRange;
    filteredData = filteredData.filter(entry => 
      entry.accuracy >= min && entry.accuracy <= max
    );
  }
  
  // Filter by subjects
  if (criteria.subjects && criteria.subjects.length > 0) {
    filteredData = filteredData.filter(entry => {
      const subjects = criteria.subjects || [];
      for (const subject of subjects) {
        const score = getSubjectScore(entry, subject);
        if (score > 50) {
          return true;
        }
      }
      return false;
    });
  }
  
  return filteredData;
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

//social share utils

export function generateShareData(currentUser: CurrentUserInfo): ShareData {
  return {
    title: "JEE Main Achievement",
    text: `Just achieved rank #${
      currentUser.rank
    } in JEE Main Test Series! Scored ${
      currentUser.totalMarkScored
    }/300 with ${currentUser.accuracy.toFixed(1)}% accuracy`,
    url: window.location.href,
    hashtags: ["JEEMain", "Achievement", "TestSeries"],
  };
}

export function getSocialPlatforms(shareData: ShareData): SocialPlatform[] {
  const { text, url, title } = shareData;

  return [
    {
      name: "WhatsApp",
      icon: "whatsapp",
      color: "var(--q3-base-green)",
      shareUrl: `https://wa.me/?text=${encodeURIComponent(
        `${text}\n\n${url}`
      )}`,
    },
    {
      name: "Twitter",
      icon: "twitter",
      color: "var(--q3-base-blue)",
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      color: "var(--q3-base-indigo)",
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
        text
      )}`,
    },
    {
      name: "Facebook",
      icon: "facebook",
      color: "var(--q3-base-blue)",
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(text)}`,
    },
    {
      name: "Telegram",
      icon: "telegram",
      color: "var(--q3-base-sky)",
      shareUrl: `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
    },
  ];
}

export function getAchievementLevel(rank: number): AchievementLevel {
  if (rank <= 3)
    return {
      title: "Elite Champion",
      color: "var(--q3-base-yellow)",
      icon: "crown",
    };
  if (rank <= 10)
    return {
      title: "Top Performer", 
      color: "var(--q3-base-orange)",
      icon: "medal",
    };
  if (rank <= 50)
    return {
      title: "High Achiever",
      color: "var(--q3-base-blue)", 
      icon: "target",
    };
  return { 
    title: "Rising Star", 
    color: "var(--q3-base-green)", 
    icon: "star" 
  };
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function openSocialShare(url: string): void {
  window.open(
    url,
    "_blank",
    "width=600,height=400,scrollbars=yes,resizable=yes"
  );
}

export function getRankSuffix(rank: number): string {
  if (rank === 1) return "st";
  if (rank === 2) return "nd";
  if (rank === 3) return "rd";
  return "th";
}
