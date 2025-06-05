import { Component, OnInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ph-fcr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ph-fcr.component.html',
  styleUrls: ['./ph-fcr.component.css']
})
export class PhFcrComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedDate: string = '';
  public availableDates: string[] = [];
  public turnos: string[] = Array.from({length: 12}, (_, i) => `Turno ${i+1}`);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      Chart.register(...registerables);
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.checkApiConnection();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.filteredData.length > 0) {
      this.initChart();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private formatTimeToHHMM(timeString: string | Date): string {
    if (typeof timeString === 'string') {
      if (timeString.includes('T')) {
        const timePart = timeString.split('T')[1].split('.')[0];
        const [hours, minutes] = timePart.split(':');
        return `${hours}:${minutes}`;
      } else {
        const parts = timeString.split(':');
        return `${parts[0]}:${parts[1]}`;
      }
    } else if (timeString instanceof Date) {
      const hours = timeString.getHours().toString().padStart(2, '0');
      const minutes = timeString.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '00:00';
  }

  checkApiConnection(): void {
    this.http.get('http://localhost:3000/api/ph2h').subscribe({
      next: (response) => {
        this.apiConnectionStatus = ' ';
        this.originalData = this.preserveOriginalTimes(response as any[]);
        this.extractAvailableDates();
        if (this.availableDates.length > 0) {
          this.selectedDate = this.availableDates[this.availableDates.length - 1];
          this.filterDataByDate();
        }
        if (this.isBrowser) {
          setTimeout(() => this.initChart(), 0);
        }
      },
      error: (error) => {
        this.apiConnectionStatus = 'Error al conectar con la API';
        this.errorMessage = error.message;
        console.error('Error:', error);
      }
    });
  }

  private extractAvailableDates(): void {
    const uniqueDates = new Set<string>();
    this.originalData.forEach(item => {
      if (item.FECHA) {
        const date = new Date(item.FECHA);
        if (!isNaN(date.getTime())) {
          const dateStr = date.toISOString().split('T')[0];
          uniqueDates.add(dateStr);
        }
      }
    });
    this.availableDates = Array.from(uniqueDates).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
  }

  filterDataByDate(): void {
    if (!this.selectedDate) {
      this.filteredData = [...this.originalData];
      return;
    }

    this.filteredData = this.originalData.filter(item => {
      if (!item.FECHA) return false;
      const itemDate = new Date(item.FECHA);
      if (isNaN(itemDate.getTime())) return false;
      const itemDateStr = itemDate.toISOString().split('T')[0];
      return itemDateStr === this.selectedDate;
    });

    if (this.chart) {
      this.updateChartData();
    } else if (this.isBrowser) {
      this.initChart();
    }
  }

  private preserveOriginalTimes(rawData: any[]): any[] {
    return rawData.map(item => {
      return {
        ...item,
        TURNO_ORIGINAL: item.TURNO || '00:00',
        pH_FUNDIDO: item.pH_FUNDIDO || null,
        pH_CLARIF: item.pH_CLARIF || null,
        pH_REFINADO: item.pH_REFINADO || null,
        JUSTIFICACION_FUNDIDO: item.JUSTIFICACION_FUNDIDO || '',
        JUSTIFICACION_CLARIF: item.JUSTIFICACION_CLARIF || '',
        JUSTIFICACION_REFINADO: item.JUSTIFICACION_REFINADO || ''
      };
    });
  }

  private initChart(): void {
    if (!this.isBrowser || !this.chartCanvas?.nativeElement) return;

    this.destroyChart();

    try {
      const canvas = this.chartCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas');
      }
      
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      const labels = this.turnos;
      const fundidoData = this.mapDataToTurnos('pH_FUNDIDO');
      const clarifData = this.mapDataToTurnos('pH_CLARIF');
      const refinadoData = this.mapDataToTurnos('pH_REFINADO');

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'pH Fundido',
              data: fundidoData,
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'pH Clarificado',
              data: clarifData,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'pH Refinado',
              data: refinadoData,
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              yAxisID: 'y'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              min: 0,
              max: 14,
              title: {
                display: true,
                text: 'Valor de pH'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Turnos'
              },
              ticks: {
                autoSkip: false
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y !== null ? context.parsed.y.toFixed(2) : 'N/D';
                  return `${label}: ${value}`;
                },
                afterLabel: (context: any) => {
                  const turnoIndex = context.dataIndex;
                  const dataItem = this.filteredData[turnoIndex];
                  
                  if (!dataItem) return 'No hay datos para este turno';
                  
                  const datasetLabel = context.dataset.label;
                  let justificacion = '';
                  
                  if (datasetLabel === 'pH Fundido') {
                    justificacion = dataItem.JUSTIFICACION_FUNDIDO || 'No hay justificación registrada';
                  } else if (datasetLabel === 'pH Clarificado') {
                    justificacion = dataItem.JUSTIFICACION_CLARIF || 'No hay justificación registrada';
                  } else if (datasetLabel === 'pH Refinado') {
                    justificacion = dataItem.JUSTIFICACION_REFINADO || 'No hay justificación registrada';
                  }
                  
                  return [
                    `─────────────────────`,
                    `Turno: ${labels[turnoIndex]}`,
                    `Justificación:`,
                    `${justificacion}`
                  ];
                }
              },
              displayColors: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 12 },
              padding: 12,
              bodySpacing: 4
            },
            legend: {
              position: 'top'
            }
          }
        }
      });

    } catch (error) {
      console.error('Error al crear el gráfico:', error);
      this.apiConnectionStatus = 'Error al renderizar el gráfico';
      this.errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    }
  }

  private mapDataToTurnos(dataField: string): (number | null)[] {
    return Array.from({length: 12}, (_, i) => {
      if (i < this.filteredData.length) {
        const value = this.filteredData[i][dataField];
        return value !== null && value !== undefined ? parseFloat(value) : null;
      }
      return null;
    });
  }

  public updateChartData(): void {
    if (!this.chart) return;
  
    this.chart.data.datasets[0].data = this.mapDataToTurnos('pH_FUNDIDO');
    this.chart.data.datasets[1].data = this.mapDataToTurnos('pH_CLARIF');
    this.chart.data.datasets[2].data = this.mapDataToTurnos('pH_REFINADO');
  
    this.chart.update();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}