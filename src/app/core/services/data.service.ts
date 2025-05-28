import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { HttpAdapterService } from '@core/http/http.adapter';
import { About } from '@feat/public/about/interface/about.interface';
import { Category, HardSkills, SoftSkills } from '@feat/public/stacks/interface/stacks.interface';
import { Project, ProjectCategory } from '@feat/public/project/interface/project.interface';
import { ContactCard, ContactCardGroup } from '@feat/public/contact/interface/contact.interface';

/**
 * Interface representing the structure of the portfolio data JSON file
 */
export interface PortfolioData {
  about: About;
  stacks: {
    categories: Category[];
    hardskills: HardSkills[];
    softskills: SoftSkills[];
  };
  projects: {
    items: Project[];
    categories: ProjectCategory[];
  };
  contact: {
    cards: ContactCard[];
    groups: ContactCardGroup[];
  };
  [key: string]: any; // For any other sections not explicitly typed
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(HttpAdapterService);
  private jsonData$: Observable<PortfolioData> | null = null;

  loadData(): Observable<PortfolioData> {
    if (!this.jsonData$) {
      // Load the file from the public directory using getLocal
      this.jsonData$ = this.http.getLocal<PortfolioData>('/db.json').pipe(
        shareReplay(1) // Cache the result
      );
    }
    return this.jsonData$;
  }

  getSection<T>(section: string): Observable<T> {
    // For backward compatibility, still use local data
    return this.loadData().pipe(map((data) => data[section] as T));
  }
}
