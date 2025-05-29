import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeFormComponent } from './components/badge-form/badge-form.component';
import { BadgeService } from './service/badge.service';

@Component({
  selector: 'app-badge-management',
  imports: [CommonModule, BadgeFormComponent],
  templateUrl: './badge-management.component.html',
})
export class BadgeManagementComponent implements OnInit {
  badgeService = inject(BadgeService);
  formSaved = false;

  constructor() {
    effect(() => {
      if (this.formSaved) {
        this.badgeService.selectedBadge.set(null);
        this.formSaved = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadBadges();
  }

  loadBadges(): void {
    this.badgeService.getAllBadges().subscribe({
      next: (badges) => {
        if (badges.length > 0) {
          this.badgeService.selectedBadge.set(badges[0]); // sélectionne auto
        }
      },
      error: (err) => console.error('Erreur chargement badges', err),
    });
  }
}
