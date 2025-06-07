import { generateMultipleSampleTests } from '../utils/generateSampleTest.js';

const count = process.argv[2] ? parseInt(process.argv[2]) : 5;

console.log(`Generating ${count} sample test papers...`);

generateMultipleSampleTests(count)
  .then(results => {
    console.log(`Successfully generated ${results.length} test papers:`);
    results.forEach((result, idx) => {
      console.log(`${idx + 1}. ${result.student.name} (${result.student.id}) - ${result.subject.name}: ${result.student.marks}/20 marks`);
      console.log(`   File: ${result.path}`);
    });
  })
  .catch(err => {
    console.error('Error generating sample tests:', err);
  });