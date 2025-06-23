import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { PROJECTS } from './data/project.data';
import { PROJECT_CATEGORIES } from './data/project-categories.data';
import { PROJECT_TECHNOLOGIES } from './data/project-technologies.data';
import { Project } from './interface/project.interface';
import { ImageOptimizerService } from '@shared/services/image-optimizer.service';

@Component({
  selector: 'app-project',
  imports: [NgOptimizedImage, NgClass],
  templateUrl: './project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent {
  private readonly search = signal('');
  private readonly selectedCategory = signal('all');
  readonly currentPage = signal(1);
  readonly searchQuery = this.search.asReadonly();
  private readonly itemsPerPage = 3;
  readonly loadedImages = signal<Record<string, boolean>>({});
  private readonly imageOptimizer = inject(ImageOptimizerService);

  readonly allProjects = signal<Project[]>(PROJECTS);
  readonly categories = signal(PROJECT_CATEGORIES);
  readonly technologies = signal(PROJECT_TECHNOLOGIES);

  private readonly projectImageSizes = {
    xs: 100,
    sm: 50,
    md: 50,
    lg: 33,
    xl: 33,
  };

  readonly filteredProjects = computed(() => {
    const query = this.search().toLowerCase();
    const category = this.selectedCategory();
    return this.allProjects().filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(query) || project.description.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || project.categoryId === category;
      return matchesSearch && matchesCategory;
    });
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredProjects().length / this.itemsPerPage));

  readonly paginatedProjects = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.itemsPerPage;
    return this.filteredProjects().slice(start, start + this.itemsPerPage);
  });

  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);
    this.currentPage.set(1);
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
    this.currentPage.set(1);
  }

  clearSearch(): void {
    this.search.set('');
    this.selectedCategory.set('all');
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  onImageLoad(projectId: string): void {
    this.loadedImages.update((images) => ({ ...images, [projectId]: true }));
  }

  isImageLoaded(projectId: string): boolean {
    return this.loadedImages()[projectId];
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    return '/' + path.replace(/^\/+/, '');
  }

  getImageSrcSet(path: string): string {
    if (!path) return '';

    // Extract the base path and extension
    const normalizedPath = path.replace(/^\/+/, '');
    const lastDotIndex = normalizedPath.lastIndexOf('.');
    if (lastDotIndex === -1) return '/' + normalizedPath;

    const basePath = normalizedPath.substring(0, lastDotIndex);
    const extension = normalizedPath.substring(lastDotIndex + 1);

    // Generate srcset with multiple sizes
    // Using common responsive image sizes: 480px, 768px, 1024px, 1280px, 1920px
    return this.imageOptimizer.generateSrcSet(basePath, extension, [480, 768, 1024, 1280, 1920]);
  }

  getProjectSizes(): string {
    return this.imageOptimizer.generateSizes(this.projectImageSizes);
  }

  getImageHeight(imagePath: string): number {
    if (!imagePath) return 214; // Default height

    // Extract the filename from the path
    const filename = imagePath.split('/').pop()?.toLowerCase();

    // Return the appropriate height based on the filename
    if (filename?.includes('portfolio')) {
      return 201; // portfolio.webp has intrinsic size 432x201
    } else if (filename?.includes('calculator')) {
      return 202; // calculator.webp has intrinsic size 432x202
    } else {
      return 214; // arcadia.webp and others have intrinsic size 432x214
    }
  }

  getTechnologyIcon(techId: string): string {
    const technology = this.technologies().find((tech) => tech.id === techId);
    return technology?.icon || 'icons/stacks/default.svg';
  }

  getTechnologyLabel(techId: string): string {
    const technology = this.technologies().find((tech) => tech.id === techId);
    return technology?.label || techId;
  }
}
