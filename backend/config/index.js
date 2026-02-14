// Environment-specific configuration
module.exports = {
  development: {
    port: process.env.PORT || 5001,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/agrova',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    corsOrigins: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175'
    ],
    rateLimit: {
      general: 1000,
      auth: 5,
      mutation: 30,
      read: 100
    },
    pagination: {
      defaultLimit: 20,
      maxLimit: 100
    }
  },
  
  production: {
    port: process.env.PORT || 5000,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '15m',
    corsOrigins: [process.env.FRONTEND_URL].filter(Boolean),
    rateLimit: {
      general: 100,
      auth: 5,
      mutation: 20,
      read: 60
    },
    pagination: {
      defaultLimit: 20,
      maxLimit: 50
    },
    mongodb: {
      options: {
        maxPoolSize: 100,
        minPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      }
    }
  },
  
  test: {
    port: 5002,
    mongodbUri: 'mongodb://localhost:27017/agrova_test',
    jwtSecret: 'test_secret_key',
    jwtExpire: '1d',
    corsOrigins: ['http://localhost:3000'],
    rateLimit: {
      general: 10000,
      auth: 1000,
      mutation: 1000,
      read: 1000
    },
    pagination: {
      defaultLimit: 20,
      maxLimit: 100
    }
  }
};

// Get current environment config
const env = process.env.NODE_ENV || 'development';
const config = module.exports[env];

if (!config) {
  throw new Error(`Invalid NODE_ENV: ${env}`);
}

module.exports.current = config;
