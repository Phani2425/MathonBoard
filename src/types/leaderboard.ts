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
