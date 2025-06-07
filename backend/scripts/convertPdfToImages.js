import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

// Configuration for the conversion
const options = {
  density: 300,            // Higher density for better quality
  format: "png",           // Output format
  width: 2000,             // Output width
  height: 2828            // Approximate A4 height for the given width
};

// Get absolute paths
const samplesDir = path.resolve(process.cwd(), 'uploads', 'samples');
const imagesDir = path.resolve(process.cwd(), 'uploads', 'images');

// Create the output directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log(`Created output directory at ${imagesDir}`);
}

// Find all PDF files in the samples directory
console.log(`Looking for PDFs in: ${samplesDir}`);

if (!fs.existsSync(samplesDir)) {
  console.error(`ERROR: Samples directory does not exist: ${samplesDir}`);
  process.exit(1);
}

const files = fs.readdirSync(samplesDir)
  .filter(file => file.toLowerCase().endsWith('.pdf'))
  .map(file => path.join(samplesDir, file));

console.log(`Found ${files.length} PDF files to convert`);

if (files.length === 0) {
  console.log(`No PDF files found in ${samplesDir}`);
  console.log('You need to generate sample tests first. Run: node scripts/generateSamples.js 10');
  process.exit(0);
}

// Convert each PDF to an image
async function convertFiles() {
  for (const file of files) {
    try {
      const baseFilename = path.basename(file, '.pdf');
      console.log(`Converting ${baseFilename}...`);
      
      const fileOptions = {
        ...options,
        savePath: imagesDir,
        saveFilename: baseFilename
      };
      
      const outputPath = path.join(imagesDir, `${baseFilename}.png`);
      
      // Convert using ImageMagick's convert command
      const cmd = `convert -density 300 "${file}"[0] -quality 100 "${outputPath}"`;
      
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error converting ${baseFilename}: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`✓ Converted ${baseFilename} - Image saved at: ${outputPath}`);
      });
      
    } catch (error) {
      console.error(`Error converting ${path.basename(file)}:`, error);
    }
  }
  
  console.log('Conversion complete!');
  console.log(`Check your images in: ${imagesDir}`);
  
  // List the generated images
  const generatedImages = fs.readdirSync(imagesDir);
  if (generatedImages.length > 0) {
    console.log(`Generated ${generatedImages.length} images:`);
    generatedImages.forEach(img => console.log(`- ${img}`));
  } else {
    console.log('WARNING: No images were generated in the output directory.');
  }
}

convertFiles();

