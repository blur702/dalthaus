const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Determine environment
const env = process.env.NODE_ENV || 'development';

let dbConfig;

// Use environment variables if available (production)
if (process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD) {
  dbConfig = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432
  };
} else {
  // Fall back to config file for development
  try {
    const configPath = path.join('/var/www/config', 'database.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    dbConfig = config[env];
  } catch (error) {
    console.error('Database configuration not found. Please set environment variables or create /var/www/config/database.json');
    process.exit(1);
  }
}

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres',
    logging: env === 'development' ? console.log : false
  }
);

module.exports = sequelize;