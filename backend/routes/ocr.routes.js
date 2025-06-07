import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'tests');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `test-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });
const router = Router();

// Process a test image with OCR
router.post('/process-test', upload.single('testImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    console.log(`Processing image: ${req.file.path}`);
    
    // Preprocess the image for better OCR results
    const processedImagePath = await preprocessImage(req.file.path);
    
    // Improved OCR settings for better handwriting recognition
    const { data } = await Tesseract.recognize(
      processedImagePath,
      'eng',
      { 
        logger: m => console.log(`OCR progress: ${m.status} (${Math.floor(m.progress * 100)}%)`),
        tessedit_ocr_engine_mode: 2, // Legacy engine which sometimes works better for handwriting
        tessedit_pageseg_mode: 6,    // Assume a single uniform block of text
        preserve_interword_spaces: '1',
        tessjs_create_hocr: '1',     // Create HOCR output
        tessjs_create_tsv: '1'       // Create TSV output for more analysis
      }
    );
    
    console.log("OCR completed successfully");
    console.log("Raw text detected:");
    console.log(data.text);
    
    // Extract information with enhanced techniques
    const studentName = extractStudentName(data.text);
    const studentId = extractStudentId(data.text) || req.body.studentId;
    const subjectName = extractSubjectName(data.text);
    const subjectCode = extractSubjectCode(data.text);
    const testDate = extractTestDate(data.text);
    const maxMarks = extractMaxMarks(data.text);
    
    // Enhanced marks extraction for handwritten numbers
    const marksReceived = extractMarksReceivedEnhanced(data.text);
    
    // Log the extracted information
    console.log({
      studentName,
      studentId,
      subjectName,
      subjectCode,
      testDate,
      maxMarks,
      marksReceived
    });

    // Create a public URL for the image
    const imageUrl = `/uploads/tests/${path.basename(req.file.path)}`;
    
    res.json({
      success: true,
      text: data.text,
      studentName,
      studentId,
      subjectName,
      subjectCode,
      testDate,
      maxMarks,
      marksReceived,
      imageUrl,
      confidence: data.confidence
    });
    
  } catch (error) {
    console.error('OCR Processing Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing test image',
      error: error.message
    });
  }
});

// Helper functions to extract data from OCR text
function extractStudentName(text) {
  // Look for patterns like "Name: John Doe" or "Student Name: John Doe"
  const nameMatch = text.match(/(?:name|student name)\s*:?\s*([^\n]+)/i);
  return nameMatch ? nameMatch[1].trim() : '';
}

function extractStudentId(text) {
  // Look for patterns like "ID: 12345" or "Roll No: 12345" or "Student ID: 12345"
  const idMatch = text.match(/(?:id|roll no|student id|roll number)\s*:?\s*([a-z0-9]+)/i);
  return idMatch ? idMatch[1].trim() : '';
}

function extractSubjectName(text) {
  const subjectMatch = text.match(/(?:subject|course)\s*:?\s*([^\n]+)/i);
  return subjectMatch ? subjectMatch[1].trim() : '';
}

function extractSubjectCode(text) {
  const codeMatch = text.match(/(?:subject code|course code)\s*:?\s*([a-z0-9]+)/i);
  return codeMatch ? codeMatch[1].trim() : '';
}

function extractTestDate(text) {
  // Look for date patterns
  const dateMatch = text.match(/(?:date|test date|exam date)\s*:?\s*([^\n]+)/i);
  if (dateMatch) {
    return dateMatch[1].trim();
  }
  
  // If no explicit date label, try to find date formats
  const datePatternMatch = text.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/);
  return datePatternMatch ? datePatternMatch[0] : '';
}

function extractMaxMarks(text) {
  const maxMarksMatch = text.match(/(?:max marks|maximum marks|total marks)\s*:?\s*(\d+)/i);
  return maxMarksMatch ? parseInt(maxMarksMatch[1]) : 0;
}

// Enhanced function to extract marks, focusing on handwritten text patterns
function extractMarksReceivedEnhanced(text) {
  // First try the standard patterns for typed text
  const marksMatch = text.match(/(?:marks obtained|marks received|obtained|score)\s*:?\s*(\d+)/i);
  if (marksMatch) {
    return parseInt(marksMatch[1]);
  }
  
  // Try to find marks with "/", like "15/20"
  const fractionMatch = text.match(/(\d+)\s*\/\s*\d+/);
  if (fractionMatch) {
    return parseInt(fractionMatch[1]);
  }
  
  // Look for red text markers that might indicate marks (from PDF extraction)
  const redTextMatch = text.match(/marks\s*:?\s*(\d+)/i);
  if (redTextMatch) {
    return parseInt(redTextMatch[1]);
  }
  
  // Look for isolated numbers that might be marks
  // This is more aggressive but helps with handwritten forms
  // We look for numbers between 0-100 as they're likely to be marks
  const numberMatches = text.match(/\b([0-9]{1,2}|100)\b/g);
  if (numberMatches && numberMatches.length > 0) {
    // Find numbers between 0-100 that might represent marks
    const possibleMarks = numberMatches
      .map(num => parseInt(num))
      .filter(num => num >= 0 && num <= 100);
    
    // If we have potential marks, use heuristics:
    // 1. If there's only one number in range 0-100, it's likely the mark
    // 2. If there are multiple, take the most prominent one (not a date component)
    if (possibleMarks.length === 1) {
      return possibleMarks[0];
    } else if (possibleMarks.length > 1) {
      // Try to find a number near keywords like "marks", "score", "grade"
      const marksContext = text.match(/(?:marks|score|grade|result|total).{0,20}(\d+)/i);
      if (marksContext) {
        return parseInt(marksContext[1]);
      }
      
      // Otherwise, find the most likely mark based on position and context
      // For simplicity here, we'll just take the highest value in a reasonable range
      const likelyMarks = possibleMarks.filter(num => num > 0 && num <= 20);
      if (likelyMarks.length > 0) {
        return Math.max(...likelyMarks);
      }
    }
  }
  
  // If all else fails, return 0
  return 0;
}

// Preprocess the image for better OCR results
async function preprocessImage(imagePath) {
  const outputPath = imagePath.replace(/\.\w+$/, '-processed$&');
  
  try {
    await sharp(imagePath)
      .greyscale()               // Convert to grayscale
      .normalize()               // Normalize the image
      .threshold(128)            // Apply thresholding for better text contrast
      .sharpen()                 // Sharpen the image
      .toFile(outputPath);
      
    return outputPath;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    return imagePath; // Return original path if processing fails
  }
}

// Function to perform OCR on a specific region
async function performRegionOCR(imagePath, region) {
  try {
    const image = await loadImage(imagePath);
    const canvas = createCanvas(region.width, region.height);
    const ctx = canvas.getContext('2d');
    
    // Draw only the region we're interested in
    ctx.drawImage(
      image, 
      region.x, region.y, region.width, region.height,
      0, 0, region.width, region.height
    );
    
    // Save the region to a temporary file
    const regionPath = imagePath.replace(/\.\w+$/, `-region${region.name}$&`);
    const out = fs.createWriteStream(regionPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    
    // Wait for the file to be written
    await new Promise((resolve) => out.on('finish', resolve));
    
    // Perform OCR on just this region
    const { data } = await Tesseract.recognize(regionPath, 'eng');
    
    // Clean up temporary file
    fs.unlinkSync(regionPath);
    
    return data.text;
  } catch (error) {
    console.error('Region OCR error:', error);
    return '';
  }
}

// Get sample images for testing
router.get('/sample-tests', (req, res) => {
  const samplesDir = path.join(process.cwd(), 'uploads', 'samples');
  
  if (!fs.existsSync(samplesDir)) {
    return res.status(404).json({
      success: false,
      message: 'No sample tests available'
    });
  }
  
  try {
    const files = fs.readdirSync(samplesDir)
      .filter(file => file.endsWith('.png') || file.endsWith('.pdf'))
      .map(file => ({
        name: file,
        url: `/uploads/samples/${file}`,
        path: path.join(samplesDir, file)
      }));
      
    res.json({
      success: true,
      samples: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting sample tests',
      error: error.message
    });
  }
});

export default router;
