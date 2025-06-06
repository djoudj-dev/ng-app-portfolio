import { Category, HardSkills, SoftSkill } from '../interface/stacks.interface';

export const STACK_CATEGORIES: Category[] = [
  { id: 'frontend', icon: 'icons/stacks/category/frontend.svg', label: 'Frontend', priority: 1 },
  { id: 'backend', icon: 'icons/stacks/category/backend.svg', label: 'Backend', priority: 2 },
  { id: 'devops', icon: 'icons/stacks/category/devops.svg', label: 'DevOps', priority: 3 },
  { id: 'database', icon: 'icons/stacks/category/database.svg', label: 'Database', priority: 4 },
];

export const HARD_SKILLS: HardSkills[] = [
  // Frontend
  { id: 'angular', label: 'Angular', icon: 'icons/stacks/frontend/angular.webp', categoryId: 'frontend', priority: 1 },
  { id: 'css3', label: 'CSS3', icon: 'icons/stacks/frontend/css3.svg', categoryId: 'frontend', priority: 2 },
  { id: 'html5', label: 'HTML5', icon: 'icons/stacks/frontend/html5.svg', categoryId: 'frontend', priority: 3 },
  {
    id: 'javascript',
    label: 'JavaScript',
    icon: 'icons/stacks/frontend/javascript.svg',
    categoryId: 'frontend',
    priority: 4,
  },
  {
    id: 'tailwindcss',
    label: 'TailwindCSS',
    icon: 'icons/stacks/frontend/tailwindcss.svg',
    categoryId: 'frontend',
    priority: 5,
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    icon: 'icons/stacks/frontend/typescript.svg',
    categoryId: 'frontend',
    priority: 6,
  },
  // Backend
  { id: 'java', label: 'Java', icon: 'icons/stacks/backend/java.svg', categoryId: 'backend', priority: 1 },
  { id: 'kotlin', label: 'Kotlin', icon: 'icons/stacks/backend/kotlin.svg', categoryId: 'backend', priority: 2 },
  { id: 'maven', label: 'Maven', icon: 'icons/stacks/backend/maven.svg', categoryId: 'backend', priority: 3 },
  { id: 'nestjs', label: 'NestJS', icon: 'icons/stacks/backend/nestjs.svg', categoryId: 'backend', priority: 4 },
  { id: 'nodejs', label: 'NodeJS', icon: 'icons/stacks/backend/nodejs.svg', categoryId: 'backend', priority: 5 },
  { id: 'spring', label: 'Spring', icon: 'icons/stacks/backend/spring.svg', categoryId: 'backend', priority: 6 },
  // DevOps
  { id: 'docker', label: 'Docker', icon: 'icons/stacks/devops/docker.svg', categoryId: 'devops', priority: 1 },
  {
    id: 'githubactions',
    label: 'GitHub Actions',
    icon: 'icons/stacks/devops/githubactions.svg',
    categoryId: 'devops',
    priority: 2,
  },
  { id: 'git', label: 'Git', icon: 'icons/stacks/devops/git.svg', categoryId: 'devops', priority: 3 },
  { id: 'linux', label: 'Linux', icon: 'icons/stacks/devops/linux.svg', categoryId: 'devops', priority: 4 },
  { id: 'npm', label: 'NPM', icon: 'icons/stacks/devops/npm.svg', categoryId: 'devops', priority: 5 },
  { id: 'pnpm', label: 'PNPM', icon: 'icons/stacks/devops/pnpm.svg', categoryId: 'devops', priority: 6 },
  // Database
  {
    id: 'firebase',
    label: 'Firebase',
    icon: 'icons/stacks/database/firebase.svg',
    categoryId: 'database',
    priority: 1,
  },
  { id: 'mongodb', label: 'MongoDB', icon: 'icons/stacks/database/mongodb.svg', categoryId: 'database', priority: 2 },
  { id: 'mysql', label: 'MySQL', icon: 'icons/stacks/database/mysql.svg', categoryId: 'database', priority: 3 },
  {
    id: 'pocketbase',
    label: 'PocketBase',
    icon: 'icons/stacks/database/pocketbase.svg',
    categoryId: 'database',
    priority: 4,
  },
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    icon: 'icons/stacks/database/postgresql.svg',
    categoryId: 'database',
    priority: 5,
  },
  { id: 'prisma', label: 'Prisma', icon: 'icons/stacks/database/prisma.svg', categoryId: 'database', priority: 6 },
];

export const SOFT_SKILLS: SoftSkill[] = [
  {
    id: 'brain',
    label: 'Résolution de problèmes',
    icon: 'icons/stacks/softskills/brain.svg',
    description:
      'Analyse logique, approche structurée et créativité pour surmonter des obstacles techniques ou organisationnels.',
  },
  {
    id: 'curious',
    label: 'Curiosité',
    icon: 'icons/stacks/softskills/curious.svg',
    description:
      'Goût pour l’exploration, la veille et l’expérimentation de nouvelles technologies, outils et pratiques.',
  },
  {
    id: 'student',
    label: 'Apprentissage continu',
    icon: 'icons/stacks/softskills/student.svg',
    description:
      'Capacité à assimiler rapidement de nouvelles compétences et à évoluer en continu dans un environnement technologique.',
  },
  {
    id: 'team',
    label: "Travail d'équipe",
    icon: 'icons/stacks/softskills/team.svg',
    description:
      'Collaboration fluide, écoute active et contribution constructive au sein d’un groupe ou d’un projet collectif.',
  },
  {
    id: 'time',
    label: 'Gestion du temps',
    icon: 'icons/stacks/softskills/time.svg',
    description:
      'Organisation autonome et priorisation efficace pour respecter les délais tout en maintenant la qualité.',
  },
];
