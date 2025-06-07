import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '@feat/public/hero/hero.component';
import { AboutComponent } from '@feat/public/about/about.component';
import { StacksComponent } from '@feat/public/stacks/stacks.component';
import { ProjectComponent } from '@feat/public/project/project.component';
import { ContactComponent } from '@feat/public/contact/contact.component';
import { FooterComponent } from '@shared/ui/footer/footer.component';
import { ToastComponent } from '@shared/ui/toast/toast.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@shared/ui/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    HeroComponent,
    AboutComponent,
    StacksComponent,
    ProjectComponent,
    ContactComponent,
    FooterComponent,
    ToastComponent,
    RouterOutlet,
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ng-app-portfolio';
}
