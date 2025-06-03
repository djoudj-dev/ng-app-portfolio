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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { About, Interest } from '@feat/admin/about/interface/about.interface';
import { AboutService } from '@feat/admin/about/service/about.service';
import { FileSizePipe } from '@shared/pipes/file-size.pipe';
import { FileUrlService } from '@core/services/file-url.service';

@Component({
  selector: 'app-about-admin',
  imports: [CommonModule, ReactiveFormsModule, FileSizePipe],
  templateUrl: './about-admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutAdminComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private readonly aboutService = inject(AboutService);
  private readonly fb = inject(FormBuilder);
  private readonly fileUrlService = inject(FileUrlService);
  private readonly sanitizer = inject(DomSanitizer);

  aboutForm: FormGroup;

  success = signal<string | null>(null);
  isDragging = signal<boolean>(false);
  uploadedFile = signal<File | null>(null);
  uploadError = signal<string | null>(null);

  readonly about = computed(() => this.aboutService.data());
  readonly loading = computed(() => this.aboutService.loading());
  readonly error = computed(() => this.aboutService.error());

  constructor() {
    this.aboutForm = this.fb.group({
      fullname: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      location: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      imageUrl: ['', [Validators.required]],
      interests: this.fb.array([]),
    });

    this.loadAbout();

    effect(() => {
      const about = this.about();
      if (about) {
        this.aboutForm.patchValue({
          fullname: about.fullname,
          title: about.title,
          description: about.description,
          location: about.location,
          email: about.email,
          imageUrl: about.imageUrl,
        });

        // Clear existing interests
        this.interestsFormArray.clear();

        // Add each interest to the form array
        if (about.interests && about.interests.length > 0) {
          about.interests.forEach((interest) => {
            this.addInterest(interest);
          });
        }
      }
    });
  }

  get interestsFormArray(): FormArray {
    return this.aboutForm.get('interests') as FormArray;
  }

  createInterestFormGroup(interest?: Interest): FormGroup {
    return this.fb.group({
      id: [interest?.id || ''],
      label: [interest?.label || '', [Validators.required]],
      description: [interest?.description || '', [Validators.required]],
      icon: [interest?.icon || '', [Validators.required]],
    });
  }

  addInterest(interest?: Interest): void {
    this.interestsFormArray.push(this.createInterestFormGroup(interest));
  }

  removeInterest(index: number): void {
    this.interestsFormArray.removeAt(index);
  }

  loadAbout(): void {
    this.aboutService.getAbout().subscribe({
      next: () => {
        this.success.set(null);
      },
      error: () => {
        // Error is already handled in the service
      },
    });
  }

  saveAbout(): void {
    if (this.aboutForm.invalid) {
      this.markFormGroupTouched(this.aboutForm);
      return;
    }

    this.success.set(null);
    this.aboutService.resetError();

    const currentAbout = this.about();
    const aboutData: About = {
      ...this.aboutForm.value,
      id: currentAbout?.id,
    };

    console.log('Saving about with ID:', aboutData.id);
    this.aboutService.update(aboutData).subscribe({
      next: () => {
        this.success.set('About data saved successfully!');
      },
      error: () => {
        // Error is already handled in the service
      },
    });
  }

  resetForm(): void {
    const about = this.about();
    if (about) {
      this.aboutForm.patchValue({
        fullname: about.fullname,
        title: about.title,
        description: about.description,
        location: about.location,
        email: about.email,
        imageUrl: about.imageUrl,
      });

      // Clear existing interests
      this.interestsFormArray.clear();

      // Add each interest to the form array
      if (about.interests && about.interests.length > 0) {
        about.interests.forEach((interest) => {
          this.addInterest(interest);
        });
      }
    } else {
      this.aboutForm.reset();
      this.interestsFormArray.clear();
    }
    this.success.set(null);
    this.aboutService.resetError();
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.uploadError.set('Format de fichier non supporté. Veuillez utiliser JPEG, PNG, GIF ou WEBP.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.uploadError.set('Le fichier est trop volumineux. La taille maximale est de 5MB.');
      return;
    }

    this.uploadError.set(null);
    this.uploadedFile.set(file);

    const currentAbout = this.about();

    if (currentAbout?.id) {
      this.aboutService.updateImage(currentAbout.id, file).subscribe({
        next: (updatedAbout) => {
          this.aboutForm.patchValue(updatedAbout);
          this.success.set('Image mise à jour avec succès!');
        },
        error: () => {
          this.uploadError.set("Erreur lors de la mise à jour de l'image. Veuillez réessayer.");
          this.uploadedFile.set(null);
        },
      });
    } else {
      this.aboutService.uploadImage(file).subscribe({
        next: (result) => {
          this.aboutForm.patchValue({ imageUrl: result.filename });
          this.success.set('Image téléchargée avec succès!');
        },
        error: () => {
          this.uploadError.set("Erreur lors du téléchargement de l'image. Veuillez réessayer.");
          this.uploadedFile.set(null);
        },
      });
    }
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.uploadedFile.set(null);
    this.aboutForm.patchValue({ imageUrl: '' });
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

  getFileType(path: string): 'jpeg' | 'png' | 'gif' | 'webp' | 'unknown' {
    if (!path) return 'unknown';

    const fileName = this.getFileNameFromPath(path).toLowerCase();
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) return 'jpeg';
    if (fileName.endsWith('.png')) return 'png';
    if (fileName.endsWith('.gif')) return 'gif';
    if (fileName.endsWith('.webp')) return 'webp';
    return 'unknown';
  }

  isImageFile(path: string): boolean {
    const type = this.getFileType(path);
    return type === 'jpeg' || type === 'png' || type === 'gif' || type === 'webp';
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
