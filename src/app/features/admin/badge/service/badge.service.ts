import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { HttpAdapterService } from '@app/core/http/http.adapter';
import { Badge } from '../interface/badge.interface';

@Injectable({ providedIn: 'root' })
export class BadgeService {
  private readonly http = inject(HttpAdapterService);
  private readonly endpoint = '/badges';

  badges = signal<Badge[]>([]);
  selectedBadge = signal<Badge | null>(null);

  getAllBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(this.endpoint).pipe(
      map((badges) => badges.map(this.transformBadge)),
      tap((badges) => this.badges.set(badges))
    );
  }

  getBadgeById(id: string): Observable<Badge> {
    return this.http.get<Badge>(`${this.endpoint}/${id}`).pipe(
      map(this.transformBadge),
      tap((badge) => this.selectedBadge.set(badge))
    );
  }

  createBadge(badge: Partial<Badge>): Observable<Badge> {
    return this.http.post<Badge>(this.endpoint, badge).pipe(
      map(this.transformBadge),
      tap((badge) => this.badges.set([...this.badges(), badge]))
    );
  }

  updateBadge(id: string, badge: Partial<Badge>): Observable<Badge> {
    return this.http.patch<Badge>(`${this.endpoint}/${id}`, badge).pipe(
      map(this.transformBadge),
      tap((updated) => {
        const updatedList = this.badges().map((b) => (b.id === updated.id ? updated : b));
        this.badges.set(updatedList);
        if (this.selectedBadge()?.id === updated.id) this.selectedBadge.set(updated);
      })
    );
  }

  deleteBadge(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`).pipe(
      tap(() => {
        this.badges.set(this.badges().filter((b) => b.id !== id));
        if (this.selectedBadge()?.id === id) this.selectedBadge.set(null);
      })
    );
  }

  private transformBadge(badge: any): Badge {
    return {
      ...badge,
      availableUntil: badge.availableUntil ? new Date(badge.availableUntil) : null,
      createdAt: new Date(badge.createdAt),
      updatedAt: new Date(badge.updatedAt),
      isAvailable: badge.isAvailable ?? false,
    };
  }
}
