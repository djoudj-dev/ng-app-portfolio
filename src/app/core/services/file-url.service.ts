import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

/**
 * Service pour gérer les URLs des fichiers
 */
@Injectable({
  providedIn: 'root',
})
export class FileUrlService {
  private readonly apiUrl: string = environment.apiUrl;

  /**
   * Construit l'URL complète pour un fichier stocké dans le dossier uploads
   * @param path Le chemin relatif du fichier (généralement stocké dans cvPath)
   * @returns L'URL complète pour accéder au fichier
   */
  getFileUrl(path: string): string {
    if (!path) return '';

    // Si le chemin est déjà une URL complète, la retourner telle quelle
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Si le chemin commence par ./, le supprimer
    if (path.startsWith('./')) {
      path = path.substring(2);
    }

    // Si le chemin contient "images/" et est un chemin d'image de projet
    if (path.includes('images/')) {
      // Assurer que le chemin commence par /projects/images/
      const filename = path.split('/').pop();
      if (filename) {
        return `${this.apiUrl}/projects/images/${filename}`;
      }
    }

    // Si le chemin commence déjà par /uploads/, ne pas ajouter le préfixe
    if (path.startsWith('/uploads/')) {
      return `${this.apiUrl}${path}`;
    }

    // Si le chemin est juste le nom du fichier (comme retourné par l'API)
    if (!path.includes('/')) {
      return `${this.apiUrl}/uploads/${path}`;
    }

    // Si le chemin est relatif au dossier uploads (comme "uploads/file.pdf")
    if (path.startsWith('uploads/')) {
      return `${this.apiUrl}/${path}`;
    }

    // Par défaut, considérer que c'est un chemin relatif au dossier uploads
    return `${this.apiUrl}/uploads/${path}`;
  }
}
