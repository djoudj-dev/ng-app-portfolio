/**
 * Image Optimization Script
 *
 * This script generates optimized versions of images for the portfolio website.
 * It creates multiple sizes of each image to be used with responsive image loading.
 *
 * Usage:
 * 1. Install dependencies: npm install sharp
 * 2. Run the script: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Helper function to check if a file exists
async function exists(path) {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

// Configuration
const config = {
  projectImages: {
    dir: 'public/images/projects',
    sizes: [1920, 1280, 1024, 768, 480],
  },
  portraitImage: {
    path: 'public/images/julien.webp',
    dir: 'public/images',
    sizes: [768, 576, 384, 288],
  },
  techIcons: {
    dirs: [
      'public/icons/stacks/frontend',
      'public/icons/stacks/backend',
      'public/icons/stacks/database',
      'public/icons/stacks/devops',
      'public/icons/stacks/category',
      'public/icons/stacks/softskills',
      'public/icons/about',
      'public/icons/contact',
      'public/icons/social',
      'public/icons/hero',
      'public/icons/navbar',
      'public/icons/project',
    ],
    sizes: [128, 96, 64, 48],
  },
};

/**
 * Resize an image to multiple widths
 * @param {string} inputPath - Path to the input image
 * @param {string} outputDir - Directory to save the resized images
 * @param {string} filename - Filename of the image
 * @param {number[]} widths - Array of widths to resize to
 */
async function resizeImage(inputPath, outputDir, filename, widths) {
  try {
    const ext = path.extname(filename).toLowerCase();
    // Only process image files
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      console.log(`Skipping ${inputPath} (not an image file)`);
      return;
    }

    const name = path.basename(filename, ext);

    console.log(`Processing ${inputPath}...`);

    for (const width of widths) {
      const outputPath = path.join(outputDir, `${name}-${width}${ext}`);

      // Skip if the file already exists
      if (await exists(outputPath)) {
        console.log(`  Skipping ${outputPath} (already exists)`);
        continue;
      }

      console.log(`  Creating ${outputPath}`);
      await sharp(inputPath).resize({ width, withoutEnlargement: true }).toFile(outputPath);
    }
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

/**
 * Process all images in a directory
 * @param {string} dir - Directory containing images
 * @param {number[]} sizes - Array of widths to resize to
 */
async function processDirectory(dir, sizes) {
  try {
    // Ensure the directory exists
    try {
      await fs.promises.access(dir, fs.constants.F_OK);
    } catch (error) {
      console.log(`Directory ${dir} does not exist, skipping`);
      return;
    }

    // Get all files in the directory
    const files = await readdir(dir);

    // Process each file
    for (const file of files) {
      // Skip directories and non-image files
      const filePath = path.join(dir, file);
      const stats = await stat(filePath);

      if (stats.isDirectory()) continue;

      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

      // Skip already optimized images (with size in filename)
      if (file.match(/-\d+\.(jpg|jpeg|png|webp)$/i)) continue;

      // Resize the image
      await resizeImage(filePath, dir, file, sizes);
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Starting image optimization...');

    // Process project images
    console.log('\nProcessing project images...');
    await processDirectory(config.projectImages.dir, config.projectImages.sizes);

    // Process portrait image
    console.log('\nProcessing portrait image...');
    if (await exists(config.portraitImage.path)) {
      await resizeImage(
        config.portraitImage.path,
        config.portraitImage.dir,
        path.basename(config.portraitImage.path),
        config.portraitImage.sizes
      );
    } else {
      console.log(`Portrait image ${config.portraitImage.path} does not exist, skipping`);
    }

    // Process tech icons
    console.log('\nProcessing tech icons...');
    for (const dir of config.techIcons.dirs) {
      if (await exists(dir)) {
        await processDirectory(dir, config.techIcons.sizes);
      } else {
        console.log(`Directory ${dir} does not exist, skipping`);
      }
    }

    console.log('\nImage optimization complete!');
  } catch (error) {
    console.error('Error during image optimization:', error);
  }
}

// Run the script
main();
