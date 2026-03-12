import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../services/api.service';

interface DailyForecast {
  date: string;
  avgTemperature: number;
  avgHumidity: number;
  avgWindSpeed: number;
  mainDescription: string;
  mainIcon: string;
}

interface WeatherForecast {
  city: string;
  country: string;
  daily: {
    [date: string]: DailyForecast;
  };
}

@Component({
  selector: 'app-clima-semana',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './clima-semana.component.html',
  styleUrls: ['./clima-semana.component.css']
})
export class ClimaSemanaComponent {
  @Input() apiUrl: string = 'http://localhost:3000/api/weather/forecast/';
  forecastsData: WeatherForecast[] = [];
  loading: boolean = false;
  error: string | null = null;
  locations = [
    { name: 'Atoyac', id: 'atoyac' },
    { name: 'Potrero Nuevo', id: 'potrero nuevo' },
    { name: 'Amatlán de los Reyes', id: 'amatlan de los reyes' },
    { name: 'Yanga', id: 'yanga' },
    { name: 'Cuitláhuac', id: 'cuitlahuac' },
    { name: 'Paso del Macho', id: 'paso del macho' },
    { name: 'Manlio Fabio Altamirano', id: 'manlio fabio altamirano' }
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadAllForecasts();
  }

  loadAllForecasts() {
    this.loading = true;
    this.error = null;
    this.forecastsData = [];

    // Crear un array de observables para todas las localidades
    const requests = this.locations.map(location =>
      this.apiService.getWeatherForecast(location.id).pipe(
        catchError(error => {
          console.error(`Error loading data for ${location.name}`, error);
          return of(null);
        })
      )
    );

    // Ejecutar todas las peticiones en paralelo
    forkJoin(requests).subscribe(results => {
      results.forEach((data, index) => {
        if (data) {
          // Asegurarnos de que tenemos el nombre de la localidad
          data.city = data.city || this.locations[index].name;
          this.forecastsData.push(data);
        }
      });
      this.loading = false;
    });
  }

  getWeatherIconClass(iconCode: string): { class: string, color: string } {
    const iconMap: { [key: string]: { class: string, color: string } } = {
      '01d': { class: 'fas fa-sun', color: '#f39c12' },
      '01n': { class: 'fas fa-moon', color: '#2c3e50' },
      '02d': { class: 'fas fa-cloud-sun', color: '#f39c12' },
      '02n': { class: 'fas fa-cloud-moon', color: '#34495e' },
      '03d': { class: 'fas fa-cloud', color: '#95a5a6' },
      '03n': { class: 'fas fa-cloud', color: '#7f8c8d' },
      '04d': { class: 'fas fa-cloud', color: '#7f8c8d' },
      '04n': { class: 'fas fa-cloud', color: '#34495e' },
      '09d': { class: 'fas fa-cloud-showers-heavy', color: '#3498db' },
      '09n': { class: 'fas fa-cloud-showers-heavy', color: '#2980b9' },
      '10d': { class: 'fas fa-cloud-sun-rain', color: '#f39c12' },
      '10n': { class: 'fas fa-cloud-moon-rain', color: '#34495e' },
      '11d': { class: 'fas fa-bolt', color: '#e67e22' },
      '11n': { class: 'fas fa-bolt', color: '#d35400' },
      '13d': { class: 'fas fa-snowflake', color: '#74b9ff' },
      '13n': { class: 'fas fa-snowflake', color: '#0984e3' },
      '50d': { class: 'fas fa-smog', color: '#95a5a6' },
      '50n': { class: 'fas fa-smog', color: '#7f8c8d' },
    };
    return iconMap[iconCode] || { class: 'fas fa-cloud', color: '#95a5a6' };
  }

  getSortedDailyForecasts(dailyData: { [date: string]: DailyForecast }): DailyForecast[] {
    if (!dailyData) return [];
    return Object.values(dailyData).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  getDayName(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { weekday: 'long' });
  }

  isDay(iconCode: string): boolean {
    return iconCode ? iconCode.includes('d') : true;
  }

  isCloudy(iconCode: string): boolean {
    if (!iconCode) return false;
    const code = iconCode.substring(0, 2);
    return ['02', '03', '04', '09', '10', '11'].includes(code);
  }

  isRainy(iconCode: string): boolean {
    if (!iconCode) return false;
    const code = iconCode.substring(0, 2);
    return ['09', '10', '11'].includes(code);
  }
}