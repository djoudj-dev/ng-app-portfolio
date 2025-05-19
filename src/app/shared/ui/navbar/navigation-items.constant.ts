import { NavigationItem } from './navigation-item.interface';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: `Accueil`,
    icon: 'icons/navbar/home.svg',
    route: '/',
    fragment: 'hero',
  },
  {
    label: `À propos`,
    icon: 'icons/navbar/about.svg',
    route: '/',
    fragment: 'about',
  },
  {
    label: `Stacks`,
    icon: 'icons/navbar/stack.svg',
    route: '/',
    fragment: 'stacks',
  },
  {
    label: `Projets`,
    icon: 'icons/navbar/project.svg',
    route: '/',
    fragment: 'projects',
  },
  {
    label: `Contact`,
    icon: 'icons/navbar/contact.svg',
    route: '/',
    fragment: 'contact',
  },
];
