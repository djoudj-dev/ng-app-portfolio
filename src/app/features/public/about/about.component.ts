import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ABOUT_DATA } from '@feat/public/about/data/about.data';
import { ABOUT_INFOS } from '@feat/public/about/data/about-infos.data';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  readonly about = ABOUT_DATA;
  readonly aboutInfos = ABOUT_INFOS;

  getPortraitSizes(): string {
    return '(min-width: 1024px) 25vw, (min-width: 768px) 40vw, (min-width: 640px) 50vw, 90vw';
  }
}
