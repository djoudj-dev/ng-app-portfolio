import { Injectable, inject } from '@angular/core';
import { HttpAdapterService } from '@core/http/http.adapter';
import { Observable } from 'rxjs';
import { ContactForm, ContactFormResponse } from '@feat/public/contact/interface/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly httpAdapter = inject(HttpAdapterService);

  /**
   * Sends the contact form data to the backend API
   * @param formData The contact form data
   * @returns An observable of the API response
   */
  sendContactForm(formData: ContactForm): Observable<ContactFormResponse> {
    return this.httpAdapter.post<ContactFormResponse>('/contact', formData);
  }
}
