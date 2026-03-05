import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // Register Admin Flow
  showRegisterAdminAuthModal = false;
  showRegisterAdminFormModal = false;
  showSuccessModal = false;

  authAdminEmail = '';
  authAdminPassword = '';
  authAdminError = '';

  newAdminNombre = '';
  newAdminEmail = '';
  newAdminPassword = '';
  newAdminError = '';
  newAdminSuccess = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private api: ApiService // 👈 aquí
  ) { }


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

  // ================== REGISTRAR ADMIN ==================

  // 1. Abrir Modal de validación de Admin (para poder registrar a otro admin)
  openRegisterAdminAuthModal() {
    this.showRegisterAdminAuthModal = true;
  }

  closeRegisterAdminAuthModal() {
    this.showRegisterAdminAuthModal = false;
    this.authAdminEmail = '';
    this.authAdminPassword = '';
    this.authAdminError = '';
  }

  // Verificamos que es un admin para darle acceso a registrar nuevo admin
  verifyToRegisterAdmin() {
    this.authAdminError = '';
    this.api.loginAdmin(this.authAdminEmail, this.authAdminPassword).subscribe({
      next: (res) => {
        if (res.token) {
          this.api.saveToken(res.token); // Guardamos token para el request de registro
          this.closeRegisterAdminAuthModal();
          this.showRegisterAdminFormModal = true; // Mostramos el form de registro
        } else {
          this.authAdminError = 'Credenciales de administrador incorrectas';
        }
      },
      error: () => {
        this.authAdminError = 'Error en la validación del servidor';
      }
    });
  }

  // 2. Cerrar Modal del formulario
  closeRegisterAdminFormModal() {
    this.showRegisterAdminFormModal = false;
    this.newAdminNombre = '';
    this.newAdminEmail = '';
    this.newAdminPassword = '';
    this.newAdminError = '';
    this.api.removeToken(); // Quitamos el token por seguridad si cancela
  }

  // 3. Registrar al nuevo admin
  onRegisterAdmin() {
    this.newAdminError = '';
    const token = this.api.getToken();
    if (!token) {
      this.newAdminError = 'No estás autorizado para esta acción';
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.api.registerAdmin(this.newAdminNombre, this.newAdminEmail, this.newAdminPassword, headers).subscribe({
      next: () => {
        this.showRegisterAdminFormModal = false;
        this.newAdminSuccess = '✅ Administrador registrado exitosamente';
        this.showSuccessModal = true;
      },
      error: (err) => {
        this.newAdminError = err.error?.message || 'Error al registrar al administrador';
      }
    });
  }

  // 4. Modal de éxito
  closeSuccessModal() {
    this.showSuccessModal = false;
    this.newAdminNombre = '';
    this.newAdminEmail = '';
    this.newAdminPassword = '';
    this.api.removeToken();
  }

}
