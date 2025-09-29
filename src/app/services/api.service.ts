import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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

  loginAdmin(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/admins/login`, { email, password });
  }

  saveToken(token: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}


  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdminAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

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
