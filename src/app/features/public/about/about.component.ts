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
}
