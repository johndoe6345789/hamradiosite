import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/auth';
import type { Topic, TopicWithContent } from '@/types/topic';
import type { ActiveQuiz, QuizConfig, QuizQuestion, QuizResult } from '@/types/quiz';
import type {
  OverallProgress,
  TopicProgress,
  QuizAttemptSummary,
} from '@/types/progress';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('refreshToken')
            : null;

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await axios.post<Record<string, unknown>>(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = (data.access_token ?? data.accessToken ?? '') as string;
        const newRefreshToken = (data.refresh_token ?? data.refreshToken ?? refreshToken) as string;

        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>('/auth/login', credentials),

  register: (credentials: RegisterCredentials) =>
    apiClient.post<AuthResponse>('/auth/register', credentials),

  logout: () => apiClient.post('/auth/logout'),

  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh', { refreshToken }),
};

export const topicsApi = {
  getAll: () => apiClient.get<Topic[]>('/topics/'),

  getBySlug: (slug: string) =>
    apiClient.get<TopicWithContent>(`/topics/${slug}`),
};

export const questionsApi = {
  getByTopic: (topicSlug: string) =>
    apiClient.get<{ questions: unknown[] }>(`/questions/topic/${topicSlug}`),
};

export const quizzesApi = {
  start: (config: QuizConfig) =>
    apiClient.post<ActiveQuiz>('/quizzes/start', { type: config.type, topic_slug: config.topicSlug }),

  submit: (quizId: string, answers: Record<string, string>) =>
    apiClient.post<QuizResult>(`/quizzes/${quizId}/submit`, { answers }),

  getResult: (quizId: string) =>
    apiClient.get<QuizResult>(`/quizzes/${quizId}/results`),
};

export const progressApi = {
  getOverall: () => apiClient.get<OverallProgress>('/progress/'),

  getTopicBreakdown: () =>
    apiClient.get<TopicProgress[]>('/progress/topics'),

  getWeakAreas: () => apiClient.get<TopicProgress[]>('/progress/weak-areas'),

  getHistory: () =>
    apiClient.get<QuizAttemptSummary[]>('/progress/history'),
};

// Admin API - requires admin role
export const adminApi = {
  // Users
  getUsers: () => apiClient.get<{ users: User[] }>('/admin/users'),
  getUser: (id: string) => apiClient.get<{ user: User }>(`/admin/users/${id}`),
  updateUser: (id: string, data: Partial<User & { password?: string }>) =>
    apiClient.put<{ user: User }>(`/admin/users/${id}`, data),
  deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),

  // Questions
  getQuestions: (topic?: string) =>
    apiClient.get<{ questions: QuizQuestion[] }>('/admin/questions', { params: topic ? { topic } : {} }),
  getQuestion: (id: string) =>
    apiClient.get<{ question: QuizQuestion }>(`/admin/questions/${id}`),
  createQuestion: (data: Omit<QuizQuestion, 'id'>) =>
    apiClient.post<{ question: QuizQuestion }>('/admin/questions', data),
  updateQuestion: (id: string, data: Partial<QuizQuestion>) =>
    apiClient.put<{ question: QuizQuestion }>(`/admin/questions/${id}`, data),
  deleteQuestion: (id: string) => apiClient.delete(`/admin/questions/${id}`),

  // Topics
  getTopics: () => apiClient.get<{ topics: TopicWithContent[] }>('/admin/topics'),
  getTopic: (id: string) =>
    apiClient.get<{ topic: TopicWithContent }>(`/admin/topics/${id}`),
  createTopic: (data: Omit<TopicWithContent, 'id'>) =>
    apiClient.post<{ topic: TopicWithContent }>('/admin/topics', data),
  updateTopic: (id: string, data: Partial<TopicWithContent>) =>
    apiClient.put<{ topic: TopicWithContent }>(`/admin/topics/${id}`, data),
  deleteTopic: (id: string) => apiClient.delete(`/admin/topics/${id}`),

  // Translations
  getTranslations: () =>
    apiClient.get<{ translations: Record<string, Record<string, unknown>> }>('/admin/translations'),
  updateTranslations: (locale: string, messages: Record<string, unknown>) =>
    apiClient.put(`/admin/translations/${locale}`, { messages }),
};

export default apiClient;
