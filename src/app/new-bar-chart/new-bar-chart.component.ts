// new-bar-chart.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { catchError, of } from 'rxjs';

interface CanaMolidaData {
  id: number;
  Dia: string;
  Programa: number;
  Real: number;
}

@Component({
  selector: 'app-new-bar-chart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  templateUrl: './new-bar-chart.component.html',
  styleUrls: ['./new-bar-chart.component.css']
})
export class NewBarChartComponent implements OnInit {
  private http = inject(HttpClient);

  apiUrl = 'http://localhost:3000/api/canamolida';
  loading = true;
  error: string | null = null;
  connectionTested = false;
  
  
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Programado',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Real',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Toneladas'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Días'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Caña Molida',
        font: {
          size: 16
        }
      },
      legend: {
        position: 'top' as const 
      }
    }
  };

  
  ngOnInit(): void {
    this.testConnection();
  }

  testConnection(): void {
    this.http.get(`${this.apiUrl}/health`)
      .pipe(
        catchError(() => of(null))
      )
      .subscribe({
        next: () => {
          this.connectionTested = true;
          this.loadData();
        },
        error: () => {
          this.connectionTested = true;
          this.error = 'No se pudo conectar con la API. Mostrando datos de ejemplo.';
          this.loadMockData();
        }
      });
  }

  loadData(): void {
    this.http.get<CanaMolidaData[]>(this.apiUrl)
      .subscribe({
        next: (data) => {
          this.prepareChartData(data);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar datos. Mostrando datos de ejemplo.';
          console.error(err);
          this.loadMockData();
        }
      });
  }

  loadMockData(): void {
    const mockData: CanaMolidaData[] = [
      { id: 1, Dia: 'Lunes', Programa: 1200, Real: 1150 },
      { id: 2, Dia: 'Martes', Programa: 1250, Real: 1300 },
      { id: 3, Dia: 'Miércoles', Programa: 1300, Real: 1250 },
      { id: 4, Dia: 'Jueves', Programa: 1350, Real: 1400 },
      { id: 5, Dia: 'Viernes', Programa: 1400, Real: 1380 },
      { id: 6, Dia: 'Sábado', Programa: 1100, Real: 1050 }
    ];
    this.prepareChartData(mockData);
    this.loading = false;
  }

  prepareChartData(data: CanaMolidaData[]): void {
    data.sort((a, b) => a.id - b.id);

    this.barChartData = {
      labels: data.map(item => item.Dia),
      datasets: [
        {
          ...this.barChartData.datasets[0],
          data: data.map(item => item.Programa)
        },
        {
          ...this.barChartData.datasets[1],
          data: data.map(item => item.Real)
        }
      ]
    };
  }
}