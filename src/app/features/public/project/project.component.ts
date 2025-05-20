import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { ProjectService } from './service/project.service';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ProjectCategory } from './interface/project.interface';
import { StacksService } from '../stacks/service/stacks.service';
import { HardSkills } from '../stacks/interface/stacks.interface';

@Component({
  selector: 'app-project',
  imports: [NgOptimizedImage, NgClass],
  templateUrl: './project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly stacksService = inject(StacksService);

  // --- Signals locaux ---
  private readonly search = signal('');
  private readonly selectedCategory = signal('all');
  readonly currentPage = signal(1);
  private readonly itemsPerPage = 3;
  readonly loadedImages = signal<Record<string, boolean>>({});

  // --- Chargement des données au ngOnInit ---
  ngOnInit(): void {
    this.projectService.load();
    this.stacksService.load();
  }

  // --- Exposition des signals projet & catégories ---
  readonly allProjects = this.projectService.projects;
  readonly categories = signal<ProjectCategory[]>([
    { id: 'web', label: 'Frontend', icon: 'icons/project/category/web.svg' },
    { id: 'api', label: 'API', icon: 'icons/project/category/api.svg' },
    { id: 'data', label: 'Data', icon: 'icons/project/category/data.svg' },
    { id: 'fullstack', label: 'Fullstack', icon: 'icons/project/category/fullstack.svg' },
    { id: 'game', label: 'Game', icon: 'icons/project/category/game.svg' },
    { id: 'library', label: 'Library', icon: 'icons/project/category/library.svg' },
    { id: 'mobile', label: 'Mobile', icon: 'icons/project/category/mobile.svg' },
    { id: 'script', label: 'Script', icon: 'icons/project/category/script.svg' },
  ]);

  // --- Getters pour filtre & pagination --- //
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

  // --- Méthodes déclenchées depuis le template ---
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);
    this.currentPage.set(1); // Reset page
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
    this.currentPage.set(1); // Reset page
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

  // --- Accès simplifiés pour le template ---
  readonly searchQuery = this.search.asReadonly();
  // --- Gestion du chargement des images ---
  onImageLoad(projectId: string): void {
    this.loadedImages.update((images) => ({
      ...images,
      [projectId]: true,
    }));
  }

  isImageLoaded(projectId: string): boolean {
    return this.loadedImages()[projectId];
  }

  // --- Map des hardskills pour afficher les technologies ---
  readonly hardskillsMap = computed(() => {
    const map = new Map<string, HardSkills>();
    this.stacksService.hardSkills().forEach((skill) => {
      map.set(skill.id, skill);
    });
    return map;
  });
}
