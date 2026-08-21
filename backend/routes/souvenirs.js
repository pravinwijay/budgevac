const express = require('express');
const router = express.Router();
const Souvenir = require('../models/Souvenir');

// GET all souvenirs
router.get('/', async (req, res) => {
  try {
    const souvenirs = await Souvenir.findAll({ order: [['createdAt', 'DESC']] });
    res.json(souvenirs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add new souvenir
router.post('/', async (req, res) => {
  try {
    const { name, recipient } = req.body;
    if (!name || !recipient) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newSouvenir = await Souvenir.create({ name, recipient });
    res.status(201).json(newSouvenir);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a souvenir
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Souvenir.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Souvenir deleted' });
    } else {
      res.status(404).json({ error: 'Souvenir not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update a souvenir
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, recipient } = req.body;
    const souvenir = await Souvenir.findByPk(id);
    if (!souvenir) {
      return res.status(404).json({ error: 'Souvenir not found' });
    }
    if (name !== undefined) souvenir.name = name;
    if (recipient !== undefined) souvenir.recipient = recipient;
    await souvenir.save();
    res.json(souvenir);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
