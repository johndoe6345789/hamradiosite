import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-markdown$': '<rootDir>/src/test/__mocks__/react-markdown.tsx',
    '^remark-gfm$': '<rootDir>/src/test/__mocks__/remark-gfm.ts',
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types/**',
    '!src/**/layout.tsx',
    '!src/middleware.ts',
    '!src/i18n/**',
    '!src/app/**',
    '!src/store/store.ts',
    '!src/store/StoreProvider.tsx',
    '!src/theme/ThemeRegistry.tsx',
    '!src/lib/apiClient.ts',
    '!src/test/**',
  ],
};

export default createJestConfig(config);
