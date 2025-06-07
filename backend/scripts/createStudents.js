import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from '../models/student.js';

dotenv.config();

// Array of student data matching the frontend demo data
const studentData = [
  { name: 'Aarav Sharma', rollNo: 'STD001', age: 12, location: 'Mumbai Center' },
  { name: 'Priya Patel', rollNo: 'STD002', age: 11, location: 'Mumbai Center' },
  { name: 'Rohit Kumar', rollNo: 'STD003', age: 13, location: 'Delhi Center' },
  { name: 'Sneha Singh', rollNo: 'STD004', age: 12, location: 'Delhi Center' },
  { name: 'Arjun Gupta', rollNo: 'STD005', age: 14, location: 'Mumbai Center' },
  { name: 'Kavya Reddy', rollNo: 'STD006', age: 11, location: 'Bangalore Center' },
  { name: 'Vikram Joshi', rollNo: 'STD007', age: 13, location: 'Bangalore Center' },
  { name: 'Ananya Mehta', rollNo: 'STD008', age: 12, location: 'Chennai Center' },
  { name: 'Rahul Verma', rollNo: 'STD009', age: 14, location: 'Chennai Center' },
  { name: 'Diya Agarwal', rollNo: 'STD010', age: 10, location: 'Mumbai Center' }
];

async function createStudents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Create students
    for (const data of studentData) {
      try {
        // Check if student already exists
        const existingStudent = await Student.findOne({ rollNo: data.rollNo });
        
        if (existingStudent) {
          console.log(`Student ${data.name} (${data.rollNo}) already exists`);
          continue;
        }
        
        // Create new student
        const student = new Student({
          name: data.name,
          age: data.age,
          rollNo: data.rollNo,
          location: data.location,
          level: Math.floor(Math.random() * 5) + 1 // Random level 1-5
        });
        
        await student.save();
        console.log(`Created student: ${data.name} (${data.rollNo})`);
        
      } catch (error) {
        console.error(`Error creating student ${data.rollNo}:`, error);
      }
    }
    
    console.log('Finished creating students');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

createStudents();