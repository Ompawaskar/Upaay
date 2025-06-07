import express from 'express';
import Volunteer from '../models/volunteer.js';

const router = express.Router();

// Get all volunteers
router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single volunteer
router.get('/:id', async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new volunteer
router.post('/', async (req, res) => {
  const volunteer = new Volunteer(req.body);
  try {
    const newVolunteer = await volunteer.save();
    res.status(201).json(newVolunteer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a volunteer
router.patch('/:id', async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.json(volunteer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a volunteer
router.delete('/:id', async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.json({ message: 'Volunteer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;