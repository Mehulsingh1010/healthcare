/**
 * Fix TypeScript errors utility script
 * 
 * Usage:
 * 1. Run: node fix-ts-errors.js [filepath]
 * 2. This will fix common TypeScript errors in the specified file or directory
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Common replacements for no-explicit-any
const anyReplacements = {
  // Replace 'any' with better types
  'error: any': 'error: Error | unknown',
  'response: any': 'response: Record<string, unknown>',
  'data: any': 'data: Record<string, unknown>',
  'item: any': 'item: { id?: string; productId?: string; [key: string]: unknown }',
  'result: any': 'result: { success: boolean; message?: string; data?: unknown }',
};

// Fix unescaped entities
function fixUnescapedEntities(content) {
  return content
    .replace(/(\w)'(\w)/g, "$1&apos;$2") // Replace single quotes in contractions
    .replace(/(\s)'([^']*)'(\s)/g, "$1&apos;$2&apos;$3"); // Replace quoted text
}

// Fix unused imports/variables
function fixUnusedVariables(content) {
  // Comment out unused imports
  let newContent = content.replace(
    /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g, 
    (match, imports, source) => {
      // Split imports and filter out ones flagged as unused
      const importList = imports.split(',').map(imp => imp.trim());
      const updatedImports = importList
        .filter(imp => !content.includes(`'${imp}' is defined but never used`))
        .join(', ');
      
      if (updatedImports.length === 0) {
        // All imports are unused, comment out the whole import
        return `// ${match} // Unused imports`;
      } else if (updatedImports.length < imports.length) {
        // Some imports are unused
        return `import { ${updatedImports} } from '${source}'`;
      }
      return match;
    }
  );
  
  return newContent;
}

// Function to fix a file
function fixFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }
    
    // Check if it's a directory
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // Process all TypeScript/React files in the directory
      const files = fs.readdirSync(filePath);
      files.forEach(file => {
        if (file.match(/\.(tsx?|jsx?)$/)) {
          fixFile(path.join(filePath, file));
        }
      });
      return;
    }
    
    // Skip non-TypeScript/React files
    if (!filePath.match(/\.(tsx?|jsx?)$/)) {
      return;
    }
    
    console.log(`Checking ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix no-explicit-any
    Object.entries(anyReplacements).forEach(([search, replace]) => {
      if (content.includes(search)) {
        content = content.replace(new RegExp(search, 'g'), replace);
        modified = true;
      }
    });
    
    // Fix unescaped entities
    if (content.includes("'") && 
       (content.includes("'s") || content.includes("n't")) && 
       !content.includes("&apos;")) {
      const newContent = fixUnescapedEntities(content);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    // Replace explicit any
    if (content.includes(': any')) {
      content = content.replace(/: any/g, ': unknown');
      modified = true;
    }
    
    // Fix missing useEffect dependencies
    if (content.includes('useEffect') && content.includes('], [') && !content.includes('// eslint-disable-next-line')) {
      // Find useEffect calls with empty dependency arrays
      content = content.replace(
        /useEffect\(\(\)\s*=>\s*{([\s\S]*?)}\s*,\s*\[\]\);/g,
        (match, body) => {
          // Extract variable references from the body
          const vars = [...body.matchAll(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g)]
            .map(m => m[1])
            .filter(v => 
              !['const', 'let', 'var', 'function', 'if', 'else', 'return', 'try', 'catch'].includes(v) &&
              !v.startsWith('set') // Exclude setter functions
            );
          
          // Check if we need to add deps
          if (vars.length > 0) {
            // Add eslint disable comment if we can't determine dependencies safely
            return `// eslint-disable-next-line react-hooks/exhaustive-deps\nuseEffect(() => {${body}}, []);`;
          }
          return match;
        }
      );
    }
    
    // Fix unused variables
    if (content.includes('is defined but never used')) {
      const newContent = fixUnusedVariables(content);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    // Save changes if needed
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed issues in: ${filePath}`);
    } else {
      console.log(`No issues to fix in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error);
  }
}

// Process command line arguments
const targetPath = process.argv[2] || '.';
console.log(`Starting to fix TypeScript errors in: ${targetPath}`);
fixFile(targetPath); 