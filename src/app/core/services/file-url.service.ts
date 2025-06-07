import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUrlService {
  private readonly apiUrl: string = environment.apiUrl;

  getFileUrl(path: string): string {
    if (!path) return '';

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    if (path.startsWith('./')) {
      path = path.substring(2);
    }

    if (path.includes('images/')) {
      const filename = path.split('/').pop();
      if (filename) {
        return `${this.apiUrl}/projects/images/${filename}`;
      }
    }

    if (path.startsWith('/uploads/')) {
      return `${this.apiUrl}${path}`;
    }

    if (!path.includes('/')) {
      return `${this.apiUrl}/uploads/${path}`;
    }

    if (path.startsWith('uploads/')) {
      return `${this.apiUrl}/${path}`;
    }

    return `${this.apiUrl}/uploads/${path}`;
  }
}
