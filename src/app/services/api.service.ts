import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 📌 /api/limites
  getLimites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/limites`);
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
}
