const sequelize = require('../config/db');
const Expense = require('../models/Expense');
const Souvenir = require('../models/Souvenir');
const Activity = require('../models/Activity');
const Person = require('../models/Person');

async function checkData() {
  try {
    await sequelize.authenticate();
    const expenses = await Expense.findAll({ raw: true });
    const souvenirs = await Souvenir.findAll({ raw: true });
    const activities = await Activity.findAll({ raw: true });
    const people = await Person.findAll({ raw: true });

    console.log('--- DIAGNOSTIC DATA ---');
    console.log('Dépenses :', expenses.length);
    console.log('Souvenirs :', souvenirs.length);
    console.log('Activités :', activities.length);
    console.log('Membres (Personnes) :', people.length);
    console.log('-----------------------');
  } catch (error) {
    console.error('Erreur lors du diagnostic :', error.message);
  } finally {
    await sequelize.close();
  }
}

checkData();
