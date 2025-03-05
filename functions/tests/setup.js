const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock Firebase Functions
jest.mock('firebase-functions', () => ({
  https: { onRequest: jest.fn((handler) => handler) }
}));

// Define a mock ObjectId outside the factory
const mockUserId = new mongoose.Types.ObjectId().toString();

// Mock Passport
jest.mock('passport', () => {
  const mockAuthenticate = jest.fn((strategy, options) => (req, res, next) => {
    if (strategy === 'google') {
      req.user = { email: 'test@example.com', userName: 'Test User' };
      next();
    } else if (strategy === 'jwt') {
      req.user = { _id: mockUserId };
      next();
    } else {
      next(new Error('Authentication failed'));
    }
  });

  return {
    initialize: jest.fn(() => (req, res, next) => next()),
    session: jest.fn(() => (req, res, next) => next()),
    authenticate: mockAuthenticate,
    use: jest.fn(),
    serializeUser: jest.fn(),
    deserializeUser: jest.fn(),
  };
});

// Mock connect-mongo
jest.mock('connect-mongo', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    destroy: jest.fn()
  }))
}));

// Mock JWT Helpers
jest.mock('../Utils/Helpers', () => ({
  getToken: jest.fn(async (email, user) => `mock-jwt-token-${email}`),
  invalidateToken: jest.fn((token) => true),
  verifyToken: jest.fn((token) => ({ email: 'test@example.com', identifier: mockUserId })),
  isTokenInvalid: jest.fn((token) => token === 'invalid-token')
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(async (password, saltRounds) => `hashed-${password}`),
  compare: jest.fn(async (password, hash) => password === hash.replace('hashed-', ''))
}));

// Mock console.error and console.log to suppress logs during tests
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

// Set up in-memory MongoDB with increased timeout
let mongoServer;

beforeAll(async () => {
  jest.setTimeout(30000);
  try {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        startupTimeout: 30000
      }
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  } catch (error) {
    console.error('Failed to start MongoMemoryServer:', error);
    throw error;
  }
}, 30000);

afterEach(async () => {
  jest.setTimeout(10000);
  await mongoose.connection.dropDatabase();
  jest.clearAllMocks();
});

afterAll(async () => {
  jest.setTimeout(10000);
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
  console.error.mockRestore();
  console.log.mockRestore();
}, 10000);

module.exports = { mockUserId };