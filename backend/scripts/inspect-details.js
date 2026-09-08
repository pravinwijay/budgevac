const sequelize = require('../config/db');
const Expense = require('../models/Expense');
const Person = require('../models/Person');

async function inspect() {
  try {
    await sequelize.authenticate();
    const expenses = await Expense.findAll({ raw: true });
    const people = await Person.findAll({ raw: true });
    
    console.log('--- DETAILS DÉPENSES ---');
    console.log(expenses);
    console.log('--- DETAILS PERSONNES ---');
    console.log(people);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}
inspect();
