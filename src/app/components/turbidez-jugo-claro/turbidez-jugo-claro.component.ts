import { Component, OnInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables, Scale } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LimitLineAnnotation {
  type: 'line';
  yMin: number;
  yMax: number;
  borderColor: string;
  borderWidth: number;
  borderDash: number[];
  label?: {
    content: string;
    enabled: boolean;
    position: 'start' | 'center' | 'end';
    backgroundColor: string;
  };
}

interface ChartAnnotations {
  ['limitLine']?: LimitLineAnnotation;
  [key: string]: any;
}

@Component({
  selector: 'app-turbidez-jugo-claro-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turbidez-jugo-claro.component.html',
  styleUrls: ['./turbidez-jugo-claro.component.css']
})
export class TurbidezJugoClaroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedDate: string = '';
  public availableDates: string[] = [];
  public limitValue: number = 8;

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
    this.http.get('http://localhost:3000/api/turbidezjugoclaro').subscribe({
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
    // Sort dates in ascending order (oldest to newest)
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
      let horaOriginal = '';
      if (item.TURNO) {
        horaOriginal = this.formatTimeToHHMM(item.TURNO);
      }

      return {
        ...item,
        HORA_ORIGINAL: horaOriginal || '00:00',
        TURBIDEZ_CLARO: item.TURBIDEZ_CLARO || null,
        TURBIDEZ_CLARIFICADOR_2: item.TURBIDEZ_CLARIFICADOR_2 || null,
        TURBIDEZ_CLARIFICADOR_3: item.TURBIDEZ_CLARIFICADOR_3 || null
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

      const labels = this.filteredData.map(item => item.HORA_ORIGINAL);
      const turbidezClaroData = this.filteredData.map(item => item.TURBIDEZ_CLARO);
      const clarificador2Data = this.filteredData.map(item => item.TURBIDEZ_CLARIFICADOR_2);
      const clarificador3Data = this.filteredData.map(item => item.TURBIDEZ_CLARIFICADOR_3);

      const limitLine: LimitLineAnnotation = {
        type: 'line',
        yMin: this.limitValue,
        yMax: this.limitValue,
        borderColor: 'rgb(255, 0, 0)',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
          content: `Límite: ${this.limitValue}`,
          enabled: true,
          position: 'end',
          backgroundColor: 'rgba(255,255,255,0.8)'
        }
      };

      const componentLimitValue = this.limitValue;

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              type: 'line',
              label: 'Turbidez Jugo Claro',
              data: turbidezClaroData,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderWidth: 2,
              tension: 0.1,
              yAxisID: 'y'
            },
            {
              type: 'bar',
              label: 'Clarificador 2',
              data: clarificador2Data,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              type: 'bar',
              label: 'Clarificador 3',
              data: clarificador3Data,
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
              title: {
                display: true,
                text: 'Nivel de turbidez'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Hora del turno'
              },
              ticks: {
                autoSkip: false,
                callback: (value: any, index: number, values: any) => {
                  return labels[index];
                }
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
                  const turno = this.filteredData[context.dataIndex].TURNO;
                  return `Hora: ${this.formatTimeToHHMM(turno)}`;
                }
              }
            },
            legend: {
              position: 'top'
            },
            annotation: {
              annotations: {
                ['limitLine']: limitLine
              }
            }
          }
        },
        plugins: [{
          id: 'limitLine',
          beforeDraw: (chart: any) => {
            const {ctx, chartArea, scales} = chart;
            
            if (!ctx || !chartArea || !scales?.['y']) return;
            
            ctx.save();
            
            ctx.translate(0.5, 0.5);
            
            const annotations = chart.options?.plugins?.annotation?.annotations as ChartAnnotations | undefined;
            const limitValue = Number(annotations?.['limitLine']?.yMin ?? componentLimitValue);
          
            const yScale = scales['y'] as Scale;
            const yPixel = Math.floor(yScale.getPixelForValue(limitValue));
            
            
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(255, 0, 0)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.moveTo(Math.floor(chartArea.left), yPixel);
            ctx.lineTo(Math.floor(chartArea.right), yPixel);
            ctx.stroke();
            
            
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillRect(
              Math.floor(chartArea.right - 100), 
              Math.floor(yPixel - 15), 
              100, 
              20
            );
            
            
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.textAlign = 'right';
            ctx.fillText(` ${limitValue}`, Math.floor(chartArea.right - 10), yPixel);
            
            ctx.restore();
          }
        }]
      });

    } catch (error) {
      console.error('Error al crear el gráfico:', error);
      this.apiConnectionStatus = 'Error al renderizar el gráfico';
      this.errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    }
  }

  public updateChartData(): void {
    if (!this.chart) return;
  
    const labels = this.filteredData.map(item => item.HORA_ORIGINAL);
    this.chart.data.labels = labels;
    
    this.chart.data.datasets[0].data = this.filteredData.map(item => item.TURBIDEZ_CLARO);
    this.chart.data.datasets[1].data = this.filteredData.map(item => item.TURBIDEZ_CLARIFICADOR_2);
    this.chart.data.datasets[2].data = this.filteredData.map(item => item.TURBIDEZ_CLARIFICADOR_3);
  
    const annotations = this.chart.options?.plugins?.annotation?.annotations as ChartAnnotations | undefined;
    if (annotations?.['limitLine']) {
      annotations['limitLine'].yMin = this.limitValue;
      annotations['limitLine'].yMax = this.limitValue;
      
      if (annotations['limitLine'].label) {
        annotations['limitLine'].label.content = `Límite: ${this.limitValue}`;
      }
    }
  
    this.chart.update();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  refreshData(): void {
    this.apiConnectionStatus = 'Verificando conexión...';
    this.errorMessage = '';
    this.checkApiConnection();
  }
}