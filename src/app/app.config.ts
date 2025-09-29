import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; 

// Importa tus componentes
import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { PerfilComponent } from './login/perfil/perfil.component';
import { authGuard } from './auth.guard';
import { adminGuard } from './adminAuth.guard'; // 👈 nuevo guard para admins

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent, canActivate: [adminGuard] }, // 🔒 solo admins
      { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
      { path: 'main-page', component: MainPageComponent, canActivate: [authGuard] },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login' }
    ]),
    provideHttpClient(withFetch())
  ]
};
