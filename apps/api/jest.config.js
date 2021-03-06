module.exports = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  globalSetup: '<rootDir>/test/globalSetup.ts',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api',
  coverageReporters: ['lcov', 'html'],
};
