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
  ['limitLineClarificado']?: LimitLineAnnotation;
  ['limitLineMeladura']?: LimitLineAnnotation;
  [key: string]: any;
}

@Component({
  selector: 'app-reductores-claro-meladura',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reductores-claro-meladura.component.html',
  styleUrls: ['./reductores-claro-meladura.component.css']
})
export class ReductoresClaroMeladuraComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedDate: string = '';
  public availableDates: string[] = [];
  public limitValueClarificado: number = 50; 
  public limitValueMeladura: number = 50; 
  public dataLoaded: boolean = false;
  public limitsLoaded: boolean = false;
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
      this.loadInitialData();
    }
  }

  private loadInitialData(): void {
    this.checkApiConnection();
    this.loadLimitValues();
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.dataLoaded && this.limitsLoaded) {
      this.initChartIfReady();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private loadLimitValues(): void {
    this.limitsLoaded = false;
    
    // Load clarificado limit (ID 13)
    const clarificadoRequest = this.http.get('http://localhost:3000/api/limites/13').toPromise();
    
    // Load meladura limit (ID 14)
    const meladuraRequest = this.http.get('http://localhost:3000/api/limites/14').toPromise();

    Promise.all([clarificadoRequest, meladuraRequest])
      .then(([clarificadoResponse, meladuraResponse]: [any, any]) => {
        if (clarificadoResponse && clarificadoResponse.LIMITE !== undefined) {
          this.limitValueClarificado = clarificadoResponse.LIMITE;
        } else {
          console.warn('No se encontró LIMITE para clarificado, usando valor por defecto');
        }
        
        if (meladuraResponse && meladuraResponse.LIMITE !== undefined) {
          this.limitValueMeladura = meladuraResponse.LIMITE;
        } else {
          console.warn('No se encontró LIMITE para meladura, usando valor por defecto');
        }
        
        this.limitsLoaded = true;
        if (this.dataLoaded) {
          this.initChartIfReady();
        }
      })
      .catch((error) => {
        console.error('Error al obtener los valores límite:', error);
        this.limitsLoaded = true;
        if (this.dataLoaded) {
          this.initChartIfReady();
        }
      });
  }

  private initChartIfReady(): void {
    if (this.isBrowser && this.dataLoaded && this.limitsLoaded && this.filteredData.length > 0) {
      this.initChart();
    }
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
    this.dataLoaded = false;
    this.http.get('http://localhost:3000/api/reductores4h').subscribe({
      next: (response) => {
        this.apiConnectionStatus = ' ';
        this.originalData = this.preserveOriginalTimes(response as any[]);
        this.extractAvailableDates();
        if (this.availableDates.length > 0) {
          this.selectedDate = this.availableDates[this.availableDates.length - 1];
          this.filterDataByDate();
        }
        this.dataLoaded = true;
        if (this.limitsLoaded) {
          this.initChartIfReady();
        }
      },
      error: (error) => {
        this.apiConnectionStatus = 'Error al conectar con la API';
        this.errorMessage = error.message;
        console.error('Error:', error);
        this.dataLoaded = true;
        if (this.limitsLoaded) {
          this.initChartIfReady();
        }
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
    } else if (this.isBrowser && this.dataLoaded && this.limitsLoaded) {
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
      if (item.TURNO) {
        horaOriginal = this.formatTimeToHHMM(item.TURNO);
      }

      return {
        ...item,
        HORA_ORIGINAL: horaOriginal || '00:00',
        CLARIFICADO: item.CLARIFICADO || null,
        MELADURA: item.MELADURA || null,
        JUSTIFICACION_CLARIFICADO: item.JUSTIFICACION_CLARIFICADO || '',
        JUSTIFICACION_MELADURA: item.JUSTIFICACION_MELADURA || ''
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
      const clarificadoData = this.mapDataToFixedHours('CLARIFICADO');
      const meladuraData = this.mapDataToFixedHours('MELADURA');

      const limitLineClarificado: LimitLineAnnotation = {
        type: 'line',
        yMin: this.limitValueClarificado,
        yMax: this.limitValueClarificado,
        borderColor: 'rgb(255, 0, 0)',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
          content: `Límite Clarificado: ${this.limitValueClarificado}`,
          enabled: true,
          position: 'end',
          backgroundColor: 'rgba(255,255,255,0.8)'
        }
      };

      const limitLineMeladura: LimitLineAnnotation = {
        type: 'line',
        yMin: this.limitValueMeladura,
        yMax: this.limitValueMeladura,
        borderColor: 'rgb(255, 165, 0)',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
          content: `Límite Meladura: ${this.limitValueMeladura}`,
          enabled: true,
          position: 'end',
          backgroundColor: 'rgba(255,255,255,0.8)'
        }
      };

      const componentLimitValueClarificado = this.limitValueClarificado;
      const componentLimitValueMeladura = this.limitValueMeladura;

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Clarificado',
              data: clarificadoData,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'Meladura',
              data: meladuraData,
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
                text: 'Porcentaje de Reducción'
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
                  return `${label}: ${value}%`;
                },
                afterLabel: (context: any) => {
                  const hour = labels[context.dataIndex];
                  const dataItem = this.findDataItemByHour(hour);
                  
                  if (!dataItem) return 'No hay datos para esta hora';
                  
                  const justificationField = context.dataset.label === 'Clarificado' 
                    ? 'JUSTIFICACION_CLARIFICADO' 
                    : 'JUSTIFICACION_MELADURA';
                  
                  return [
                    `─────────────────────`,
                    `Hora: ${hour}`,
                    `Justificación:`,
                    `${dataItem[justificationField] || 'No hay justificación registrada'}`
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
                ['limitLineClarificado']: limitLineClarificado,
                ['limitLineMeladura']: limitLineMeladura
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
            
            // Draw clarificado limit line
            const yPixelClarificado = Math.floor(scales['y'].getPixelForValue(componentLimitValueClarificado));
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(255, 0, 0)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.moveTo(Math.floor(chartArea.left), yPixelClarificado);
            ctx.lineTo(Math.floor(chartArea.right), yPixelClarificado);
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillRect(
              Math.floor(chartArea.right - 120), 
              Math.floor(yPixelClarificado - 15), 
              120, 
              20
            );
            
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.textAlign = 'right';
            ctx.fillText(`Clarificado: ${componentLimitValueClarificado}`, Math.floor(chartArea.right - 10), yPixelClarificado);
            
            // Draw meladura limit line
            const yPixelMeladura = Math.floor(scales['y'].getPixelForValue(componentLimitValueMeladura));
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(255, 165, 0)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.moveTo(Math.floor(chartArea.left), yPixelMeladura);
            ctx.lineTo(Math.floor(chartArea.right), yPixelMeladura);
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillRect(
              Math.floor(chartArea.right - 120), 
              Math.floor(yPixelMeladura - 15), 
              120, 
              20
            );
            
            ctx.fillStyle = 'rgb(255, 165, 0)';
            ctx.textAlign = 'right';
            ctx.fillText(`Meladura: ${componentLimitValueMeladura}`, Math.floor(chartArea.right - 10), yPixelMeladura);
            
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
      if (!dataItem || dataItem[dataField] === null || dataItem[dataField] === undefined) {
        return null;
      }
      return parseFloat(dataItem[dataField]);
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
  
    this.chart.data.datasets[0].data = this.mapDataToFixedHours('CLARIFICADO');
    this.chart.data.datasets[1].data = this.mapDataToFixedHours('MELADURA');
  
    const annotations = this.chart.options?.plugins?.annotation?.annotations as ChartAnnotations | undefined;
    if (annotations?.['limitLineClarificado']) {
      annotations['limitLineClarificado'].yMin = this.limitValueClarificado;
      annotations['limitLineClarificado'].yMax = this.limitValueClarificado;
      
      if (annotations['limitLineClarificado'].label) {
        annotations['limitLineClarificado'].label.content = `Límite Clarificado: ${this.limitValueClarificado}`;
      }
    }
    
    if (annotations?.['limitLineMeladura']) {
      annotations['limitLineMeladura'].yMin = this.limitValueMeladura;
      annotations['limitLineMeladura'].yMax = this.limitValueMeladura;
      
      if (annotations['limitLineMeladura'].label) {
        annotations['limitLineMeladura'].label.content = `Límite Meladura: ${this.limitValueMeladura}`;
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
    this.dataLoaded = false;
    this.limitsLoaded = false;
    this.loadInitialData();
  }
}