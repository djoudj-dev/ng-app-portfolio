import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { HARD_SKILLS, SOFT_SKILLS, STACK_CATEGORIES } from '@feat/public/stacks/data/stacks.data';
import { ImageOptimizerService } from '@shared/services/image-optimizer.service';

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
  private readonly imageOptimizer = inject(ImageOptimizerService);

  private readonly techIconSizes = {
    xs: 15,
    sm: 10,
    md: 8,
    lg: 6,
    xl: 5,
  };

  private readonly categoryIconSizes = {
    xs: 10,
    sm: 8,
    md: 6,
    lg: 5,
    xl: 4,
  };

  private readonly softSkillIconSizes = {
    xs: 12,
    sm: 10,
    md: 8,
    lg: 6,
    xl: 5,
  };

  readonly groupedSkills = this.category.map((cat) => ({
    category: cat,
    skills: this.hardskills.filter((skill) => skill.categoryId === cat.id).sort((a, b) => a.priority - b.priority),
  }));

  getTechIconSizes(): string {
    return this.imageOptimizer.generateSizes(this.techIconSizes);
  }

  getCategoryIconSizes(): string {
    return this.imageOptimizer.generateSizes(this.categoryIconSizes);
  }

  getSoftSkillIconSizes(): string {
    return this.imageOptimizer.generateSizes(this.softSkillIconSizes);
  }

  getTechIconSrcSet(path: string): string {
    if (!path) return '';

    const normalizedPath = path.replace(/^\/+/, '');
    const lastDotIndex = normalizedPath.lastIndexOf('.');
    if (lastDotIndex === -1) return normalizedPath;

    const basePath = normalizedPath.substring(0, lastDotIndex);
    const extension = normalizedPath.substring(lastDotIndex + 1);

    return this.imageOptimizer.generateSrcSet(basePath, extension, [48, 64, 96, 128]);
  }
}
