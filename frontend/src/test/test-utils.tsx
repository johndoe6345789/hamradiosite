import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider, createTheme } from '@mui/material';
import authReducer from '../store/slices/authSlice';
import themeReducer from '../store/slices/themeSlice';
import quizReducer from '../store/slices/quizSlice';
import progressReducer from '../store/slices/progressSlice';
import type { AuthState } from '../types/auth';
import type { QuizState } from '../types/quiz';
import type { ProgressState } from '../types/progress';
import messages from '../messages/en.json';

interface ThemeState {
  mode: 'light' | 'dark';
}

interface PreloadedState {
  auth?: Partial<AuthState>;
  theme?: Partial<ThemeState>;
  quiz?: Partial<QuizState>;
  progress?: Partial<ProgressState>;
}

const defaultAuthState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const defaultThemeState: ThemeState = {
  mode: 'light',
};

const defaultQuizState: QuizState = {
  activeQuiz: null,
  result: null,
  loading: false,
  error: null,
};

const defaultProgressState: ProgressState = {
  overall: null,
  topicBreakdown: [],
  weakAreas: [],
  history: [],
  loading: false,
  error: null,
};

export function createTestStore(preloadedState: PreloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer,
      quiz: quizReducer,
      progress: progressReducer,
    },
    preloadedState: {
      auth: { ...defaultAuthState, ...preloadedState.auth },
      theme: { ...defaultThemeState, ...preloadedState.theme },
      quiz: { ...defaultQuizState, ...preloadedState.quiz },
      progress: { ...defaultProgressState, ...preloadedState.progress },
    },
  });
}

const theme = createTheme();

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState;
  store?: ReturnType<typeof createTestStore>;
  locale?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    locale = 'en',
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
