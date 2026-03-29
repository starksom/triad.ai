/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  testMatch: ['**/src/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/providers/**/*.ts',
    'src/multi-model/**/*.ts',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    './src/providers/': {
      lines: 80,
      branches: 70,
      functions: 60,
      statements: 80,
    },
    './src/multi-model/': {
      lines: 60,
      branches: 45,
      functions: 60,
      statements: 60,
    },
  },
};
