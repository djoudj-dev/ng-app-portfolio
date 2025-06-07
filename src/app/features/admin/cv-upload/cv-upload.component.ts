import { Component, ElementRef, EventEmitter, inject, OnInit, Output, signal, ViewChild } from '@angular/core';
import { CvService } from '@feat/admin/cv-upload/service/cv.service';
import { FileUrlService } from '@core/services/file-url.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorOrNull, ApiErrorResponse, FileUploadResponse } from '@core/models/api-response.model';

@Component({
  selector: 'app-cv-upload',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './cv-upload.component.html',
})
export class CvUploadComponent implements OnInit {
  @Output() fileUploaded = new EventEmitter<string>();
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  readonly cvPath = 'docs/CV_DEVELOPPEUR_ANGULAR_NEDELLEC_JULIEN.pdf';
  cvUrl: SafeResourceUrl | null = null;

  ngOnInit(): void {
    this.loadExistingCV();
  }

  private readonly cvService = inject(CvService);
  private readonly fileUrlService = inject(FileUrlService);
  private readonly sanitizer = inject(DomSanitizer);

  uploadError = signal<string | null>(null);
  success = signal<string | null>(null);
  uploadedFile = signal<File | null>(null);
  isUploading = signal<boolean>(false);
  isDragging = signal<boolean>(false);

  openFilePicker(): void {
    console.log('openFilePicker called', new Date().toISOString());
    console.log('Component state:', {
      uploadError: this.uploadError(),
      success: this.success(),
      isUploading: this.isUploading(),
      isDragging: this.isDragging(),
    });

    if (this.fileInput) {
      try {
        this.fileInput.nativeElement.click();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.warn('fileInput not available');
    }
  }

  onFileSelected(event: Event): void {
    if (!event.target) {
      console.error();
      return;
    }

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (file) {
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString(),
      });
      this.handleFile(file);
    } else {
      console.warn('File is null or undefined');
    }
  }

  handleFile(file: File): void {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.uploadError.set('Format invalide. PDF, DOC, DOCX.');
      return;
    }

    if (file.size > maxSize) {
      this.uploadError.set('Fichier trop gros (max 5MB).');
      return;
    }

    this.uploadError.set(null);
    this.success.set(null);
    this.uploadedFile.set(file);
    this.isUploading.set(true);

    this.cvService.uploadCV(file).subscribe({
      next: (res: FileUploadResponse | ApiErrorOrNull) => {
        this.isUploading.set(false);
        // Check if res is a FileUploadResponse by checking if it has a filename property
        if (res && 'filename' in res) {
          this.success.set('CV téléchargé avec succès !');
          this.fileUploaded.emit(res.filename);
        } else {
          this.uploadError.set('Réponse du serveur invalide.');
          this.uploadedFile.set(null);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isUploading.set(false);

        // Use the ApiErrorResponse class for better error handling
        const apiError = new ApiErrorResponse(err);
        this.uploadError.set(apiError.getFileUploadErrorMessage());
        this.uploadedFile.set(null);
      },
    });
  }

  removeFile(): void {
    this.uploadedFile.set(null);
    this.success.set(null);
    this.uploadError.set(null);
    this.fileUploaded.emit('');
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  logFileInputClick(): void {
    console.log('File input clicked directly');
  }
  loadExistingCV(): void {
    const fileUrl = this.fileUrlService.getFileUrl(this.cvPath);
    this.cvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }

  viewExistingCV(): void {
    const fileUrl = this.fileUrlService.getFileUrl(this.cvPath);
    window.open(fileUrl, '_blank');
  }
}
