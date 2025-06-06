import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactMessageService } from '@feat/admin/contact/service/contact-message.service';

@Component({
  selector: 'app-contact-message-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mt-8 p-5 bg-background rounded-lg shadow-accent-md border border-accent-200 mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-text text-xl font-semibold">Messages de contact</h2>
        <a [routerLink]="['/admin/messages']" class="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg">
          Voir tous les messages
        </a>
      </div>

      @if (contactMessageService.messages().length === 0) {
        <div class="text-center py-8">
          <p class="text-gray-500">Aucun message trouvé</p>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-3 px-4 text-left">Expéditeur</th>
                <th class="py-3 px-4 text-left">Sujet</th>
                <th class="py-3 px-4 text-left">Date</th>
                <th class="py-3 px-4 text-left">Statut</th>
                <th class="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (message of recentMessages(); track message.id) {
                <tr class="border-t border-gray-200 hover:bg-gray-50" [class.font-semibold]="!message.read">
                  <td class="py-3 px-4">{{ message.name }}</td>
                  <td class="py-3 px-4">{{ message.subject }}</td>
                  <td class="py-3 px-4">{{ formatDate(message.createdAt) }}</td>
                  <td class="py-3 px-4">
                    <span
                      class="px-2 py-1 rounded-full text-xs"
                      [class.bg-blue-100]="!message.read"
                      [class.text-blue-800]="!message.read"
                      [class.bg-green-100]="message.read"
                      [class.text-green-800]="message.read"
                    >
                      {{ message.read ? 'Lu' : 'Non lu' }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex space-x-2">
                      @if (!message.read) {
                        <button (click)="markAsRead(message.id)" class="text-blue-500 hover:text-blue-700">
                          Marquer comme lu
                        </button>
                      }
                      <button (click)="deleteMessage(message.id)" class="text-red-500 hover:text-red-700">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          @if (contactMessageService.messages().length > 5) {
            <div class="mt-4 text-center">
              <a [routerLink]="['/admin/messages']" class="text-accent hover:underline">
                Voir tous les messages ({{ contactMessageService.messages().length }})
              </a>
            </div>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactMessageManagementComponent implements OnInit {
  contactMessageService = inject(ContactMessageService);

  ngOnInit(): void {
    this.contactMessageService.getMessages().subscribe();
  }

  // Get only the 5 most recent messages for the dashboard
  recentMessages = () => this.contactMessageService.messages().slice(0, 5);

  markAsRead(id: string): void {
    this.contactMessageService.markAsRead(id).subscribe();
  }

  deleteMessage(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      this.contactMessageService.deleteMessage(id).subscribe();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
