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
  selector: 'app-brix-meladura',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brix-meladura.component.html',
  styleUrls: ['./brix-meladura.component.css']
})
export class BrixMeladuraComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedDate: string = '';
  public availableDates: string[] = [];
  public limitValue: number = 60; // Valor por defecto
  public fixedHours: string[] = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00', '23:00', '00:00',
    '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'
  ];

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
      this.loadLimitValue();
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

  private loadLimitValue(): void {
    this.http.get('http://localhost:3000/api/limites/15').subscribe({
      next: (response: any) => {
        if (response && response.LIMITE !== undefined) {
          this.limitValue = response.LIMITE;
          if (this.chart) {
            this.updateChartData();
          }
        }
      },
      error: (error) => {
        console.error('Error al obtener el valor límite:', error);
      }
    });
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
    this.http.get('http://localhost:3000/api/brixmeladura').subscribe({
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
        this.apiConnectionStatus = 'Error al conectar con la API ';
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

    this.filteredData.sort((a, b) => {
      const timeA = this.timeToMinutes(a.HORA_ORIGINAL);
      const timeB = this.timeToMinutes(b.HORA_ORIGINAL);
      return timeA - timeB;
    });

    if (this.chart) {
      this.updateChartData();
    } else if (this.isBrowser) {
      this.initChart();
    }
  }

  private timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private preserveOriginalTimes(rawData: any[]): any[] {
    return rawData.map(item => {
      let horaOriginal = '';
      if (item.HORA) {
        horaOriginal = this.formatTimeToHHMM(item.HORA);
      }

      return {
        ...item,
        HORA_ORIGINAL: horaOriginal || '00:00',
        BRIX_MELADURA: item.BRIX_MELADURA || null,
        JUSTIFICACION: item.JUSTIFICACION || ''
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

      const labels = this.fixedHours;
      const brixMeladuraData = this.mapDataToFixedHours('BRIX_MELADURA');

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
              label: 'Brix Meladura',
              data: brixMeladuraData,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderWidth: 2,
              tension: 0.1,
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
                text: 'Nivel de Brix'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Hora del turno'
              },
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45
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
                  const hour = labels[context.dataIndex];
                  const dataItem = this.findDataItemByHour(hour);
                  
                  if (!dataItem) return 'No hay datos para esta hora';
                  
                  const justificacion = dataItem.JUSTIFICACION || 'No hay justificación registrada';
                  
                  return [
                    `─────────────────────`,
                    `Hora: ${hour}`,
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

  private mapDataToFixedHours(dataField: string): (number | null)[] {
    return this.fixedHours.map(hour => {
      const dataItem = this.findDataItemByHour(hour);
      return dataItem ? dataItem[dataField] : null;
    });
  }

  private findDataItemByHour(hour: string): any | null {
    const targetMinutes = this.timeToMinutes(hour);
    let closestItem = null;
    let smallestDiff = Infinity;

    for (const item of this.filteredData) {
      const itemMinutes = this.timeToMinutes(item.HORA_ORIGINAL);
      const diff = Math.abs(itemMinutes - targetMinutes);
      
      if (diff < 30 && diff < smallestDiff) {
        smallestDiff = diff;
        closestItem = item;
      }
    }

    return closestItem;
  }

  public updateChartData(): void {
    if (!this.chart) return;
  
    this.chart.data.datasets[0].data = this.mapDataToFixedHours('BRIX_MELADURA');
  
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
    this.loadLimitValue();
  }
}