export interface Category {
  id: string;
  label: string;
  icon: string;
  priority: number;
}

export interface HardSkills {
  id: string;
  label: string;
  icon: string;
  categoryId: string;
  priority: number;
}

export interface SoftSkill {
  id: string;
  label: string;
  icon: string;
  description?: string;
}
