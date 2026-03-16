export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  topicId?: string;
}

export interface QuestionWithAnswer extends Question {
  correctOptionId: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
  correct_option_id: string;
  explanation: string;
  topic_slug: string;
  topic_id?: string;
}

export interface QuizConfig {
  type: 'mock' | 'topic';
  topicSlug?: string;
}

export interface ActiveQuiz {
  quizId: string;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  startedAt: string;
  timeLimit: number | null;
}

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  passed: boolean;
  questions: QuestionWithAnswer[];
  answers: Record<string, string>;
}

export interface QuizState {
  activeQuiz: ActiveQuiz | null;
  result: QuizResult | null;
  loading: boolean;
  error: string | null;
}
