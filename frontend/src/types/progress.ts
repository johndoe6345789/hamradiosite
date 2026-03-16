export interface OverallProgress {
  totalQuizzes: number;
  averageScore: number;
  currentStreak: number;
  bestStreak: number;
}

export interface TopicProgress {
  topicId: string;
  topicTitle: string;
  topicSlug: string;
  totalAttempts: number;
  averageScore: number;
  lastAttemptDate: string | null;
}

export interface QuizAttemptSummary {
  id: string;
  quizType: string;
  topicTitle: string | null;
  score: number;
  total: number;
  passed: boolean;
  completedAt: string;
}

export interface ProgressState {
  overall: OverallProgress | null;
  topicBreakdown: TopicProgress[];
  weakAreas: TopicProgress[];
  history: QuizAttemptSummary[];
  loading: boolean;
  error: string | null;
}
