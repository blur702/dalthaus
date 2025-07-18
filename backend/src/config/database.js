const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'admin_db',
  process.env.DB_USER || 'kevin',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  }
);

module.exports = sequelize;