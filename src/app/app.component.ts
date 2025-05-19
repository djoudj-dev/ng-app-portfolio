import { Component } from '@angular/core';
import { NavbarComponent } from './shared/ui/navbar/navbar.component';
import { HeroComponent } from './features/public/hero/hero.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, HeroComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ng-app-portfolio';
}
