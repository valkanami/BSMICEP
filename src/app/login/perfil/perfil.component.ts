import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  mensaje = '';

  constructor(private api: ApiService, private router: Router) {
    this.loadPerfil();
  }

  loadPerfil() {
    if (!this.api.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.api.getPerfil().subscribe({
        next: res => this.mensaje = res.message,
        error: () => {
          this.mensaje = 'No autorizado';
          this.router.navigate(['/login']);
        }
      });
    }
  }

  logout() {
    this.api.logout();
    this.router.navigate(['/login']);
  }
}
