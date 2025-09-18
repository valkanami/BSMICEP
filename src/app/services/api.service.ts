import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

 // ================= LOGIN Y REGISTRO =================
  registerUsuario(nombre: string, apellidos: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/usuarios/register`, {
      nombre, apellidos, email, password
    });
  }

  loginUsuario(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/usuarios/login`, {
      email, password
    });
  }

  // Guardar token en localStorage
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  // ================= PETICIONES CON AUTENTICACIÓN =================
  getPerfil(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any>(`${this.apiUrl}/api/usuarios/perfil`, { headers });
  }

  // 📌 /api/limites/:id
getLimiteById(id: number | string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/limites/${id}`);
}


  // 📌 /api/registrozafra
  getRegistroZafra(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/registrozafra`);
  }

  // 📌 /api/datosturno
  getDatosTurno(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/datosturno`);
  }

  // 📌 /api/promedios
  getPromedios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/promedios`);
  }

  // 📌 /api/datossql
  getDatosSql(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/datossql`);
  }

  // 📌 /api/datoshora
  getDatosHora(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/datoshora`);
  }

  // 📌 /api/datosdia
  getDatosDia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/datosdia`);
  }

  // 📌 /api/datostablas
  getDatosTablas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/datostablas`);
  }

  // 📌 /api/datoscuadros
  getDatosCuadros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/datoscuadros`);
  }

  // 📌 /api/weather/current/:id
  getWeatherCurrent(locationId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/weather/current/${locationId}`);
  }

  // 📌 /api/weather/forecast/:id
  getWeatherForecast(locationId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/weather/forecast/${locationId}`);
  }
}
