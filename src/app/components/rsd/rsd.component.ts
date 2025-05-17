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
  ['limitLine1']?: LimitLineAnnotation;
  ['limitLine2']?: LimitLineAnnotation;
  ['limitLine3']?: LimitLineAnnotation;
  [key: string]: any;
}

@Component({
  selector: 'app-rsd',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rsd.component.html',
  styleUrls: ['./rsd.component.css']
})
export class RsdComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedDate: string = '';
  public availableDates: string[] = [];
  public limitValue1: number = 0.07;
  public limitValue2: number = 0.13;
  public limitValue3: number = 0.15;
  private fixedTimeLabels: string[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      Chart.register(...registerables);
    }
    this.generateFixedTimeLabels();
  }

  private generateFixedTimeLabels(): void {
    this.fixedTimeLabels = [];
    // Generar horas de 6 AM a 10 PM (22:00)
    for (let hour = 6; hour <= 22; hour += 2) {
      this.fixedTimeLabels.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    // Agregar 12 AM (medianoche) y 2 AM, 4 AM
    this.fixedTimeLabels.push('24:00', '02:00', '04:00');
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

  private formatTimeToHHMM(timeString: string): string {
    if (!timeString) return '00:00';
    const parts = timeString.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }

  checkApiConnection(): void {
    this.http.get('http://localhost:3000/api/rsd').subscribe({
      next: (response) => {
        this.apiConnectionStatus = ' ';
        this.originalData = this.preserveOriginalTimes(response as any[]);
        this.extractAvailableDates();
        if (this.availableDates.length > 0) {
          this.selectedDate = this.availableDates[this.availableDates.length - 1];
          this.filterDataByDate();
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
    this.availableDates = Array.from(uniqueDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
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
      return itemDate.toISOString().split('T')[0] === this.selectedDate;
    });

    if (this.chart) {
      this.updateChartData();
    } else if (this.isBrowser) {
      this.initChart();
    }
  }

  private preserveOriginalTimes(rawData: any[]): any[] {
    return rawData.map(item => ({
      ...item,
      HORA_ORIGINAL: this.formatTimeToHHMM(item.TURNO) || '00:00',
      RDS_FUNDIDO: item.RDS_FUNDIDO || null,
      RDS_CLARIF: item.RDS_CLARIF || null,
      RDS_PULIDO: item.RDS_PULIDO || null,
      JUSTIFICACION_FUNDIDO: item.JUSTIFICACION_FUNDIDO || '',
      JUSTIFICACION_CLARIF: item.JUSTIFICACION_CLARIF || '',
      JUSTIFICACION_PULIDO: item.JUSTIFICACION_PULIDO || ''
    }));
  }

  private initChart(): void {
    if (!this.isBrowser || !this.chartCanvas?.nativeElement) return;
    this.destroyChart();

    try {
      const canvas = this.chartCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No se pudo obtener el contexto del canvas');

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      // Usamos las etiquetas de tiempo fijas
      const labels = this.fixedTimeLabels;
      
      // Creamos datasets vacíos inicialmente
      const initialData = Array(labels.length).fill(null);
      
      // Mapeamos los datos reales a las etiquetas fijas
      const fundidoData = this.mapDataToFixedTimes('RDS_FUNDIDO');
      const clarifData = this.mapDataToFixedTimes('RDS_CLARIF');
      const pulidoData = this.mapDataToFixedTimes('RDS_PULIDO');

      const datasets = [
        {
          label: 'RDS Fundido',
          data: fundidoData,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'RDS Clarif',
          data: clarifData,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'RDS Pulido',
          data: pulidoData,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ];

      const limitLine1: LimitLineAnnotation = {
        type: 'line',
        yMin: this.limitValue1,
        yMax: this.limitValue1,
        borderColor: 'rgb(255, 0, 0)',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
          content: `Límite 1: ${this.limitValue1}`,
          enabled: true,
          position: 'end',
          backgroundColor: 'rgba(255,255,255,0.8)'
        }
      };

      const limitLine2: LimitLineAnnotation = {
        type: 'line',
        yMin: this.limitValue2,
        yMax: this.limitValue2,
        borderColor: 'rgb(0, 128, 0)',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
          content: `Límite 2: ${this.limitValue2}`,
          enabled: true,
          position: 'end',
          backgroundColor: 'rgba(255,255,255,0.8)'
        }
      };

      const limitLine3: LimitLineAnnotation = {
        type: 'line',
        yMin: this.limitValue3,
        yMax: this.limitValue3,
        borderColor: 'rgb(255, 165, 0)',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
          content: `Límite 3: ${this.limitValue3}`,
          enabled: true,
          position: 'end',
          backgroundColor: 'rgba(255,255,255,0.8)'
        }
      };

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              title: { display: true, text: 'Valor RSD' },
              grid: { display: true }
            },
            x: {
              title: { display: true, text: 'Hora del turno' },
              grid: { display: false },
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
                label: (context) => `${context.dataset.label}: ${context.parsed.y?.toFixed(4) || 'N/D'}`,
                afterLabel: (context) => {
                  const dataIndex = context.dataIndex;
                  const datasetIndex = context.datasetIndex;
                  const horaLabel = labels[dataIndex];
                  
                  // Buscar el dato correspondiente a esta hora
                  const dataItem = this.filteredData.find(item => 
                    item.HORA_ORIGINAL === horaLabel
                  );
                  
                  if (!dataItem) return 'No hay datos para esta hora';
                  
                  let justificacion = '';
                  
                  if (datasetIndex === 0) {
                    justificacion = dataItem.JUSTIFICACION_FUNDIDO || 'No hay justificación registrada';
                  } else if (datasetIndex === 1) {
                    justificacion = dataItem.JUSTIFICACION_CLARIF || 'No hay justificación registrada';
                  } else if (datasetIndex === 2) {
                    justificacion = dataItem.JUSTIFICACION_PULIDO || 'No hay justificación registrada';
                  }
                  
                  return [
                    `─────────────────────`,
                    `Hora: ${horaLabel}`,
                    `Justificación:`,
                    `${justificacion}`
                  ];
                }
              },
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 12 },
              padding: 12,
              bodySpacing: 4,
              displayColors: false
            },
            legend: { 
              position: 'top',
              labels: {
                boxWidth: 20,
                padding: 15,
                font: {
                  size: 12
                }
              }
            },
            annotation: {
              annotations: {
                ['limitLine1']: limitLine1,
                ['limitLine2']: limitLine2,
                ['limitLine3']: limitLine3
              }
            }
          }
        },
        plugins: [{
          id: 'limitLines',
          beforeDraw: (chart: any) => {
            const {ctx, chartArea, scales} = chart;
            
            if (!ctx || !chartArea || !scales?.['y']) return;
            
            ctx.save();
            ctx.translate(0.5, 0.5);
            
            const drawLimitLine = (value: number, color: string, label: string) => {
              const yScale = scales['y'] as Scale;
              const yPixel = Math.floor(yScale.getPixelForValue(value));
              
              ctx.beginPath();
              ctx.strokeStyle = color;
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
              
              ctx.fillStyle = color;
              ctx.textAlign = 'right';
              ctx.fillText(` ${value.toFixed(4)}`, Math.floor(chartArea.right - 10), yPixel);
            };
            
            drawLimitLine(this.limitValue1, 'rgb(255, 0, 0)', `Límite 1: ${this.limitValue1}`);
            drawLimitLine(this.limitValue2, 'rgb(0, 128, 0)', `Límite 2: ${this.limitValue2}`);
            drawLimitLine(this.limitValue3, 'rgb(255, 165, 0)', `Límite 3: ${this.limitValue3}`);
            
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

  private mapDataToFixedTimes(field: string): (number | null)[] {
    const result = Array(this.fixedTimeLabels.length).fill(null);
    
    this.filteredData.forEach(item => {
      const hora = item.HORA_ORIGINAL;
      const index = this.fixedTimeLabels.indexOf(hora);
      if (index !== -1) {
        result[index] = item[field];
      }
    });
    
    return result;
  }

  public updateChartData(): void {
    if (!this.chart) return;
  
    // Actualizar los datos mapeados a las horas fijas
    this.chart.data.datasets[0].data = this.mapDataToFixedTimes('RDS_FUNDIDO');
    this.chart.data.datasets[1].data = this.mapDataToFixedTimes('RDS_CLARIF');
    this.chart.data.datasets[2].data = this.mapDataToFixedTimes('RDS_PULIDO');

    const annotations = this.chart.options?.plugins?.annotation?.annotations as ChartAnnotations | undefined;
    if (annotations?.['limitLine1']) {
      annotations['limitLine1'].yMin = this.limitValue1;
      annotations['limitLine1'].yMax = this.limitValue1;
      if (annotations['limitLine1'].label) {
        annotations['limitLine1'].label.content = `Límite 1: ${this.limitValue1.toFixed(4)}`;
      }
    }
    if (annotations?.['limitLine2']) {
      annotations['limitLine2'].yMin = this.limitValue2;
      annotations['limitLine2'].yMax = this.limitValue2;
      if (annotations['limitLine2'].label) {
        annotations['limitLine2'].label.content = `Límite 2: ${this.limitValue2.toFixed(4)}`;
      }
    }
    if (annotations?.['limitLine3']) {
      annotations['limitLine3'].yMin = this.limitValue3;
      annotations['limitLine3'].yMax = this.limitValue3;
      if (annotations['limitLine3'].label) {
        annotations['limitLine3'].label.content = `Límite 3: ${this.limitValue3.toFixed(4)}`;
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