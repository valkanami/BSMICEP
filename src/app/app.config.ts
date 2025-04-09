// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Importa esto
import { MainPageComponent } from './main-page/main-page.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', component: MainPageComponent },
      { path: 'main-page', component: MainPageComponent },
      { path: '**', redirectTo: '' }
    ]),
    provideHttpClient(withFetch()) // Añade esta línea
  ]
};