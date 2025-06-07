import express from 'express';
import Test from '../models/test.js';

const router = express.Router();

// Get all tests
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single test
router.get('/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new test
router.post('/', async (req, res) => {
  const test = new Test(req.body);
  try {
    const newTest = await test.save();
    res.status(201).json(newTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a test
router.patch('/:id', async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a test
router.delete('/:id', async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json({ message: 'Test deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a question to a test
router.post('/:id/questions', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    
    test.questions.push(req.body);
    const updatedTest = await test.save();
    res.status(201).json(updatedTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a question from a test
router.delete('/:testId/questions/:questionId', async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    
    test.questions = test.questions.filter(q => q._id.toString() !== req.params.questionId);
    const updatedTest = await test.save();
    res.json(updatedTest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;