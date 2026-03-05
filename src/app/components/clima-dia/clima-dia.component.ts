
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

type PeriodKey = 'madrugada' | 'mañana' | 'tarde' | 'noche';

interface WeatherPeriod {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: string;
}

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: string;
  periodos: Record<PeriodKey, WeatherPeriod>;
}

@Component({
  selector: 'app-clima-dia',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './clima-dia.component.html',
  styleUrls: ['./clima-dia.component.css']
})
export class ClimaDiaComponent {
  weatherDataList: { location: string, data?: WeatherData, error?: string }[] = [];
  periods: PeriodKey[] = ['madrugada', 'mañana', 'tarde', 'noche'];
  isLoading = true;

  private locations = [
    { id: 'atoyac', name: 'Atoyac' },
    { id: 'potrero nuevo', name: 'Potrero Nuevo' },
    { id: 'amatlan de los reyes', name: 'Amatlán de los Reyes' },
    { id: 'yanga', name: 'Yanga' },
    { id: 'cuitlahuac', name: 'Cuitláhuac' },
    { id: 'paso del macho', name: 'Paso del Macho' },
    { id: 'manlio fabio altamirano', name: 'Manlio Fabio Altamirano' },
  ];

  constructor(private apiService: ApiService) {
    this.loadWeatherData();
  }

  loadWeatherData() {
    this.isLoading = true;
    this.weatherDataList = this.locations.map(loc => ({ location: loc.id }));

    this.locations.forEach(location => {
      this.apiService.getWeatherCurrent(location.id).subscribe({
        next: (data) => {
          const index = this.weatherDataList.findIndex(item => item.location === location.id);
          if (index !== -1) {
            this.weatherDataList[index] = {
              location: location.id,
              data: {
                ...data,
                city: location.name
              }
            };
          }
        },
        error: (err) => {
          const index = this.weatherDataList.findIndex(item => item.location === location.id);
          if (index !== -1) {
            this.weatherDataList[index] = {
              location: location.id,
              error: `Error al cargar datos para ${location.name}`
            };
          }
          console.error(`Error loading data for ${location.name}:`, err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
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

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}