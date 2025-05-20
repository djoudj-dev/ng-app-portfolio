import { ChangeDetectionStrategy, Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactCard, ContactCardGroup } from '@feat/public/contact/interface/contact.interface';
import { ContactService } from '@feat/public/contact/service/contact.service';
import { ToastService } from '@core/services/toast.service';
import { ToastComponent } from '@shared/ui/toast/toast.component';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage, ToastComponent, ButtonComponent],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  contactCards = signal<ContactCard[]>([]);
  contactCardGroups = signal<ContactCardGroup[]>([]);
  formSubmitted = signal<boolean>(false);
  isSending = signal<boolean>(false); // Variable pour suivre l'état d'envoi

  private readonly contactService = inject(ContactService);
  private readonly toastService = inject(ToastService);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });

    effect(() => {
      const data = this.contactService.data();
      if (data) {
        this.contactCards.set(data.cards || []);
        this.contactCardGroups.set(data.cardGroups || []);
      }
    });
  }

  ngOnInit(): void {
    this.contactService.load();
  }

  onSubmit(): void {
    this.formSubmitted.set(true);

    if (this.contactForm.valid) {
      this.isSending.set(true); // Activer le spinner

      this.contactService.sendContactForm(this.contactForm.value).subscribe({
        next: () => {
          this.contactForm.reset();
          this.formSubmitted.set(false);
          this.isSending.set(false); // Désactiver le spinner
          this.toastService.showSuccess('Votre message a été envoyé avec succès!');
        },
        error: (error) => {
          console.error('Error sending email:', error);
          this.isSending.set(false); // Désactiver le spinner

          let errorMessage = "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer plus tard.";

          if (error.status === 400 && error.text?.includes('Public Key is invalid')) {
            errorMessage =
              "Erreur de configuration EmailJS: Clé publique invalide. Veuillez contacter l'administrateur.";
          } else if (
            error.status === 404 &&
            (error.text?.includes('service_id') || error.text?.includes('template_id'))
          ) {
            errorMessage =
              "Erreur de configuration EmailJS: Service ou template invalide. Veuillez contacter l'administrateur.";
          } else if (error.status === 0) {
            errorMessage = "Impossible de se connecter au service d'envoi d'emails. Vérifiez votre connexion internet.";
          }

          this.toastService.showError(errorMessage);
        },
      });
    }
  }

  // Helper methods for form validation
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
}
