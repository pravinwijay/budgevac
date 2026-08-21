const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// GET all activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.findAll({ order: [['createdAt', 'DESC']] });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add new activity
router.post('/', async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newActivity = await Activity.create({ name, location });
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update activity (visited status, name, location)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { visited, name, location } = req.body;
    
    const activity = await Activity.findByPk(id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    if (name !== undefined) activity.name = name;
    if (location !== undefined) activity.location = location;
    if (visited !== undefined) activity.visited = visited;
    
    await activity.save();
    
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE an activity
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Activity.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Activity deleted' });
    } else {
      res.status(404).json({ error: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
