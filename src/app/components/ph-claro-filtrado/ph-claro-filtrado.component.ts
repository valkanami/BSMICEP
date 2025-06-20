import { Component, OnInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
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
  [key: string]: any;
}

@Component({
  selector: 'app-ph-claro-filtrado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ph-claro-filtrado.component.html',
  styleUrls: ['./ph-claro-filtrado.component.css']
})
export class PhClaroFiltradoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedDate: string = '';
  public availableDates: string[] = [];
  public limitValueClaro: number = 7.0;
  public limitValueFiltrado: number = 6.8;
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
    
    
    const claroRequest = this.http.get('http://localhost:3000/api/limites/7').toPromise();
    
    
    const filtradoRequest = this.http.get('http://localhost:3000/api/limites/8').toPromise();

    Promise.all([claroRequest, filtradoRequest])
      .then(([claroResponse, filtradoResponse]: [any, any]) => {
        if (claroResponse && claroResponse.LIMITE !== undefined) {
          this.limitValueClaro = claroResponse.LIMITE;
        }
        if (filtradoResponse && filtradoResponse.LIMITE !== undefined) {
          this.limitValueFiltrado = filtradoResponse.LIMITE;
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
    this.http.get('http://localhost:3000/api/ph').subscribe({
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
      if (item.HORA) {  
        horaOriginal = this.formatTimeToHHMM(item.HORA);  
      }

      return {
        ...item,
        HORA_ORIGINAL: horaOriginal || '00:00',
        CLARO: item.CLARO || null,
        JUSTIFICACION_CLARO: item.JUSTIFICACION_CLARO || '',
        FILTRADO: item.FILTRADO || null,
        JUSTIFICACION_FILTRADO: item.JUSTIFICACION_FILTRADO || ''
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
      const claroData = this.mapDataToFixedHours('CLARO');
      const filtradoData = this.mapDataToFixedHours('FILTRADO');

      const limitLineClaro: LimitLineAnnotation = {
        type: 'line',
        yMin: this.limitValueClaro,
        yMax: this.limitValueClaro,
        borderColor: 'rgb(255, 0, 0)',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
          content: `Límite Claro: ${this.limitValueClaro}`,
          enabled: true,
          position: 'end',
          backgroundColor: 'rgba(255,255,255,0.8)'
        }
      };

      const limitLineFiltrado: LimitLineAnnotation = {
        type: 'line',
        yMin: this.limitValueFiltrado,
        yMax: this.limitValueFiltrado,
        borderColor: 'rgb(255, 165, 0)',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
          content: `Límite Filtrado: ${this.limitValueFiltrado}`,
          enabled: true,
          position: 'end',
          backgroundColor: 'rgba(255,255,255,0.8)'
        }
      };

      const componentLimitValueClaro = this.limitValueClaro;
      const componentLimitValueFiltrado = this.limitValueFiltrado;

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'PH Claro',
              data: claroData,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'PH Filtrado',
              data: filtradoData,
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
                text: 'Valor de PH'
              },
              min: 5.0,
              max: 9.0
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
                  
                  const justificacion = context.datasetIndex === 0 
                    ? dataItem.JUSTIFICACION_CLARO || 'No hay justificación registrada'
                    : dataItem.JUSTIFICACION_FILTRADO || 'No hay justificación registrada';
                  
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
                limitLineClaro: limitLineClaro,
                limitLineFiltrado: limitLineFiltrado
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
            
            // Dibujar línea para PH Claro
            const yPixelClaro = Math.floor(scales['y'].getPixelForValue(componentLimitValueClaro));
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(255, 0, 0)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.moveTo(Math.floor(chartArea.left), yPixelClaro);
            ctx.lineTo(Math.floor(chartArea.right), yPixelClaro);
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillRect(
              Math.floor(chartArea.right - 120), 
              Math.floor(yPixelClaro - 15), 
              120, 
              20
            );
            
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.textAlign = 'right';
            ctx.fillText(`Claro: ${componentLimitValueClaro}`, Math.floor(chartArea.right - 10), yPixelClaro);
            
            // Dibujar línea para PH Filtrado
            const yPixelFiltrado = Math.floor(scales['y'].getPixelForValue(componentLimitValueFiltrado));
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(255, 165, 0)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.moveTo(Math.floor(chartArea.left), yPixelFiltrado);
            ctx.lineTo(Math.floor(chartArea.right), yPixelFiltrado);
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillRect(
              Math.floor(chartArea.right - 120), 
              Math.floor(yPixelFiltrado - 15), 
              120, 
              20
            );
            
            ctx.fillStyle = 'rgb(255, 165, 0)';
            ctx.textAlign = 'right';
            ctx.fillText(`Filtrado: ${componentLimitValueFiltrado}`, Math.floor(chartArea.right - 10), yPixelFiltrado);
            
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
  
    this.chart.data.datasets[0].data = this.mapDataToFixedHours('CLARO');
    this.chart.data.datasets[1].data = this.mapDataToFixedHours('FILTRADO');
  
    const annotations = this.chart.options?.plugins?.annotation?.annotations as ChartAnnotations | undefined;
    if (annotations?.['limitLineClaro']) {
      annotations['limitLineClaro'].yMin = this.limitValueClaro;
      annotations['limitLineClaro'].yMax = this.limitValueClaro;
      
      if (annotations['limitLineClaro'].label) {
        annotations['limitLineClaro'].label.content = `Límite Claro: ${this.limitValueClaro}`;
      }
    }
    
    if (annotations?.['limitLineFiltrado']) {
      annotations['limitLineFiltrado'].yMin = this.limitValueFiltrado;
      annotations['limitLineFiltrado'].yMax = this.limitValueFiltrado;
      
      if (annotations['limitLineFiltrado'].label) {
        annotations['limitLineFiltrado'].label.content = `Límite Filtrado: ${this.limitValueFiltrado}`;
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