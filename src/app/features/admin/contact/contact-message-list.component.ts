import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactMessageService } from './service/contact-message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contact-message-list',
  imports: [CommonModule],
  templateUrl: './contact-message-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactMessageListComponent {
  private readonly contactMessageService = inject(ContactMessageService);

  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Get messages from service
  messages = this.contactMessageService.messages;
  unreadCount = this.contactMessageService.unreadCount;

  constructor() {
    this.loadMessages();
  }

  loadMessages(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.contactMessageService.getMessages().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.error.set('Failed to load contact messages. Please try again later.');
        this.isLoading.set(false);
      },
    });
  }

  markAsRead(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.contactMessageService.markAsRead(id).subscribe({
      next: () => {
        // Success notification could be added here
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        // Error notification could be added here
      },
    });
  }

  deleteMessage(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (confirm('Are you sure you want to delete this message?')) {
      this.contactMessageService.deleteMessage(id).subscribe({
        next: () => {
          // Success notification could be added here
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          // Error notification could be added here
        },
      });
    }
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
