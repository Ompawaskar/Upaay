import Tesseract from 'tesseract.js';
import { createCanvas, loadImage } from 'canvas';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Process an uploaded image with OCR and extract student test information
 * @param {File} imageFile - The uploaded image file
 * @returns {Promise<Object>} Extracted test data
 */
export const processTestImage = async (imageFile) => {
  try {
    // 1. Perform OCR on the uploaded image
    const { data } = await Tesseract.recognize(
      imageFile,
      'eng',
      { logger: m => console.log(m) }
    );
    
    console.log("OCR Text Result:", data.text);
    
    // 2. Extract relevant information using regex patterns
    const extractedData = {
      studentName: extractStudentName(data.text),
      studentId: extractStudentId(data.text),
      subjectName: extractSubjectName(data.text),
      subjectCode: extractSubjectCode(data.text),
      testDate: extractTestDate(data.text),
      maxMarks: extractMaxMarks(data.text),
      marksReceived: extractMarksReceived(data.text)
    };
    
    // 3. Generate a standardized PDF with the extracted data
    const pdfPath = await generateStandardizedPDF(imageFile, extractedData);
    
    return {
      ...extractedData,
      pdfPath,
      success: true
    };
  } catch (error) {
    console.error("OCR Processing Error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Extract student name from OCR text using pattern matching
 */
function extractStudentName(text) {
  // Look for patterns like "Name: John Doe" or "Student Name: John Doe"
  const nameMatch = text.match(/(?:name|student name)\s*:\s*([^\n]+)/i);
  return nameMatch ? nameMatch[1].trim() : '';
}

/**
 * Extract student ID from OCR text
 */
function extractStudentId(text) {
  // Look for patterns like "ID: 12345" or "Roll No: 12345" or "Student ID: 12345"
  const idMatch = text.match(/(?:id|roll no|student id|roll number)\s*:\s*([a-z0-9]+)/i);
  return idMatch ? idMatch[1].trim() : '';
}

/**
 * Extract subject name from OCR text
 */
function extractSubjectName(text) {
  const subjectMatch = text.match(/(?:subject|course)\s*:\s*([^\n]+)/i);
  return subjectMatch ? subjectMatch[1].trim() : '';
}

/**
 * Extract subject code from OCR text
 */
function extractSubjectCode(text) {
  const codeMatch = text.match(/(?:subject code|course code)\s*:\s*([a-z0-9]+)/i);
  return codeMatch ? codeMatch[1].trim() : '';
}

/**
 * Extract test date from OCR text
 */
function extractTestDate(text) {
  // Look for date patterns
  const dateMatch = text.match(/(?:date|test date|exam date)\s*:\s*([^\n]+)/i);
  if (dateMatch) {
    return dateMatch[1].trim();
  }
  
  // If no explicit date label, try to find date formats
  const datePatternMatch = text.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/);
  return datePatternMatch ? datePatternMatch[0] : '';
}

/**
 * Extract maximum marks from OCR text
 */
function extractMaxMarks(text) {
  const maxMarksMatch = text.match(/(?:max marks|maximum marks|total marks)\s*:\s*(\d+)/i);
  return maxMarksMatch ? parseInt(maxMarksMatch[1]) : 0;
}

/**
 * Extract marks received from OCR text
 */
function extractMarksReceived(text) {
  // Look for marks patterns, typically found near words like "score", "marks", "obtained"
  const marksMatch = text.match(/(?:marks obtained|score|marks received|obtained marks)\s*:\s*(\d+)/i);
  
  // If not found with labels, try to find marks with "/", like "15/20"
  if (!marksMatch) {
    const fractionMatch = text.match(/(\d+)\s*\/\s*\d+/);
    return fractionMatch ? parseInt(fractionMatch[1]) : 0;
  }
  
  return marksMatch ? parseInt(marksMatch[1]) : 0;
}

/**
 * Generate a standardized PDF with extracted data and the original image
 */
async function generateStandardizedPDF(imageFile, data) {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const timestamp = Date.now();
  const pdfPath = path.join(uploadsDir, `test_${data.studentId || timestamp}.pdf`);
  
  // Create PDF
  const doc = new PDFDocument({ margin: 50 });
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);
  
  // Add header
  doc.font('Helvetica-Bold').fontSize(24)
     .text('Student Test Assessment', { align: 'center' });
  doc.moveDown();
  
  // Add student information
  doc.font('Helvetica-Bold').fontSize(14).text('Student Information');
  doc.font('Helvetica').fontSize(12)
     .text(`Name: ${data.studentName || 'Not detected'}`)
     .text(`Student ID: ${data.studentId || 'Not detected'}`);
  doc.moveDown();
  
  // Add test information
  doc.font('Helvetica-Bold').fontSize(14).text('Test Information');
  doc.font('Helvetica').fontSize(12)
     .text(`Subject: ${data.subjectName || 'Not detected'}`)
     .text(`Subject Code: ${data.subjectCode || 'Not detected'}`)
     .text(`Date: ${data.testDate || 'Not detected'}`)
     .text(`Maximum Marks: ${data.maxMarks || 'Not detected'}`);
  doc.moveDown();
  
  // Add marks received in red
  doc.font('Helvetica-Bold').fontSize(16)
     .fillColor('red')
     .text(`Marks Received: ${data.marksReceived || 'Not detected'}`, { align: 'left' });
  doc.fillColor('black');
  doc.moveDown();
  
  // Add the original image
  try {
    const image = await loadImage(imageFile);
    const imgWidth = doc.page.width - 100;
    const imgHeight = (image.height * imgWidth) / image.width;
    
    doc.image(imageFile, 50, doc.y, { 
      width: imgWidth,
      height: imgHeight
    });
  } catch (error) {
    console.error("Error adding image to PDF:", error);
    doc.text("Error embedding original image", { align: 'center' });
  }
  
  // Finalize the PDF
  doc.end();
  
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(pdfPath));
    writeStream.on('error', reject);
  });
}

export default processTestImage;