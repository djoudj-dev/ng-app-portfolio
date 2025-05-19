import { Component, OnInit, inject, computed } from '@angular/core';
import { AboutService } from './service/about.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  private readonly aboutService = inject(AboutService);

  readonly about = computed(() => this.aboutService.data());

  ngOnInit(): void {
    this.aboutService.load();
  }
}
