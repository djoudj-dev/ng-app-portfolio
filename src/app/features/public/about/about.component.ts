import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ABOUT_DATA } from '@feat/public/about/data/about.data';
import { ABOUT_INFOS } from '@feat/public/about/data/about-infos.data';
import { ImageOptimizerService } from '@shared/services/image-optimizer.service';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  readonly about = ABOUT_DATA;
  readonly aboutInfos = ABOUT_INFOS;
  private readonly imageOptimizer = inject(ImageOptimizerService);

  private readonly portraitImageSizes = {
    xs: 90,
    sm: 50,
    md: 40,
    lg: 25,
    xl: 20,
  };

  getPortraitSizes(): string {
    return this.imageOptimizer.generateSizes(this.portraitImageSizes);
  }

  getPortraitSrcSet(path: string): string {
    if (!path) return '';

    const normalizedPath = path.replace(/^\/+/, '');
    const lastDotIndex = normalizedPath.lastIndexOf('.');
    if (lastDotIndex === -1) return normalizedPath;

    const basePath = normalizedPath.substring(0, lastDotIndex);
    const extension = normalizedPath.substring(lastDotIndex + 1);

    return this.imageOptimizer.generateSrcSet(basePath, extension, [288, 384, 576, 768]);
  }
}
