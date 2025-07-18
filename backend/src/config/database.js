const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Load configuration from external file
const configPath = path.join('/var/www/config', 'database.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Determine environment
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance with external config
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres',
    logging: false
  }
);

module.exports = sequelize;