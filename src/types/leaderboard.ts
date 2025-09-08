export interface Subject {
  _id: string;
  title: string;
}

export interface SubjectScore {
  subjectId: Subject;
  totalMarkScored: number;
  accuracy: number;
}

export interface User {
  _id: string;
  name: string;
  profilePicture: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: User;
  totalMarkScored: number;
  accuracy: number;
  subjects: SubjectScore[];
  marksGained: number;
  marksLost: number;
  unansweredMarks: number;
}

export interface PaginationMeta {
  totalItems?: number;
  itemCount?: number;
  itemsPerPage?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface CurrentUserInfo {
  rank: number;
  userId: User;
  totalMarkScored: number;
  accuracy: number;
  subjects: SubjectScore[];
  marksGained: number;
  marksLost: number;
  unansweredMarks: number;
}

export interface LeaderboardData {
  results: LeaderboardEntry[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: LeaderboardData;
  meta?: PaginationMeta;
  me?: CurrentUserInfo;
  totalPages?: number;
  totalResults?: number;
  lastRank?: number;
  userRank?: number;
}

export interface SocialPlatform {
  name: string;
  icon: string;
  color: string;
  shareUrl: string;
}

export interface ShareData {
  title: string;
  text: string;
  url: string;
  hashtags?: string[];
}

export interface AchievementLevel {
  title: string;
  color: string;
  icon: string;
}

export interface SocialShareProps {
  currentUser: CurrentUserInfo;
  variant?: 'icon' | 'button';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUserInfo;
}

// types for analytics secction
// ...existing code...

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string | string[];
    borderWidth?: number;
    tension?: number;
  }[];
}

export interface AnalyticsData {
  scoreDistribution: ChartData;
  subjectPerformance: ChartData;
  accuracyTrend: ChartData;
  topPerformersComparison: ChartData;
}

export interface AnalyticsProps {
  leaderboardData: LeaderboardEntry[];
  currentUser?: CurrentUserInfo | null;
}
