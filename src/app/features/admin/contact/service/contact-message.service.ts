import { Injectable, inject, signal } from '@angular/core';
import { HttpAdapterService } from '@core/http/http.adapter';
import { Observable, tap } from 'rxjs';
import { ContactMessage, ContactMessageCount } from '../interface/contact-message.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactMessageService {
  private readonly httpAdapter = inject(HttpAdapterService);

  // Signals to store contact messages
  private readonly _messages = signal<ContactMessage[]>([]);
  private readonly _unreadCount = signal<number>(0);

  // Public readonly signals
  readonly messages = this._messages.asReadonly();
  readonly unreadCount = this._unreadCount.asReadonly();

  // Get all contact messages
  getMessages(): Observable<ContactMessage[]> {
    return this.httpAdapter.get<ContactMessage[]>('/contact').pipe(
      tap((messages) => {
        this._messages.set(messages);
        this._unreadCount.set(messages.filter((message) => !message.read).length);
      })
    );
  }

  // Get unread message count
  getUnreadCount(): Observable<ContactMessageCount> {
    return this.httpAdapter.get<ContactMessageCount>('/contact/unread-count').pipe(
      tap((response) => {
        this._unreadCount.set(response.count);
      })
    );
  }

  // Get a specific message
  getMessage(id: string): Observable<ContactMessage> {
    return this.httpAdapter.get<ContactMessage>(`/contact/${id}`);
  }

  // Mark a message as read
  markAsRead(id: string): Observable<ContactMessage> {
    return this.httpAdapter.put<ContactMessage>(`/contact/${id}/read`, {}).pipe(
      tap((updatedMessage) => {
        const currentMessages = this._messages();
        const index = currentMessages.findIndex((message) => message.id === id);

        if (index !== -1) {
          const updatedMessages = [...currentMessages];
          updatedMessages[index] = updatedMessage;
          this._messages.set(updatedMessages);

          // Update unread count
          this._unreadCount.set(this._unreadCount() - 1);
        }
      })
    );
  }

  // Delete a message
  deleteMessage(id: string): Observable<ContactMessage> {
    return this.httpAdapter.delete<ContactMessage>(`/contact/${id}`).pipe(
      tap((deletedMessage) => {
        const currentMessages = this._messages();
        this._messages.set(currentMessages.filter((message) => message.id !== id));

        // Update unread count if the deleted message was unread
        if (!deletedMessage.read) {
          this._unreadCount.set(this._unreadCount() - 1);
        }
      })
    );
  }
}
