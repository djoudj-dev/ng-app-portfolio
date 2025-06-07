import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@app/app.config';
import { AppComponent } from '@app/app.component';
import { environment } from '@environments/environment';

console.log('✅ Angular is running in:', environment.production ? 'PRODUCTION' : 'DEV');
console.log('🌍 API Base URL =', environment.apiUrl);

bootstrapApplication(AppComponent, appConfig).catch(() => console.error());
