const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const expenseRoutes = require('./routes/expenses');
const souvenirRoutes = require('./routes/souvenirs');
const activityRoutes = require('./routes/activities');
const peopleRoutes = require('./routes/people');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/souvenirs', souvenirRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/people', peopleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Travel Manager API is running' });
});

// Database Synchronization & Server Start
const { Sequelize } = require('sequelize');

async function startServer() {
  try {
    const dialect = process.env.DB_DIALECT || 'mssql';
    const dbName = process.env.DB_NAME || 'travel_db';

    // Auto-create local SQL Server database if it doesn't exist
    if (!process.env.DATABASE_URL && dialect === 'mssql') {
      const tempSequelize = new Sequelize(
        'master',
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
      
      try {
        await tempSequelize.authenticate();
        await tempSequelize.query(`
          IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '${dbName}')
          BEGIN
            CREATE DATABASE ${dbName};
          END
        `);
        console.log(`Database '${dbName}' check completed successfully.`);
      } catch (err) {
        console.warn('Database check/create using master database failed, continuing with direct connection:', err.message);
      } finally {
        await tempSequelize.close();
      }
    }

    // Authenticate and sync database models
    await sequelize.authenticate();
    console.log('Successfully connected to the database.');
    
    // sync creates tables if they do not exist
    await sequelize.sync();
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database or start the server:', error);
    process.exit(1);
  }
}

startServer();
