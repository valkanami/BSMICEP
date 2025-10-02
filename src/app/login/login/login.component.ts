import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { ApiService } from '../../services/api.service'; // ajusta la ruta si es otra


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    CommonModule // 👈 necesario para *ngIf, *ngFor, etc.
  ]
})

export class LoginComponent {
  email = '';
  password = '';
  error = '';

  showAdminModal = false;
  adminEmail = '';
  adminPassword = '';
  adminError = '';

  constructor(
  private router: Router,
  private http: HttpClient,
  private api: ApiService // 👈 aquí
) {}


  // Login normal
 onLogin() {
  this.api.loginUsuario(this.email, this.password).subscribe({
    next: (res) => {
      if (res.token) {
        this.api.saveToken(res.token);  // Guardar token JWT
        this.router.navigate(['/main-page']); // Redirigir a main page
      } else {
        this.error = 'Usuario o contraseña incorrectos';
      }
    },
    error: (err) => {
      this.error = err.error?.message || 'Error al iniciar sesión';
    }
  });
}


  // Abrir modal
  openAdminModal() {
    this.showAdminModal = true;
  }

  // Cerrar modal
  closeAdminModal() {
    this.showAdminModal = false;
    this.adminEmail = '';
    this.adminPassword = '';
    this.adminError = '';
  }

  // Verificar credenciales de administrador (correo + contraseña)
  checkAdminCredentials() {
  this.api.loginAdmin(this.adminEmail, this.adminPassword).subscribe({
  next: (res) => {
    if (res.token) {
      this.api.saveToken(res.token); // ⬅️ Aquí se guarda el token
      this.closeAdminModal();
      this.router.navigate(['/register']);
    } else {
      this.adminError = 'Correo o contraseña de admin incorrectos';
    }
  },
  error: () => {
    this.adminError = 'Error en la validación del servidor';
  }
});

}

}
