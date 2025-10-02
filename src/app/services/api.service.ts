import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  // ================== USUARIOS ==================
  registerUsuario(
    nombre: string,
    apellidos: string,
    email: string,
    password: string,
    headers?: HttpHeaders 
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/api/usuarios/register`,
      { nombre, apellidos, email, password },
      headers ? { headers } : {}
    );
  }

  loginUsuario(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/usuarios/login`, { email, password });
  }

  // ================== ADMIN ==================
  loginAdmin(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/admins/login`, { email, password });
  }

  // ================== TOKEN ==================
  saveToken(token: string) {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('token', token); // 🔑 Usar sessionStorage
    }
  }

  getToken(): string | null {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('token'); // 🔑 Usar sessionStorage
    }
    return null;
  }

  removeToken() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('token');
    }
  }

  logout() {
    this.removeToken(); // limpiar token
    this.router.navigate(['/login']); // 🔒 Redirigir al login
  }

  // ================== VALIDACIONES ==================
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdminAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000); // ⏰ en segundos

      if (payload.exp < now) {
        this.removeToken(); // limpiar token vencido
        return false;
      }

      return payload.role === 'admin';
    } catch {
      return false;
    }
  }

  // ================== PERFILES Y DEMÁS ==================
  getPerfil(): Observable<{ message: string; userId: number }> {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<{ message: string; userId: number }>(`${this.apiUrl}/api/usuarios/perfil`, { headers });
  }

  getLimiteById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/limites/${id}`);
  }

  getRegistroZafra(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/registrozafra`);
  }

  getDatosTurno(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/datosturno`);
  }

  getPromedios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/promedios`);
  }

  getDatosSql(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/datossql`);
  }

  getDatosHora(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/datoshora`);
  }

  getDatosDia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/datosdia`);
  }

  getDatosTablas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/datostablas`);
  }

  getDatosCuadros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/datoscuadros`);
  }

  getWeatherCurrent(locationId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/weather/current/${locationId}`);
  }

  getWeatherForecast(locationId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/weather/forecast/${locationId}`);
  }
}
