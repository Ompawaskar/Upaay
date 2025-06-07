import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import volunteerRoutes from './routes/volunteer.routes.js';
import testRoutes from './routes/test.routes.js';
import studentRoutes from './routes/student.routes.js';
import ocrRoutes from './routes/ocr.routes.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Add this to parse JSON request bodies

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 3000;
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/ocr', ocrRoutes);

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('MongoDB connected successfully');

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
).catch(err => {
  console.error('MongoDB connection error:', err);
});

