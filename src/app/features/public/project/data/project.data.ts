import { Project } from '@feat/public/project/interface/project.interface';

export const PROJECTS: Project[] = [
  {
    id: 'portfolio',
    title: 'Portfolio Personnel',
    description: 'Site web personnel développé avec Angular et TailwindCSS...',
    image: 'images/projects/portfolio.webp',
    categoryId: 'fullstack',
    deployUrl: 'https://nedellec-julien.fr',
    iconDeploy: 'icons/project/link.svg',
    technologies: ['angular', 'tailwindcss', 'typescript', 'nestjs', 'prisma'],
    priority: 1,
    repos: [
      {
        url: 'https://github.com/djoudj-dev/ng-app-portfolio',
        icon: 'icons/about/github.svg',
        label: 'GitHub',
      },
    ],
  },
  {
    id: 'arcadia-zoo',
    title: 'Zoo Arcadia - Application de Gestion de Parc Zoologique',
    description: 'Application complète de gestion de parc zoologique...',
    image: 'images/projects/arcadia.webp',
    categoryId: 'fullstack',
    deployUrl: 'https://arcadia.nedellec-julien.fr',
    iconDeploy: 'icons/project/link.svg',
    technologies: ['angular', 'nestjs', 'typescript', 'tailwindcss', 'postgresql', 'mongodb', 'docker'],
    priority: 2,
    repos: [
      {
        url: 'https://github.com/djoudj-dev/arcadia-zoo-app-front',
        icon: 'icons/about/github.svg',
        label: 'Frontend',
      },
      {
        url: 'https://github.com/djoudj-dev/arcadia-zoo-app-back',
        icon: 'icons/about/github.svg',
        label: 'Backend',
      },
    ],
  },
  {
    id: 'calculator-bitcoin',
    title: "Calculateur d'investissement",
    description: 'Application web pour simuler les rendements d’investissements en Bitcoin.',
    image: 'images/projects/calculator.webp',
    categoryId: 'web',
    deployUrl: 'https://calculator-bitcoin.vercel.app/',
    iconDeploy: 'icons/project/link.svg',
    technologies: ['html5', 'css3', 'angular'],
    priority: 3,
    repos: [
      {
        url: 'https://github.com/djoudj-dev/calculator_bitcoin',
        icon: 'icons/about/github.svg',
        label: 'GitHub',
      },
    ],
  },
];
