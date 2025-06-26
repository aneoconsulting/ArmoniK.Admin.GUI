/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import structuredClone from '@ungap/structured-clone';
import { createCjsPreset } from 'jest-preset-angular/presets';
import type {Config} from 'jest';

export default {
  ...createCjsPreset(),
  clearMocks: true,
    globals: {
    structuredClone,
  },
  moduleNameMapper: {
    '@components/(.*)': '<rootDir>/src/app/components/$1',
    '@services/(.*)': '<rootDir>/src/app/services/$1',
    '@pipes/(.*)': '<rootDir>/src/app/pipes/$1',
    '@app/(.*)': '<rootDir>/src/app/$1'
  },
  testEnvironment: './JSDOMEnvironmentPatch.ts',
  testEnvironmentOptions: {
    customExportConditions: ['named']
  },
  setupFilesAfterEnv: [
    '<rootDir>/setup-jest.ts'
  ],
} satisfies Config;
