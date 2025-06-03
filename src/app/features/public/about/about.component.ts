import { Component, OnInit, inject, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AboutService } from '@feat/admin/about/service/about.service';
import { FileUrlService } from '@core/services/file-url.service';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  private readonly aboutService = inject(AboutService);
  private readonly fileUrlService = inject(FileUrlService);

  readonly about = computed(() => this.aboutService.data());

  ngOnInit(): void {
    this.aboutService.load();
  }

  getFileUrl(path: string): string {
    return this.fileUrlService.getFileUrl(path);
  }
}
