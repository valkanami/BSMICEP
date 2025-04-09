import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface PolEnCanaData {
  id: number;
  domingo: number;
  lunes: number;
  martes: number;
  miercoles: number;
  jueves: number;
  viernes: number;
  sabado: number;
  justificacionDomingo: string;
  justificacionLunes: string;
  justificacionMartes: string;
  justificacionMiercoles: string;
  justificacionJueves: string;
  justificacionViernes: string;
  justificacionSabado: string;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,    // <-- Añade esto
    MatButtonModule   // <-- Añade esto si usas mat-button
  ],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  
})
export class BarChartComponent implements OnInit, OnDestroy {
  private chart: any;
  public isBrowser: boolean = false;
  public isLoading: boolean = true;
  public chartData: PolEnCanaData[] = [];
  public chartLabels: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  public errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      Chart.register(...registerables);
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadData();
    } else {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.http.get<PolEnCanaData[]>('http://localhost:3000/api/polencana/1').subscribe({
      next: (data: PolEnCanaData[]) => {
        this.chartData = data;
        this.updateChart();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.errorMessage = 'Error al cargar los datos. Por favor, intente nuevamente más tarde.';
        this.isLoading = false;
      }
    });
  }

  private updateChart(): void {
    if (this.chartData.length === 0) {
      this.errorMessage = 'No hay datos disponibles para mostrar.';
      return;
    }

    this.destroyChart();

    const latestData = this.chartData[this.chartData.length - 1];
    const dataValues = this.getDayValues(latestData);
    const ctx = document.getElementById('polChart') as HTMLCanvasElement;

    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: 'Pol en Caña',
          data: dataValues,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valor'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Días de la semana'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel: (context) => {
                const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
                const dayIndex = context.dataIndex;
                return `Justificación: ${this.getJustificationForDay(days[dayIndex])}`;
              }
            }
          },
          legend: {
            position: 'top',
          }
        }
      }
    });
  }

  private getDayValues(data: PolEnCanaData): number[] {
    return [
      data.domingo,
      data.lunes,
      data.martes,
      data.miercoles,
      data.jueves,
      data.viernes,
      data.sabado
    ];
  }

  getJustificationForDay(day: string): string {
    if (this.chartData.length === 0) return '';
    
    const latestData = this.chartData[this.chartData.length - 1];
    
    switch(day.toLowerCase()) {
      case 'domingo': return latestData.justificacionDomingo;
      case 'lunes': return latestData.justificacionLunes;
      case 'martes': return latestData.justificacionMartes;
      case 'miércoles': return latestData.justificacionMiercoles;
      case 'jueves': return latestData.justificacionJueves;
      case 'viernes': return latestData.justificacionViernes;
      case 'sábado': return latestData.justificacionSabado;
      default: return '';
    }
  }

  getDayValue(index: number): number {
    if (this.chartData.length === 0) return 0;
    const values = this.getDayValues(this.chartData[this.chartData.length - 1]);
    return values[index] || 0;
  }
}