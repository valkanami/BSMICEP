import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { PerfilComponent } from './login/perfil/perfil.component';
import { authGuard } from './auth.guard';
import { adminGuard } from './adminAuth.guard'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [adminGuard] }, 
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: '', component: MainPageComponent },    
  { path: '**', redirectTo: '' }
];
//$2b$10$2UnAednMYnyxS7Hk9ik0EOOeRyk6dOExfSn0DsBXusWHkZXaW0xXq
 