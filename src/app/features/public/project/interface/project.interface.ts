export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  categoryId: string;
  deployUrl?: string;
  iconDeploy: string;
  repos: ProjectRepo[];
  technologies: string[];
  priority: number;
}

export interface ProjectRepo {
  url: string;
  label: string;
  icon: string;
}

export interface ProjectCategory {
  id: string;
  label: string;
  icon: string;
}
