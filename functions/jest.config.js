module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: ['**/routes/**/*.js', '**/Config/**/*.js', '**/Model/**/*.js', '**/server.js'],
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: ['/node_modules/']
  };