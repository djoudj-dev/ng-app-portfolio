import { Component } from '@angular/core';
import { NavbarComponent } from './shared/ui/navbar/navbar.component';
import { HeroComponent } from './features/public/hero/hero.component';
import { AboutComponent } from './features/public/about/about.component';
import { StacksComponent } from './features/public/stacks/stacks.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, HeroComponent, AboutComponent, StacksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ng-app-portfolio';
}
