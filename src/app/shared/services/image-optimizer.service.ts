import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map } from 'rxjs';

export interface ImageSizeConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImageOptimizerService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  generateSrcSet(basePath: string, extension: string, sizes: number[]): string {
    return sizes.map((size) => `${this.getImagePathForSize(basePath, size, extension)} ${size}w`).join(', ');
  }

  private getImagePathForSize(basePath: string, size: number, extension: string): string {
    // Extract the filename without extension
    const parts = basePath.split('/');
    const filename = parts.pop() || '';
    const directory = parts.join('/');

    // Construct the new filename with size
    return `${directory}/${filename}-${size}.${extension}`;
  }

  getCurrentImageSize(config: ImageSizeConfig): Observable<number> {
    return this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(
        map((result) => {
          if (result.breakpoints[Breakpoints.XLarge]) {
            return config.xl;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            return config.lg;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            return config.md;
          }
          if (result.breakpoints[Breakpoints.Small]) {
            return config.sm;
          }
          return config.xs;
        })
      );
  }

  generateSizes(config: ImageSizeConfig): string {
    return `
      (min-width: 1280px) ${config.xl}vw,
      (min-width: 1024px) ${config.lg}vw,
      (min-width: 768px) ${config.md}vw,
      (min-width: 640px) ${config.sm}vw,
      ${config.xs}vw
    `
      .trim()
      .replace(/\s+/g, ' ');
  }
}
