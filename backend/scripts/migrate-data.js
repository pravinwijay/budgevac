const { Sequelize } = require('sequelize');
require('dotenv').config();

// Define schema definitions dynamically for a given Sequelize instance
const defineModels = (sequelizeInstance) => {
  const Expense = sequelizeInstance.define('Expense', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: Sequelize.STRING, allowNull: false },
    amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    currency: { type: Sequelize.STRING, allowNull: false },
    category: { type: Sequelize.STRING, allowNull: false }
  }, { timestamps: true });

  const Souvenir = sequelizeInstance.define('Souvenir', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false },
    recipient: { type: Sequelize.STRING, allowNull: false }
  }, { timestamps: true });

  const Activity = sequelizeInstance.define('Activity', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false },
    location: { type: Sequelize.STRING, allowNull: false },
    visited: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false }
  }, { timestamps: true });

  const Person = sequelizeInstance.define('Person', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false }
  }, { timestamps: true });

  return { Expense, Souvenir, Activity, Person };
};

// 1. Connect to Local SQL Server
const localSequelize = new Sequelize(
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

async function runMigration() {
  const targetUrl = process.env.TARGET_DATABASE_URL;
  if (!targetUrl) {
    console.error('Erreur : Veuillez définir la variable d\'environnement TARGET_DATABASE_URL.');
    console.error('Exemple : TARGET_DATABASE_URL=postgresql://user:pass@host:port/db node scripts/migrate-data.js');
    process.exit(1);
  }

  // 2. Connect to Target Cloud DB (Postgres/Other)
  const targetSequelize = new Sequelize(targetUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });

  const localModels = defineModels(localSequelize);
  const targetModels = defineModels(targetSequelize);

  try {
    // Authenticate connections
    await localSequelize.authenticate();
    await targetSequelize.authenticate();
    console.log('Connexions établies avec succès aux deux bases de données.');

    // Extract local data
    console.log('Extraction des données locales...');
    const people = await localModels.Person.findAll({ raw: true });
    const expenses = await localModels.Expense.findAll({ raw: true });
    const souvenirs = await localModels.Souvenir.findAll({ raw: true });
    const activities = await localModels.Activity.findAll({ raw: true });

    console.log(`Données trouvées : ${people.length} personnes, ${expenses.length} dépenses, ${souvenirs.length} souvenirs, ${activities.length} activités.`);

    // Sync cloud database schema
    console.log('Synchronisation du schéma de la base cloud...');
    await targetSequelize.sync({ force: true }); // Recrée les tables à blanc pour éviter les conflits d'ID primaires

    // Import into target database
    if (people.length > 0) {
      console.log('Importation des personnes...');
      await targetModels.Person.bulkCreate(people);
    }
    if (expenses.length > 0) {
      console.log('Importation des dépenses...');
      await targetModels.Expense.bulkCreate(expenses);
    }
    if (souvenirs.length > 0) {
      console.log('Importation des souvenirs...');
      await targetModels.Souvenir.bulkCreate(souvenirs);
    }
    if (activities.length > 0) {
      console.log('Importation des activités...');
      await targetModels.Activity.bulkCreate(activities);
    }

    console.log('Migration de toutes les données complétée avec succès !');
  } catch (error) {
    console.error('Échec de la migration des données :', error);
  } finally {
    await localSequelize.close();
    await targetSequelize.close();
  }
}

runMigration();
