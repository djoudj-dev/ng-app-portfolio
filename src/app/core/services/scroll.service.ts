import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  /**
   * Fait défiler la page vers une section cible par son fragment (id HTML)
   * @param fragment Identifiant de l'élément cible (#section)
   */
  async scrollToSection(fragment?: string): Promise<void> {
    if (!fragment) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    queueMicrotask(() => {});

    const target = document.getElementById(fragment);
    if (!target) return;

    const navbar = document.querySelector('[app-navbar]');
    const navbarHeight = navbar?.getBoundingClientRect().height ?? 0;

    const offset = navbarHeight + 80;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
