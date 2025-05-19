import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './shared/ui/navbar/navbar.component';
import { HeroComponent } from './features/public/hero/hero.component';
import { AboutComponent } from './features/public/about/about.component';
import { StacksComponent } from './features/public/stacks/stacks.component';
import { ProjectComponent } from './features/public/project/project.component';
import { ContactComponent } from './features/public/contact/contact.component';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, HeroComponent, AboutComponent, StacksComponent, ProjectComponent, ContactComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'ng-app-portfolio';

  ngOnInit(): void {
    emailjs.init('RF_1J9PnDw2QM1OIB');
  }
}
