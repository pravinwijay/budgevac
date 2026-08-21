const { Sequelize } = require('sequelize');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;
let sequelize;

if (databaseUrl) {
  // Database connection string (commonly used for PostgreSQL in cloud deployment)
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  const dialect = process.env.DB_DIALECT || 'mssql';
  
  if (dialect === 'mssql') {
    sequelize = new Sequelize(
      process.env.DB_NAME || 'travel_db',
      process.env.DB_USER || 'sa',
      process.env.DB_PASSWORD || 'PasswordStrong2026!',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '1433', 10),
        dialect: 'mssql',
        dialectOptions: {
          options: {
            encrypt: false,
            trustServerCertificate: true
          }
        },
        logging: false
      }
    );
  } else {
    sequelize = new Sequelize(
      process.env.DB_NAME || 'travel_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: 'postgres',
        logging: false
      }
    );
  }
}

module.exports = sequelize;
