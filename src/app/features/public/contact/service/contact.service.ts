import { Injectable, inject } from '@angular/core';
import { HttpAdapterService } from '@core/http/http.adapter';
import { Observable } from 'rxjs';
import { ContactForm, ContactFormResponse } from '@feat/public/contact/interface/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly httpAdapter = inject(HttpAdapterService);

  sendContactForm(formData: ContactForm): Observable<ContactFormResponse> {
    return this.httpAdapter.post<ContactFormResponse>('/contact', formData);
  }
}
