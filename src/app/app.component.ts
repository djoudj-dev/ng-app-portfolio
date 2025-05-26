import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    StacksComponent,
    ProjectComponent,
    ContactComponent,
    FooterComponent,
    ToastComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'ng-app-portfolio';

  ngOnInit(): void {
    emailjs.init(environment.emailJsPublicKey);
  }
}
