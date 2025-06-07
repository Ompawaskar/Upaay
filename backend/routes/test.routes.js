import express from 'express';
import Test from '../models/test.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'tests');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const studentId = req.body.studentId || 'unknown';
    const subject = req.body.testSubject || 'test';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${studentId}_${subject}_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

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

// Upload an image for a test
router.post('/upload-image', upload.single('testImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No image file provided'
      });
    }
    
    // Create a public URL for the image
    const imageUrl = `/uploads/tests/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading test image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading test image',
      error: error.message
    });
  }
});

export default router;