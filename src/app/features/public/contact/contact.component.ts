import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactCard, ContactCardGroup, ContactForm } from '@feat/public/contact/interface/contact.interface';
import { ToastService } from '@core/services/toast.service';
import { ToastComponent } from '@shared/ui/toast/toast.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { CONTACT_DATA } from '@feat/public/contact/data/contact.data';
import { ContactService } from '@feat/public/contact/service/contact.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage, ToastComponent, ButtonComponent],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  contactForm: FormGroup;
  contactCards = signal<ContactCard[]>(CONTACT_DATA.cards);
  contactCardGroups = signal<ContactCardGroup[]>(CONTACT_DATA.cardGroups);
  formSubmitted = signal<boolean>(false);
  isSending = signal<boolean>(false);

  private readonly toastService = inject(ToastService);
  private readonly contactService = inject(ContactService);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZÀ-ÿ]+([ '-][a-zA-ZÀ-ÿ]+)*$/)],
      ],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
      subject: [
        '',
        [Validators.required, Validators.minLength(3), Validators.pattern(/^[\wÀ-ÿ0-9 .,'"!?()\-]{3,100}$/)],
      ],
      message: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^(?!.*[<>]).{10,1000}$/s)]],
      honeypot: [''],
      formStartTime: [Date.now()],
    });
  }

  get nameControl() {
    return this.contactForm.get('name');
  }

  get emailControl() {
    return this.contactForm.get('email');
  }

  get subjectControl() {
    return this.contactForm.get('subject');
  }

  get messageControl() {
    return this.contactForm.get('message');
  }

  onSubmit() {
    this.formSubmitted.set(true);

    if (this.contactForm.invalid) {
      this.toastService.showError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    // Check for honeypot (anti-spam)
    if (this.contactForm.get('honeypot')?.value) {
      return;
    }

    this.isSending.set(true);

    // Create the contact form data object
    const formData: ContactForm = {
      name: this.contactForm.get('name')?.value,
      email: this.contactForm.get('email')?.value,
      subject: this.contactForm.get('subject')?.value,
      message: this.contactForm.get('message')?.value,
    };

    // Send the form data to the backend
    this.contactService.sendContactForm(formData).subscribe({
      next: () => {
        this.toastService.showSuccess('Votre message a été envoyé avec succès!');
        this.contactForm.reset();
        this.formSubmitted.set(false);
        this.isSending.set(false);
      },
      error: (error) => {
        console.error('Error sending contact form:', error);
        this.toastService.showError(
          "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard."
        );
        this.isSending.set(false);
      },
    });
  }
}
