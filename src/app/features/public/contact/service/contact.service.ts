import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactCard, ContactCardGroup, ContactForm } from '../interface/contact.interface';
import { Observable, catchError, from, map, switchMap, tap } from 'rxjs';

// Note: You need to install EmailJS by running:
// npm install @emailjs/browser

// Import EmailJS
import emailjs from '@emailjs/browser';

interface Contact {
  cards: ContactCard[];
  cardGroups: ContactCardGroup[];
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  private readonly emailjsServiceId = 'service_7775dum';
  private readonly emailjsTemplateId = 'template_99lis6j';
  private readonly recipientEmail = 'contact@nedellec-julien.fr';

  private readonly _data = signal<Contact | null>(null);
  readonly data = this._data.asReadonly();

  getContactCards(): Observable<ContactCard[]> {
    return this.http.get<ContactCard[]>(`${this.apiUrl}/cards`);
  }

  getContactCardGroups(): Observable<ContactCardGroup[]> {
    return this.http.get<ContactCardGroup[]>(`${this.apiUrl}/cardGroups`);
  }

  load(): void {
    this.http.get<Contact>(`${this.apiUrl}/contact`).subscribe({
      next: (res) => {
        console.log('Data loaded:', res); // Log pour vérifier les données
        this._data.set(res);
      },
      error: (err) => console.error('Erreur API contact:', err),
    });
  }

  sendContactForm(formData: ContactForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/messages`, formData).pipe(
      switchMap((response) => {
        const templateParams = {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          time: new Date().toLocaleString(),
        };

        return from(emailjs.send(this.emailjsServiceId, this.emailjsTemplateId, templateParams)).pipe(
          map(() => response), // Return the original response
          catchError((error) => {
            console.error('Error sending email:', error);

            if (error.status === 400 && error.text?.includes('Public Key is invalid')) {
              console.error('EmailJS Public Key is invalid. Please update it in app.component.ts');
            } else if (error.status === 404 && error.text?.includes('service_id')) {
              console.error('EmailJS Service ID is invalid. Please update it in contact.service.ts');
            } else if (error.status === 404 && error.text?.includes('template_id')) {
              console.error('EmailJS Template ID is invalid. Please update it in contact.service.ts');
            }

            throw error;
          })
        );
      }),
      tap(() => {
        console.log('Email sent to:', this.recipientEmail);
      })
    );
  }
}
