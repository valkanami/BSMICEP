import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule]
})
export class RegisterComponent implements OnDestroy {
  nombre = '';
  apellidos = '';
  email = '';
  password = '';

  error = '';
  success = '';
  showModal = false; 

  constructor(private api: ApiService, private router: Router) {}

  onRegister() {
    this.error = '';
    this.success = '';

    if (!this.api.isAdminAuthenticated()) {
      this.error = '❌ Debes iniciar sesión como administrador para registrar usuarios';
      this.api.logout();
      return;
    }

    const token = this.api.getToken()!;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.api.registerUsuario(this.nombre, this.apellidos, this.email, this.password, headers)
      .subscribe({
        next: () => {
          this.success = '✅ Registro exitoso';
          this.showModal = true; 
        },
        error: (err) => {
          this.error = err.error?.message || '❌ Error al registrar el usuario';
        }
      });
  }

  addAnother() {
    this.showModal = false;
    this.success = '';
    this.nombre = '';
    this.apellidos = '';
    this.email = '';
    this.password = '';
  }

  goHome() {
    this.showModal = false;
    this.router.navigate(['/login']); 
  }

  ngOnDestroy(): void {
    // 🔒 Al salir de /register, borro el token
    this.api.logout();
  }
}
