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

  constructor(private apiService: ApiService) {}

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

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  getSortedDailyForecasts(dailyData: {[date: string]: DailyForecast}): DailyForecast[] {
    if (!dailyData) return [];
    return Object.values(dailyData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  getDayName(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { weekday: 'long' });
  }
}