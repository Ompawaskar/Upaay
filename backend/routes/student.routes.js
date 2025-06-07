import { Router } from 'express';
import Student from '../models/student.js';
import Test from '../models/test.js';
import Volunteer from '../models/volunteer.js';

const router = Router();

// New route to save test results for students
router.post('/save-test-results', async (req, res) => {
  try {
    const { testData, studentResults, volunteerId } = req.body;
    
    // Validate request data
    if (!testData || !studentResults || !studentResults.length) {
      return res.status(400).json({
        success: false,
        message: 'Missing required data: testData or studentResults'
      });
    }
    
    // Create a new test record
    const test = new Test({
      subject: testData.subject,
      date: new Date(testData.date),
      centerLocation: testData.centerLocation,
      maxMarks: Number(testData.maxMarks),
      imageLink: testData.imageLink || ''
    });
    
    const savedTest = await test.save();
    console.log(`Created test record: ${savedTest._id}`);
    
    // Process each student's results
    const successfulUpdates = [];
    const failedUpdates = [];
    
    for (const result of studentResults) {
      try {
        // Find the student by roll number
        const student = await Student.findOne({ rollNo: result.rollNo });
        
        if (!student) {
          console.log(`Student not found with roll no: ${result.rollNo}`);
          failedUpdates.push({
            rollNo: result.rollNo,
            reason: 'Student not found'
          });
          continue;
        }
        
        // Create the test result record
        const testResult = {
          test: savedTest._id,
          marksObtained: Number(result.marks),
          submissionImage: result.imageUrl || '',
          gradedBy: volunteerId,
          gradedAt: new Date()
        };
        
        // Add the test result to the student
        student.testResults.push(testResult);
        await student.save();
        
        successfulUpdates.push({
          rollNo: result.rollNo,
          name: student.name
        });
        
      } catch (error) {
        console.error(`Error updating student ${result.rollNo}:`, error);
        failedUpdates.push({
          rollNo: result.rollNo,
          reason: error.message
        });
      }
    }
    
    console.log(`Successfully updated ${successfulUpdates.length} students`);
    
    res.status(201).json({
      success: true,
      message: `Successfully saved test results for ${successfulUpdates.length} students`,
      testId: savedTest._id,
      successfulUpdates,
      failedUpdates
    });
    
  } catch (err) {
    console.error('Error saving test results:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to save test results',
      error: err.message
    });
  }
});

// Get test results for a specific student
router.get('/:studentId/test-results', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .populate({
        path: 'testResults.test',
        select: 'subject date centerLocation maxMarks'
      })
      .populate({
        path: 'testResults.gradedBy',
        select: 'name'
      });
      
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student.testResults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// In the handleSave function of StudentTest.jsx, add this:

const handleSave = async () => {
  const gradedStudents = students.filter(s => s.marks !== '');
  
  try {
    // Assuming you have the volunteer ID from authentication
    const volunteerId = "volunteer-id-here"; // Replace with actual volunteer ID from auth
    
    const testData = {
      subject,
      date,
      centerLocation: "Your Center Location", // Add a field to your form to capture this
      maxMarks,
      imageLink: "" // Optional
    };
    
    const studentResults = gradedStudents.map(student => ({
      rollNo: student.rollNo,
      marks: student.marks,
      imageUrl: student.file ? URL.createObjectURL(student.file) : ""
    }));
    
    const response = await fetch('http://localhost:3000/api/students/save-test-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testData,
        studentResults,
        volunteerId
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert(`Successfully saved grades for ${gradedStudents.length} students!`);
    } else {
      alert('Error saving grades: ' + data.message);
    }
  } catch (error) {
    console.error('Error saving grades:', error);
    alert('Failed to save grades. Please try again later.');
  }
};

export default router;