import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  effect,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Hero } from '@feat/admin/hero/interface/hero.interface';
import { HeroService } from '@feat/admin/hero/service/hero.service';
import { FileSizePipe } from '@shared/pipes/file-size.pipe';
import { FileUrlService } from '@core/services/file-url.service';

@Component({
  selector: 'app-hero-admin',
  imports: [CommonModule, ReactiveFormsModule, FileSizePipe],
  templateUrl: './hero-admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroAdminComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private readonly heroService = inject(HeroService);
  private readonly fb = inject(FormBuilder);
  private readonly fileUrlService = inject(FileUrlService);
  private readonly sanitizer = inject(DomSanitizer);

  heroForm: FormGroup;

  success = signal<string | null>(null);
  isDragging = signal<boolean>(false);
  uploadedFile = signal<File | null>(null);
  uploadError = signal<string | null>(null);

  readonly hero = computed(() => this.heroService.data());
  readonly loading = computed(() => this.heroService.loading());
  readonly error = computed(() => this.heroService.error());

  constructor() {
    this.heroForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      jobDescription: ['', [Validators.required, Validators.maxLength(500)]],
      cvPath: ['', [Validators.required]],
    });

    this.loadHero();

    effect(() => {
      const hero = this.hero();
      if (hero) {
        this.heroForm.patchValue(hero);
      }
    });
  }

  loadHero(): void {
    this.heroService.getHero().subscribe({
      next: () => {
        this.success.set(null);
      },
      error: () => {
        // Error is already handled in the service
      },
    });
  }

  saveHero(): void {
    if (this.heroForm.invalid) {
      this.markFormGroupTouched(this.heroForm);
      return;
    }

    this.success.set(null);
    this.heroService.resetError();

    const currentHero = this.hero();
    const heroData: Hero = {
      ...this.heroForm.value,
      id: currentHero?.id,
    };

    console.log('Saving hero with ID:', heroData.id);
    this.heroService.update(heroData).subscribe({
      next: () => {
        this.success.set('Hero data saved successfully!');
      },
      error: () => {
        // Error is already handled in the service
      },
    });
  }

  resetForm(): void {
    const hero = this.hero();
    if (hero) {
      this.heroForm.patchValue(hero);
    } else {
      this.heroForm.reset();
    }
    this.success.set(null);
    this.heroService.resetError();
    this.uploadedFile.set(null);
    this.uploadError.set(null);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
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
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      this.uploadError.set('Format de fichier non supporté. Veuillez utiliser PDF, DOC ou DOCX.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.uploadError.set('Le fichier est trop volumineux. La taille maximale est de 5MB.');
      return;
    }

    this.uploadError.set(null);
    this.uploadedFile.set(file);

    const currentHero = this.hero();

    if (currentHero?.id) {
      this.heroService.updateCV(currentHero.id, file).subscribe({
        next: (updatedHero) => {
          this.heroForm.patchValue(updatedHero);
          this.success.set('CV mis à jour avec succès!');
        },
        error: () => {
          this.uploadError.set('Erreur lors de la mise à jour du CV. Veuillez réessayer.');
          this.uploadedFile.set(null);
        },
      });
    } else {
      this.heroService.uploadCV(file).subscribe({
        next: (result) => {
          this.heroForm.patchValue({ cvPath: result.filename });
          this.success.set('CV téléchargé avec succès!');
        },
        error: () => {
          this.uploadError.set('Erreur lors du téléchargement du CV. Veuillez réessayer.');
          this.uploadedFile.set(null);
        },
      });
    }
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.uploadedFile.set(null);
    this.heroForm.patchValue({ cvPath: '' });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  getFileNameFromPath(path: string): string {
    if (!path) return '';

    const parts = path.split('/');
    return parts[parts.length - 1];
  }

  getFileUrl(path: string): string {
    return this.fileUrlService.getFileUrl(path);
  }

  getSafeResourceUrl(path: string): SafeResourceUrl {
    const url = this.fileUrlService.getFileUrl(path);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getSafeUrl(path: string): SafeUrl {
    const url = this.fileUrlService.getFileUrl(path);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getFileType(path: string): 'pdf' | 'doc' | 'docx' | 'unknown' {
    if (!path) return 'unknown';

    const fileName = this.getFileNameFromPath(path).toLowerCase();
    if (fileName.endsWith('.pdf')) return 'pdf';
    if (fileName.endsWith('.doc')) return 'doc';
    if (fileName.endsWith('.docx')) return 'docx';
    return 'unknown';
  }

  isPdfFile(path: string): boolean {
    return this.getFileType(path) === 'pdf';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
