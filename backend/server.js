import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import volunteerRoutes from './routes/volunteer.routes.js';
import testRoutes from './routes/test.routes.js';
import studentRoutes from './routes/student.routes.js';

dotenv.config();

const app = express();
app.use(cors());

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/volunteers', volunteerRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/students', studentRoutes);


mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('MongoDB connected successfully');

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
).catch(err => {
  console.error('MongoDB connection error:', err);
}); 

