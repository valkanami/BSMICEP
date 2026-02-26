import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

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
      sessionStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  removeToken() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('token');
    }
  }

  logout() {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  // ================== VALIDACIONES ==================

  /** ✅ Verifica si el token ha expirado */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now; // true si ya expiró
    } catch {
      return true; // token malformado o inválido
    }
  }

  /** ✅ Verifica si el usuario tiene un token válido */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token || this.isTokenExpired()) {
      this.logout();
      return false;
    }
    return true;
  }

  /** ✅ Verifica si el token pertenece a un admin */
  isAdminAuthenticated(): boolean {
    const token = this.getToken();
    if (!token || this.isTokenExpired()) {
      this.logout();
      return false;
    }

    try {
      const payload: any = jwtDecode(token);
      return payload.role === 'admin';
    } catch {
      return false;
    }
  }

  // ================== PERFILES Y DEMÁS ==================
  getPerfil(): Observable<{ message: string; userId: number }> {
    const token = this.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<{ message: string; userId: number }>(
      `${this.apiUrl}/api/usuarios/perfil`, 
      { headers }
    );
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

  // ================== INSERTAR DATOS ==================

/** Datos SQL (ya existente) */
insertDatosSQL(data: any): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/api/datos_sql`,
    data
  );
}

/** Registro Zafra */
insertRegistroZafra(data: any): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/api/registro-zafra`,
    data
  );
}

/** Datos por Hora */
insertDatosHora(data: any): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/api/datos-hora`,
    data
  );
}

/** Datos por Día */
insertDatosDia(data: any): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/api/datos-dia`,
    data
  );
}

/** Datos por Turno */
insertDatosTurno(data: any): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/api/datos-turno`,
    data
  );
}

/** Datos Tablas */
insertDatosTablas(data: any): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/api/datos-tablas`,
    data
  );
}

/** Datos Cuadros */
insertDatosCuadros(data: any): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/api/datos-cuadros`,
    data
  );
}

/** Promedios */
insertPromedios(data: any): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/api/promedios`,
    data
  );
}

}
