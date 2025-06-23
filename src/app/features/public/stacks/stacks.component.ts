import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { HARD_SKILLS, SOFT_SKILLS, STACK_CATEGORIES } from '@feat/public/stacks/data/stacks.data';

@Component({
  selector: 'app-stacks',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './stacks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StacksComponent {
  readonly category = STACK_CATEGORIES;
  readonly hardskills = HARD_SKILLS;
  readonly softskills = SOFT_SKILLS;

  readonly groupedSkills = this.category.map((cat) => ({
    category: cat,
    skills: this.hardskills.filter((skill) => skill.categoryId === cat.id).sort((a, b) => a.priority - b.priority),
  }));

  getTechIconSizes(): string {
    return '(min-width: 1280px) 5vw, (min-width: 1024px) 6vw, (min-width: 768px) 8vw, (min-width: 640px) 10vw, 15vw';
  }

  getCategoryIconSizes(): string {
    return '(min-width: 1280px) 4vw, (min-width: 1024px) 5vw, (min-width: 768px) 6vw, (min-width: 640px) 8vw, 10vw';
  }

  getSoftSkillIconSizes(): string {
    return '(min-width: 1280px) 5vw, (min-width: 1024px) 6vw, (min-width: 768px) 8vw, (min-width: 640px) 10vw, 12vw';
  }
}
