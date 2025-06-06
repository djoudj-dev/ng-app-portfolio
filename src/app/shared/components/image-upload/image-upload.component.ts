import { Component, input, output, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

type ImageSource = string | null;

@Component({
  selector: 'app-image-upload',
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="image-upload">
      @if (previewUrl()) {
        <div class="preview-container mb-3">
          @if (isBase64Image(previewUrl()!)) {
            <img [src]="previewUrl()!" alt="Preview" class="w-full h-32 object-cover rounded-md" />
          } @else {
            <img [ngSrc]="previewUrl()!" alt="Preview" class="w-full h-32 object-cover rounded-md" fill />
          }
          <button
            type="button"
            (click)="clearImage()"
            class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            &times;
          </button>
        </div>
      }

      <div
        class="upload-area p-4 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer hover:bg-gray-50"
        (click)="fileInput.click()"
        (dragover)="onDragOver($event)"
        (dragleave)="isDragging.set(false)"
        (drop)="onDrop($event)"
        [class.border-blue-500]="isDragging()"
      >
        <input #fileInput type="file" [accept]="accept()" (change)="onFileSelected($event)" class="hidden" />

        <div class="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p class="text-sm text-gray-600">Glissez-déposez une image ici ou cliquez pour sélectionner</p>
          <p class="text-xs text-gray-500 mt-1">
            {{ hint() || 'JPG, PNG, GIF, WEBP (max 5MB)' }}
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .preview-container {
        position: relative;
      }
    `,
  ],
})
export class ImageUploadComponent {
  /** Type MIME acceptés pour l'input file */
  accept = input<string>('image/jpeg,image/png,image/gif,image/webp');

  /** Message d'aide affiché sous la zone d'upload */
  hint = input<string | undefined>();

  /** Image préchargée (signal input) */
  uploadedImage = input<ImageSource>(null);

  /** Signal émis quand un fichier est sélectionné */
  fileSelected = output<File>();

  /** Signal émis quand un fichier est supprimé */
  fileRemoved = output<void>();

  /** Signal local pour prévisualiser l'image */
  previewUrl = signal<ImageSource>(null);

  /** Signal de survol lors du drag & drop */
  isDragging = signal(false);
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files?.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La taille de l'image ne doit pas dépasser 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    this.fileSelected.emit(file);
  }

  clearImage(): void {
    this.previewUrl.set(null);
    this.fileRemoved.emit();
  }

  /**
   * Vérifie si l'URL de l'image est une chaîne Base64
   * @param url URL de l'image à vérifier
   * @returns true si l'URL est une chaîne Base64, false sinon
   */
  isBase64Image(url: string): boolean {
    return url.startsWith('data:image');
  }
}
