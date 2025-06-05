// Configuration for the backend
module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://hanzalahtahir93:MlqeZmN0E8XoYigV@hazri-system.2jysq5c.mongodb.net/hazri-system',
  JWT_SECRET: process.env.JWT_SECRET || 'hazri-system-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h'
}; 