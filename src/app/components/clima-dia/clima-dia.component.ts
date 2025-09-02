
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
  weatherDataList: {location: string, data?: WeatherData, error?: string}[] = [];
  periods: PeriodKey[] = ['madrugada', 'mañana', 'tarde', 'noche'];
  isLoading = true;

  private locations = [
    {id: 'atoyac', name: 'Atoyac'},
    {id: 'potrero nuevo', name: 'Potrero Nuevo'},
    {id: 'amatlan de los reyes', name: 'Amatlán de los Reyes'},
    {id: 'yanga', name: 'Yanga'},
    {id: 'cuitlahuac', name: 'Cuitláhuac'},
    {id: 'paso del macho', name: 'Paso del Macho'},
    {id: 'manlio fabio altamirano', name: 'Manlio Fabio Altamirano'},
  ];

  constructor(private apiService: ApiService) {
    this.loadWeatherData();
  }

  loadWeatherData() {
    this.isLoading = true;
    this.weatherDataList = this.locations.map(loc => ({location: loc.id}));
    
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

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
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