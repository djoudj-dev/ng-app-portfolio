import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { PROJECTS } from './data/project.data';
import { PROJECT_CATEGORIES } from './data/project-categories.data';
import { PROJECT_TECHNOLOGIES } from './data/project-technologies.data';
import { Project } from './interface/project.interface';

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

  readonly allProjects = signal<Project[]>(PROJECTS);
  readonly categories = signal(PROJECT_CATEGORIES);
  readonly technologies = signal(PROJECT_TECHNOLOGIES);

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

  getProjectSizes(): string {
    return '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';
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
