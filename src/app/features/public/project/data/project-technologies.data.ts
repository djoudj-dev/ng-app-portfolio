import { ProjectTechnology } from '@feat/public/project/interface/project.interface';

export const PROJECT_TECHNOLOGIES: ProjectTechnology[] = [
  // Backend technologies
  { id: 'java', label: 'Java', icon: 'icons/stacks/backend/java.svg' },
  { id: 'kotlin', label: 'Kotlin', icon: 'icons/stacks/backend/kotlin.svg' },
  { id: 'maven', label: 'Maven', icon: 'icons/stacks/backend/maven.svg' },
  { id: 'nestjs', label: 'NestJS', icon: 'icons/stacks/backend/nestjs.svg' },
  { id: 'nodejs', label: 'Node.js', icon: 'icons/stacks/backend/nodejs.svg' },
  { id: 'spring', label: 'Spring', icon: 'icons/stacks/backend/spring.svg' },

  // Database technologies
  { id: 'firebase', label: 'Firebase', icon: 'icons/stacks/database/firebase.svg' },
  { id: 'mongodb', label: 'MongoDB', icon: 'icons/stacks/database/mongodb.svg' },
  { id: 'mysql', label: 'MySQL', icon: 'icons/stacks/database/mysql.svg' },
  { id: 'pocketbase', label: 'PocketBase', icon: 'icons/stacks/database/pocketbase.svg' },
  { id: 'postgresql', label: 'PostgreSQL', icon: 'icons/stacks/database/postgresql.svg' },
  { id: 'prisma', label: 'Prisma', icon: 'icons/stacks/database/prisma.svg' },
  { id: 'supabase', label: 'Supabase', icon: 'icons/stacks/database/supabase.svg' },

  // DevOps technologies
  { id: 'docker', label: 'Docker', icon: 'icons/stacks/devops/docker.svg' },
  { id: 'githubactions', label: 'GitHub Actions', icon: 'icons/stacks/devops/githubactions.svg' },
  { id: 'git', label: 'Git', icon: 'icons/stacks/devops/git.svg' },
  { id: 'linux', label: 'Linux', icon: 'icons/stacks/devops/linux.svg' },
  { id: 'npm', label: 'NPM', icon: 'icons/stacks/devops/npm.svg' },
  { id: 'pnpm', label: 'PNPM', icon: 'icons/stacks/devops/pnpm.svg' },

  // Frontend technologies
  { id: 'angular', label: 'Angular', icon: 'icons/stacks/frontend/angular.webp' },
  { id: 'css3', label: 'CSS3', icon: 'icons/stacks/frontend/css3.svg' },
  { id: 'html5', label: 'HTML5', icon: 'icons/stacks/frontend/html5.svg' },
  { id: 'javascript', label: 'JavaScript', icon: 'icons/stacks/frontend/javascript.svg' },
  { id: 'tailwindcss', label: 'Tailwind CSS', icon: 'icons/stacks/frontend/tailwindcss.svg' },
  { id: 'typescript', label: 'TypeScript', icon: 'icons/stacks/frontend/typescript.svg' },
];
