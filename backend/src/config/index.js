const path = require('path');

// Determine which .env file to load
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

// Load the appropriate .env file
require('dotenv').config({ 
  path: path.resolve(__dirname, '..', '..', envFile) 
});

module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 8080,
  databaseUrl: process.env.DATABASE_URL
};