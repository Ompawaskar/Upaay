import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate a sample test paper with detectable fields for OCR testing
 * @param {Object} data - The data to include in the test paper
 * @returns {Promise<string>} Path to the generated PDF
 */
export const generateSampleTest = async (data = {}) => {
  // Use provided data or defaults
  const testData = {
    studentName: data.studentName || 'Aarav Sharma',
    studentId: data.studentId || 'STD001',
    subjectName: data.subjectName || 'Mathematics',
    subjectCode: data.subjectCode || 'MATH101',
    testDate: data.testDate || '05/15/2025',
    maxMarks: data.maxMarks || 20,
    marksReceived: data.marksReceived || 18,
    questions: data.questions || [
      { question: "Solve: 2x + 5 = 15", answer: "x = 5", marks: 2 },
      { question: "Find the derivative of f(x) = x²", answer: "f'(x) = 2x", marks: 3 },
      { question: "Calculate the area of a circle with radius 4 cm", answer: "50.24 cm²", marks: 2 }
    ]
  };

  const uploadsDir = path.join(process.cwd(), 'uploads', 'samples');
  
  // Ensure directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const pdfPath = path.join(uploadsDir, `sample_test_${testData.studentId}.pdf`);
  
  // Create PDF
  const doc = new PDFDocument({ 
    margin: 50,
    size: 'A4' 
  });
  
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);
  
  // Set up a school header (this will be easily detectable by OCR)
  doc.fontSize(20).font('Helvetica-Bold')
     .text('EDUCATION FOR ALL INITIATIVE', { align: 'center' });
  doc.fontSize(14)
     .text('Student Assessment Sheet', { align: 'center' });
  doc.moveDown();
  
  // Add horizontal line that's very visible
  doc.moveTo(50, 120)
     .lineTo(550, 120)
     .strokeColor('#000000')
     .lineWidth(2)
     .stroke();
  doc.moveDown(2);
  
  // Student details section - using a layout that's easy for OCR to detect
  doc.fontSize(14).font('Helvetica-Bold')
     .text('STUDENT INFORMATION');
  doc.moveDown(0.5);
  
  // Make key fields very clear and structured
  doc.fontSize(12).font('Helvetica-Bold').text('Student Name: ', 50, doc.y, { continued: true })
     .font('Helvetica').text(testData.studentName);
  
  doc.fontSize(12).font('Helvetica-Bold').text('Roll No: ', 50, doc.y, { continued: true })
     .font('Helvetica').text(testData.studentId);
  doc.moveDown();
  
  // Test details section
  doc.fontSize(14).font('Helvetica-Bold')
     .text('TEST INFORMATION');
  doc.moveDown(0.5);
  
  doc.fontSize(12).font('Helvetica-Bold').text('Subject: ', 50, doc.y, { continued: true })
     .font('Helvetica').text(testData.subjectName);
  
  doc.fontSize(12).font('Helvetica-Bold').text('Subject Code: ', 50, doc.y, { continued: true })
     .font('Helvetica').text(testData.subjectCode);
  
  doc.fontSize(12).font('Helvetica-Bold').text('Date: ', 50, doc.y, { continued: true })
     .font('Helvetica').text(testData.testDate);
  
  doc.fontSize(12).font('Helvetica-Bold').text('Maximum Marks: ', 50, doc.y, { continued: true })
     .font('Helvetica').text(testData.maxMarks.toString());
  doc.moveDown(2);
  
  // Create a questions section
  doc.fontSize(14).font('Helvetica-Bold')
     .text('QUESTIONS & ANSWERS');
  doc.moveDown();
  
  // Add questions and sample answers
  testData.questions.forEach((q, index) => {
    doc.fontSize(12).font('Helvetica-Bold')
       .text(`Q${index+1}. ${q.question} (${q.marks} marks)`);
    doc.fontSize(12).font('Helvetica-Oblique')
       .text(`Answer: ${q.answer}`);
    doc.moveDown();
  });
  
  // Add total marks in a very prominent way (for OCR to detect easily)
  doc.moveDown(2);
  doc.fontSize(16).font('Helvetica-Bold')
     .text('MARKS OBTAINED: ', { continued: true, underline: true })
     .fillColor('red')  // Red color makes it stand out for OCR
     .text(`${testData.marksReceived} / ${testData.maxMarks}`, { underline: true });
  
  // Add teacher signature section
  doc.moveDown(3);
  doc.fillColor('black').fontSize(12).font('Helvetica')
     .text('Graded by: ________________________', { align: 'right' });
  doc.fontSize(10)
     .text('Volunteer Signature', 430, doc.y);
  
  // Add date
  doc.moveDown();
  doc.fontSize(12).font('Helvetica')
     .text(`Date: ${testData.testDate}`, { align: 'right' });
  
  // Finalize the PDF
  doc.end();
  
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(pdfPath));
    writeStream.on('error', reject);
  });
};

// Export a function to generate multiple sample tests
export const generateMultipleSampleTests = async (count = 5) => {
  const students = [
    { name: 'Aarav Sharma', id: 'STD001', marks: 18 },
    { name: 'Priya Patel', id: 'STD002', marks: 15 },
    { name: 'Rohit Kumar', id: 'STD003', marks: 20 },
    { name: 'Sneha Singh', id: 'STD004', marks: 17 },
    { name: 'Arjun Gupta', id: 'STD005', marks: 12 },
    { name: 'Kavya Reddy', id: 'STD006', marks: 19 },
    { name: 'Vikram Joshi', id: 'STD007', marks: 14 },
    { name: 'Ananya Mehta', id: 'STD008', marks: 16 },
    { name: 'Rahul Verma', id: 'STD009', marks: 13 },
    { name: 'Diya Agarwal', id: 'STD010', marks: 19 }
  ];
  
  const subjects = [
    { name: 'Mathematics', code: 'MATH101' },
    { name: 'Science', code: 'SCI102' },
    { name: 'English', code: 'ENG103' },
    { name: 'History', code: 'HIST104' },
    { name: 'Geography', code: 'GEO105' }
  ];
  
  const results = [];
  
  // Generate sample tests, limit to available student data
  const actualCount = Math.min(count, students.length);
  
  for (let i = 0; i < actualCount; i++) {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const test = await generateSampleTest({
      studentName: students[i].name,
      studentId: students[i].id,
      subjectName: subject.name,
      subjectCode: subject.code,
      marksReceived: students[i].marks
    });
    
    results.push({
      path: test,
      student: students[i],
      subject: subject
    });
  }
  
  return results;
};

export default generateSampleTest;