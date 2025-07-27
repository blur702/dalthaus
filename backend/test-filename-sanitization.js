// Test filename sanitization function
function sanitizeFileName(filename) {
  const path = require('path');
  
  // Get file extension
  const ext = path.extname(filename).toLowerCase();
  // Get filename without extension
  let name = path.basename(filename, ext);
  
  // Convert to lowercase
  name = name.toLowerCase();
  
  // Replace spaces with hyphens
  name = name.replace(/\s+/g, '-');
  
  // Remove special characters, keep only alphanumeric and hyphens
  name = name.replace(/[^a-z0-9-]/g, '');
  
  // Remove multiple consecutive hyphens
  name = name.replace(/-+/g, '-');
  
  // Remove leading and trailing hyphens
  name = name.replace(/^-+|-+$/g, '');
  
  // If name is empty after sanitization, use a default
  if (!name) {
    name = 'image';
  }
  
  // Ensure name isn't too long (max 50 chars)
  if (name.length > 50) {
    name = name.substring(0, 50);
  }
  
  return name + ext;
}

// Test cases
const testCases = [
  'Firefly_90s. desert scene. a desert racing truck going past a photographer as the photographe 166936 (1).jpg',
  'Firefly_Create a street photography image of an older black man sitting on the side of the st 820742.jpg',
  'test image with CAPS and spaces.PNG',
  'special!@#$%^&*()characters.jpeg',
  '   leading and trailing spaces   .jpg',
  'very---many---consecutive---hyphens.gif',
  'файл с русскими символами.png',
  '中文文件名.jpg',
  'super_long_filename_that_exceeds_the_fifty_character_limit_and_should_be_truncated.webp',
  '....dots.only....jpg',
  '.hidden_file.png',
  ''
];

console.log('Testing filename sanitization:\n');
console.log('='.repeat(100));

testCases.forEach(original => {
  const sanitized = sanitizeFileName(original);
  console.log(`Original:  ${original || '(empty string)'}`);
  console.log(`Sanitized: ${sanitized}`);
  console.log('-'.repeat(100));
});

console.log('\nSanitization rules applied:');
console.log('✓ Converted to lowercase');
console.log('✓ Spaces replaced with hyphens');
console.log('✓ Special characters removed');
console.log('✓ Multiple hyphens collapsed to single');
console.log('✓ Leading/trailing hyphens removed');
console.log('✓ Empty names get default "image"');
console.log('✓ Names truncated to 50 characters');
console.log('✓ Original file extension preserved');