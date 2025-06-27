const fs = require('fs');
const path = require('path');

// Configuration
const distFolder = path.join(__dirname, '../dist/ng-app-portfolio');
const indexPath = path.join(distFolder, 'index.html');

// Function to find all JS files in the dist folder
function findJsFiles(directory) {
  const jsFiles = [];

  // Read all files in the directory
  const files = fs.readdirSync(directory);

  // Filter for JS files and exclude polyfills if needed
  files.forEach((file) => {
    if (file.endsWith('.js') && !file.includes('polyfills')) {
      jsFiles.push(file);
    }
  });

  return jsFiles;
}

// Function to inject modulepreload links into index.html
function injectPreloadTags() {
  try {
    // Read the index.html file
    let indexHtml = fs.readFileSync(indexPath, 'utf8');

    // Find all JS files
    const jsFiles = findJsFiles(distFolder);

    // Create modulepreload links
    const preloadLinks = jsFiles.map((file) => `    <link rel="modulepreload" href="/${file}" />`).join('\n');

    // Insert the preload links before the closing head tag
    indexHtml = indexHtml.replace('</head>', `${preloadLinks}\n  </head>`);

    // Write the updated index.html back to disk
    fs.writeFileSync(indexPath, indexHtml);

    console.log('✅ Successfully injected modulepreload tags for', jsFiles.length, 'files');
  } catch (error) {
    console.error('❌ Error injecting modulepreload tags:', error);
    process.exit(1);
  }
}

// Execute the function
injectPreloadTags();
