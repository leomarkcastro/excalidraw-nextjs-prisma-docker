/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',

  testEnvironment: 'node',

  transform: {
    'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
  },

  transformIgnorePatterns: ['node_modules/(?!variables/.*)'],

  // Stop running tests after `n` failures
  bail: 1,

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  setupFiles: ['<rootDir>/scripts/loadEnvironmentVars.ts'],
};

export default config;
