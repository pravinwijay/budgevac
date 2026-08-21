const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// GET all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.findAll({ order: [['createdAt', 'DESC']] });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add new expense
router.post('/', async (req, res) => {
  try {
    const { description, amount, currency, category } = req.body;
    if (!description || amount === undefined || !currency || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newExpense = await Expense.create({
      description,
      amount: parseFloat(amount),
      currency,
      category
    });
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE an expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Expense deleted' });
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update an expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, currency, category } = req.body;
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    if (description !== undefined) expense.description = description;
    if (amount !== undefined) expense.amount = parseFloat(amount);
    if (currency !== undefined) expense.currency = currency;
    if (category !== undefined) expense.category = category;
    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
