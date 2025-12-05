module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/server.js',
    '!src/config/**'
  ]
};