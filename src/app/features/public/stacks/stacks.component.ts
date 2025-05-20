import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { StacksService } from '@feat/public/stacks/service/stacks.service';
import { Category, HardSkills } from '@feat/public/stacks/interface/stacks.interface';

@Component({
  selector: 'app-stacks',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './stacks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StacksComponent implements OnInit {
  private readonly stacksService = inject(StacksService);

  readonly categories = this.stacksService.categories;
  readonly hardskills = this.stacksService.hardSkills;
  readonly softskills = this.stacksService.softSkills;

  // Regroupe-les skills par catégorie via computed signal
  readonly groupedSkills = computed(() => {
    const categories = this.categories();
    const hardskills = this.hardskills();

    return categories.map((category: Category) => ({
      category,
      skills: hardskills.filter((skill: HardSkills) => skill.categoryId === category.id),
    }));
  });

  ngOnInit(): void {
    this.stacksService.load();
  }
}
