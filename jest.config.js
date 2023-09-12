module.exports = {
  preset: 'jest-preset-angular',
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@services/(.*)': '<rootDir>/src/app/services/$1',
    '@pipes/(.*)': '<rootDir>/src/app/pipes/$1',
    '@components/(.*)': '<rootDir>/src/app/components/$1'
  },
  setupFiles: [
    './jest.setup.ts'
  ]
}