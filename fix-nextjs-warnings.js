/**
 * Fix Next.js specific warnings
 * 
 * This script fixes:
 * 1. Converting <img> to <Image> from next/image
 * 2. Converting <a> to <Link> from next/link for internal links
 * 3. Adding any necessary imports
 * 
 * Usage: node fix-nextjs-warnings.js [filepath]
 */

const fs = require('fs');
const path = require('path');

// Process a single file
function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return false;
    }
    
    // Check if it's a directory
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // Process all TypeScript/React files in the directory
      const files = fs.readdirSync(filePath);
      let anyFixed = false;
      
      files.forEach(file => {
        const fullPath = path.join(filePath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          // Process subdirectories
          const subDirFixed = processFile(fullPath);
          anyFixed = anyFixed || subDirFixed;
        } else if (file.match(/\.(tsx?|jsx?)$/)) {
          // Process TypeScript/React files
          const fileFixed = processFile(fullPath);
          anyFixed = anyFixed || fileFixed;
        }
      });
      
      return anyFixed;
    }
    
    // Skip non-TypeScript/React files
    if (!filePath.match(/\.(tsx?|jsx?)$/)) {
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;
    
    // Check if this file has img tags
    const hasImgTags = /<img\s[^>]*>/g.test(content);
    if (hasImgTags) {
      // Add Image import if needed
      if (!newContent.includes('import Image from')) {
        // Find where to add the import
        const importSection = newContent.match(/^import.*$/gm);
        if (importSection && importSection.length > 0) {
          const lastImport = importSection[importSection.length - 1];
          newContent = newContent.replace(
            lastImport,
            `${lastImport}\nimport Image from 'next/image';`
          );
        } else {
          // Add at the beginning of the file
          newContent = `import Image from 'next/image';\n${newContent}`;
        }
      }
      
      // Replace img tags with Image components
      newContent = newContent.replace(
        /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/g,
        (match, before, src, after) => {
          // Extract any existing attributes
          const altMatch = match.match(/alt=["']([^"']*)["']/);
          const alt = altMatch ? altMatch[1] : 'Image';
          
          // Ensure width and height are present
          const hasWidth = match.includes('width=');
          const hasHeight = match.includes('height=');
          
          const widthAttr = hasWidth ? '' : 'width={500} ';
          const heightAttr = hasHeight ? '' : 'height={300} ';
          
          return `<Image ${before}src="${src}" ${after} ${widthAttr}${heightAttr}alt="${alt}" />`;
        }
      );
      
      modified = true;
    }
    
    // Check if this file has internal links (<a href="/...">)
    const hasInternalLinks = /<a\s+[^>]*href=["']\/[^"']*["'][^>]*>/g.test(content);
    if (hasInternalLinks) {
      // Add Link import if needed
      if (!newContent.includes('import Link from')) {
        // Find where to add the import
        const importSection = newContent.match(/^import.*$/gm);
        if (importSection && importSection.length > 0) {
          const lastImport = importSection[importSection.length - 1];
          newContent = newContent.replace(
            lastImport,
            `${lastImport}\nimport Link from 'next/link';`
          );
        } else {
          // Add at the beginning of the file
          newContent = `import Link from 'next/link';\n${newContent}`;
        }
      }
      
      // Replace <a> tags with <Link> components
      newContent = newContent.replace(
        /<a\s+([^>]*?)href=["'](\/[^"']*)["']([^>]*?)>([\s\S]*?)<\/a>/g,
        '<Link $1href="$2"$3>$4</Link>'
      );
      
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed Next.js issues in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return false;
  }
}

// Main execution
const targetPath = process.argv[2] || '.';
console.log(`Starting to fix Next.js warnings in: ${targetPath}`);
const result = processFile(targetPath);

if (!result) {
  console.log('No files needed fixing or no matching files found.');
} 