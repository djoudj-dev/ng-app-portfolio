import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { HttpAdapterService } from '@app/core/http/http.adapter';
import { Badge, BadgeResponse } from '../interface/badge.interface';
import { ApiErrorResponse } from '@core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class BadgeService {
  private readonly http = inject(HttpAdapterService);
  private readonly endpoint = '/badges';

  readonly badges = signal<Badge[]>([]);
  readonly selectedBadge = signal<Badge | null>(null);

  getAllBadges(): Observable<Badge[]> {
    return this.http.get<BadgeResponse[]>(this.endpoint).pipe(
      map((badges) => badges.map(BadgeService.transformBadge)),
      tap((badges) => this.badges.set(badges))
    );
  }

  updateBadge(id: string, badge: Partial<Badge>): Observable<Badge> {
    return this.http.patch<BadgeResponse>(`${this.endpoint}/${id}`, badge).pipe(
      map(BadgeService.transformBadge),
      tap((updated) => {
        const list = this.badges();
        const index = list.findIndex((b) => b.id === updated.id);

        if (index !== -1) {
          const newList = [...list];
          newList[index] = updated;
          this.badges.set(newList);
        }

        // Synchronise si le badge mis à jour est celui sélectionné
        if (this.selectedBadge()?.id === updated.id) {
          this.selectedBadge.set(updated);
        }
      })
    );
  }

  private static transformBadge(badge: BadgeResponse): Badge {
    return {
      ...badge,
      availableUntil: badge.availableUntil ? new Date(badge.availableUntil) : null,
      createdAt: new Date(badge.createdAt),
      updatedAt: new Date(badge.updatedAt),
      isAvailable: badge.isAvailable ?? false,
    };
  }
}
