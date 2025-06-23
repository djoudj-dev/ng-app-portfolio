import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { IMAGE_CONFIG, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

/**
 * Custom image loader for local images
 * Generates URLs for resized images based on the naming pattern used by the optimize-images.js script
 */
const localImageLoader = (config: ImageLoaderConfig) => {
  // Extract the base path and extension
  const path = config.src;
  const lastDotIndex = path.lastIndexOf('.');
  if (lastDotIndex === -1) return path;

  const basePath = path.substring(0, lastDotIndex);
  const extension = path.substring(lastDotIndex + 1);

  // If width is provided, generate a URL for the resized image
  if (config.width) {
    return `${basePath}-${config.width}.${extension}`;
  }

  // Otherwise, return the original image URL
  return path;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    DatePipe,
    {
      provide: IMAGE_LOADER,
      useValue: localImageLoader,
    },
    {
      provide: IMAGE_CONFIG,
      useValue: {
        breakpoints: [480, 768, 1024, 1280, 1920, 288, 384, 576, 768, 48, 64, 96, 128],
      },
    },
  ],
};
