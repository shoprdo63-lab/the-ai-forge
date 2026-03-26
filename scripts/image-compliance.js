#!/usr/bin/env node

/**
 * Halachic Image Compliance Scanner
 * Scans public/ folder for unauthorized imagery
 * Ensures only technical SVGs are used (NO human avatars/faces)
 * 
 * Usage: node scripts/image-compliance.js
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Allowed extensions (vector graphics only)
const ALLOWED_EXTENSIONS = ['.svg', '.ico', '.json', '.webmanifest'];

// Forbidden extensions (raster images that might contain humans)
const FORBIDDEN_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.avif'];

// Forbidden keywords in filenames
const FORBIDDEN_KEYWORDS = [
  'avatar',
  'person',
  'people',
  'human',
  'face',
  'portrait',
  'man',
  'woman',
  'user-photo',
  'profile-pic',
  'headshot',
  'team-member',
];

// Results
const violations = [];
const passed = [];

function scanDirectory(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(PUBLIC_DIR, fullPath);
    
    if (item.isDirectory()) {
      scanDirectory(fullPath);
    } else {
      checkFile(item.name, relativePath, fullPath);
    }
  }
}

function checkFile(filename, relativePath, fullPath) {
  const ext = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, ext).toLowerCase();
  
  // Check for forbidden extensions
  if (FORBIDDEN_EXTENSIONS.includes(ext)) {
    violations.push({
      type: 'FORBIDDEN_EXTENSION',
      file: relativePath,
      message: `Raster image format "${ext}" is not allowed. Use SVG instead.`,
    });
    return;
  }
  
  // Check for forbidden keywords in filename
  const hasForbiddenKeyword = FORBIDDEN_KEYWORDS.some(keyword => 
    basename.includes(keyword)
  );
  
  if (hasForbiddenKeyword) {
    violations.push({
      type: 'FORBIDDEN_KEYWORD',
      file: relativePath,
      message: `Filename contains forbidden keyword related to human imagery.`,
    });
    return;
  }
  
  // Check if file is an allowed type
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    violations.push({
      type: 'UNKNOWN_EXTENSION',
      file: relativePath,
      message: `Unknown file extension "${ext}". Please verify this file is appropriate.`,
    });
    return;
  }
  
  // For SVG files, check content doesn't contain suspicious elements
  if (ext === '.svg') {
    checkSVGContent(fullPath, relativePath);
  }
  
  passed.push(relativePath);
}

function checkSVGContent(fullPath, relativePath) {
  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Check for suspicious SVG elements that might indicate human imagery
    const suspiciousPatterns = [
      /<image[^>]*href="[^"]*\.(jpg|jpeg|png|gif)"/i,
      /<image[^>]*xlink:href="[^"]*\.(jpg|jpeg|png|gif)"/i,
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        violations.push({
          type: 'SVG_WITH_RASTER',
          file: relativePath,
          message: 'SVG contains embedded raster image (jpg/png/gif). Use pure vector graphics only.',
        });
        return;
      }
    }
    
    // Check for text that might indicate human content
    const textContent = content.toLowerCase();
    const suspiciousTexts = ['avatar', 'portrait', 'face', 'head', 'person'];
    
    for (const text of suspiciousTexts) {
      if (textContent.includes(text)) {
        violations.push({
          type: 'SUSPICIOUS_SVG_CONTENT',
          file: relativePath,
          message: `SVG content may contain human-related imagery (keyword: "${text}").`,
        });
        return;
      }
    }
    
  } catch (error) {
    violations.push({
      type: 'READ_ERROR',
      file: relativePath,
      message: `Could not read SVG file: ${error.message}`,
    });
  }
}

function printResults() {
  console.log('\n🔍 Halachic Image Compliance Scan Results\n');
  console.log('===========================================\n');
  
  if (violations.length === 0) {
    console.log('✅ ALL CHECKS PASSED\n');
    console.log(`   ${passed.length} files verified`);
    console.log('   All images are compliant (SVG vectors only, no human imagery)');
    console.log('\n🎉 Halachic compliance achieved!\n');
    process.exit(0);
  } else {
    console.log(`❌ ${violations.length} VIOLATIONS FOUND\n`);
    
    violations.forEach((v, i) => {
      console.log(`   ${i + 1}. [${v.type}] ${v.file}`);
      console.log(`      → ${v.message}`);
      console.log('');
    });
    
    console.log('===========================================\n');
    console.log('⚠️  ACTION REQUIRED:\n');
    console.log('   • Replace all raster images with SVG vector graphics');
    console.log('   • Ensure no human faces, avatars, or portraits are included');
    console.log('   • Use abstract technical/geometric illustrations only');
    console.log('   • See: /public/hardware-placeholder.svg as example\n');
    
    process.exit(1);
  }
}

// Main execution
console.log('\n🛡️  Halachic Compliance Guard');
console.log('   Scanning public/ folder for unauthorized imagery...\n');

if (!fs.existsSync(PUBLIC_DIR)) {
  console.error('❌ Error: public/ directory not found');
  process.exit(1);
}

scanDirectory(PUBLIC_DIR);
printResults();
