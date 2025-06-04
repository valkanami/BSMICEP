import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

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
  forecastData: WeatherForecast | null = null;
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
  selectedLocation: string = 'atoyac';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadForecast();
  }

  loadForecast() {
    this.loading = true;
    this.error = null;
    this.http.get<WeatherForecast>(`${this.apiUrl}${this.selectedLocation}`)
      .pipe(
        catchError(error => {
          this.error = 'Error al cargar los datos del pronóstico';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(data => {
        this.forecastData = data;
        this.loading = false;
      });
  }

  onLocationChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLocation = selectElement.value;
    this.loadForecast();
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  getSortedDailyForecasts(): DailyForecast[] {
    if (!this.forecastData?.daily) return [];
    return Object.values(this.forecastData.daily).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  getDayName(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { weekday: 'long' });
  }
}