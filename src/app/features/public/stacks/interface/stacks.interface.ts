export interface Category {
  id: string;
  icon: string;
  label: string;
  priority: number;
}

export interface SoftSkills {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export interface HardSkills {
  id: string;
  label: string;
  icon: string;
  categoryId: string;
  priority: number;
}
