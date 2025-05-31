import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '@shared/ui/navbar/navbar.component';
import { HeroComponent } from '@feat/public/hero/hero.component';
import { AboutComponent } from '@feat/public/about/about.component';
import { StacksComponent } from '@feat/public/stacks/stacks.component';
import { ProjectComponent } from '@feat/public/project/project.component';
import { ContactComponent } from '@feat/public/contact/contact.component';
import emailjs from '@emailjs/browser';
import { FooterComponent } from '@shared/ui/footer/footer.component';
import { environment } from '@environments/environment';
import { ToastComponent } from '@shared/ui/toast/toast.component';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    StacksComponent,
    ProjectComponent,
    ContactComponent,
    FooterComponent,
    ToastComponent,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly router = inject(Router);

  title = 'ng-app-portfolio';
  isAdminRoute = signal<boolean>(false);

  constructor() {
    // Initialize EmailJS
    emailjs.init(environment.emailJsPublicKey);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.isAdminRoute.set(event.url.startsWith('/admin'));
    });
  }
}
