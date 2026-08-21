const express = require('express');
const router = express.Router();
const Person = require('../models/Person');

// GET all people
router.get('/', async (req, res) => {
  try {
    const people = await Person.findAll({ order: [['name', 'ASC']] });
    res.json(people);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add a new person
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const newPerson = await Person.create({ name });
    res.status(201).json(newPerson);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Cette personne existe déjà' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE a person
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Person.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Person deleted' });
    } else {
      res.status(404).json({ error: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
