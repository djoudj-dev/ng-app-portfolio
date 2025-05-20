import { inject, Injectable, signal } from '@angular/core';
import { ContactCard, ContactCardGroup, ContactForm } from '../interface/contact.interface';
import { Observable, catchError, from, map, tap } from 'rxjs';
import { DataService } from '../../../../core/services/data.service';

// Import EmailJS
import emailjs from '@emailjs/browser';
import { environment } from '../../../../../environments/environment.development';

interface Contact {
  cards: ContactCard[];
  cardGroups: ContactCardGroup[];
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly dataService = inject(DataService);

  private readonly emailjsServiceId = environment.emailjsServiceId;
  private readonly emailjsTemplateId = environment.emailjsTemplateId;
  private readonly recipientEmail = environment.recipientEmail;

  private readonly _data = signal<Contact | null>(null);
  readonly data = this._data.asReadonly();

  load(): void {
    this.dataService.getSection<Contact>('contact').subscribe({
      next: (res) => {
        this._data.set(res);
      },
      error: (err) => console.error('Erreur chargement contact:', err),
    });
  }

  sendContactForm(formData: ContactForm): Observable<any> {
    // Directly send email without storing in json-server
    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      time: new Date().toLocaleString(),
    };

    return from(emailjs.send(this.emailjsServiceId, this.emailjsTemplateId, templateParams)).pipe(
      map(() => ({ success: true, message: 'Email sent successfully' })),
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
      }),
      tap(() => {
        console.log('Email sent to:', this.recipientEmail);
      })
    );
  }
}
