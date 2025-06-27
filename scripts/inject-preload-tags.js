/**
 * Preload Tags Injection Script
 *
 * This script injects preload tags for critical resources into the index.html file
 * after the Angular build process completes. This helps improve initial load performance
 * by prioritizing the loading of critical resources.
 *
 * Usage:
 * This script is automatically run after the build process via the "postbuild" npm script.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Path to the built index.html file
  indexHtmlPath: path.join(process.cwd(), 'dist', 'ng-app-portfolio', 'browser', 'index.html'),
  // Resources to preload (will be detected automatically from the built files)
  resourceTypes: {
    js: { rel: 'preload', as: 'script' },
    css: { rel: 'preload', as: 'style' },
  },
};

/**
 * Get all main chunk files from the build output directory
 * @returns {Promise<Array<{path: string, type: string}>>} Array of file objects
 */
async function getMainChunkFiles() {
  const buildDir = path.dirname(config.indexHtmlPath);
  const files = await fs.promises.readdir(buildDir);

  // Filter for main chunk files (main, polyfills, styles)
  const mainChunks = files.filter((file) => {
    const ext = path.extname(file).toLowerCase().substring(1);
    return (
      config.resourceTypes[ext] &&
      (file.startsWith('main-') || file.startsWith('polyfills-') || file.startsWith('styles-'))
    );
  });

  return mainChunks.map((file) => ({
    path: file,
    type: path.extname(file).toLowerCase().substring(1),
  }));
}

/**
 * Generate preload tags for the given resources
 * @param {Array<{path: string, type: string}>} resources Array of resource objects
 * @returns {string} HTML string with preload tags
 */
function generatePreloadTags(resources) {
  return resources
    .map((resource) => {
      const { rel, as } = config.resourceTypes[resource.type];
      return `    <link rel="${rel}" href="${resource.path}" as="${as}" />`;
    })
    .join('\n');
}

/**
 * Inject preload tags into the index.html file
 * @param {string} indexHtml Content of the index.html file
 * @param {string} preloadTags HTML string with preload tags
 * @returns {string} Updated index.html content
 */
function injectPreloadTags(indexHtml, preloadTags) {
  // Insert preload tags before the closing head tag
  return indexHtml.replace('</head>', `\n${preloadTags}\n  </head>`);
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Starting preload tags injection...');

    // Check if the index.html file exists
    if (!fs.existsSync(config.indexHtmlPath)) {
      console.error(`Error: Index file not found at ${config.indexHtmlPath}`);
      console.log('Checking for alternative paths...');

      // Try to find the index.html file in the dist directory
      const distDir = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distDir)) {
        const possiblePaths = [];

        // Search for index.html recursively
        const searchForIndexHtml = (dir) => {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
              searchForIndexHtml(filePath);
            } else if (file === 'index.html') {
              possiblePaths.push(filePath);
            }
          }
        };

        searchForIndexHtml(distDir);

        if (possiblePaths.length > 0) {
          config.indexHtmlPath = possiblePaths[0];
          console.log(`Found alternative index.html at: ${config.indexHtmlPath}`);
        } else {
          console.error('No index.html file found in the dist directory');
          process.exit(1);
        }
      } else {
        console.error('Dist directory not found');
        process.exit(1);
      }
    }

    // Read the index.html file
    const indexHtml = await fs.promises.readFile(config.indexHtmlPath, 'utf-8');

    // Get main chunk files
    const mainChunks = await getMainChunkFiles();
    console.log(`Found ${mainChunks.length} main chunk files to preload`);

    // Generate preload tags
    const preloadTags = generatePreloadTags(mainChunks);

    // Inject preload tags into the index.html file
    const updatedIndexHtml = injectPreloadTags(indexHtml, preloadTags);

    // Write the updated index.html file
    await fs.promises.writeFile(config.indexHtmlPath, updatedIndexHtml);

    console.log('Preload tags injection complete!');
  } catch (error) {
    console.error('Error during preload tags injection:', error);
    process.exit(1);
  }
}

// Run the script
main();
