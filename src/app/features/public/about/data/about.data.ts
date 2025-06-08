import { About } from '@feat/public/about/interface/about.interface';
import { DATA_INTERESTS } from '@feat/public/about/data/about-interest.data';
import { DATA_SOCIAL_LINKS } from '@feat/public/about/data/social-link.data';

export const ABOUT_DATA: About = {
  fullname: 'Julien NÉDELLEC',
  title: 'Développeur Angular Fullstack',
  email: 'contact@nedellec-julien.fr',
  location: 'Voisins-Le-Bretonneux',
  imageUrl: 'images/julien.webp',
  description: `Passionné par le code propre et durable, je considère chaque ligne comme une brique d’un ensemble cohérent, lisible et maintenable.
Mon approche repose sur une architecture modulaire, pensée pour évoluer avec les équipes et les besoins techniques.
Je conçois des interfaces claires, accessibles et centrées sur l’utilisateur, pour répondre à de vrais besoins avec sens et efficacité.
Ce qui me motive, c’est d’écrire un code clair, structuré et testé, capable d’évoluer sereinement face aux besoins concrets.
Je conçois des solutions simples, robustes et durables, en restant à l’écoute des usages pour offrir une expérience fluide et pertinente.`,
  interests: DATA_INTERESTS,
  socialLinks: DATA_SOCIAL_LINKS,
};
