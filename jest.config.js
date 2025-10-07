const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@code-examples/(.*)$': '<rootDir>/code-examples/$1',
  },
  
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
    '^.+\\.py$': '<rootDir>/jest.pyTransform.js',
  },
  
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'py'],
};

module.exports = createJestConfig(config);