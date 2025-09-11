import { Component, OnInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

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

interface Limit {
  id: number;
  name: string;
  value: number | null;
  color: string;
  axis: string;
  unit: string;
}

@Component({
  selector: 'app-color-icumsa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './color-icumsa.component.html',
  styleUrls: ['./color-icumsa.component.css']
})
export class ColorIcumsaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef<HTMLDivElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public dataTypes: string[] = [];
  public limits: Limit[] = [
        { id: 47, name: '', value: null, color: 'rgba(255, 99, 132, 1)', axis: 'y', unit: '' },
  ];
  public dataLoaded: boolean = false;
  public limitsLoaded: boolean = false;

  private colorPalette = [
    'rgba(255, 99, 132, 0.7)', 
    'rgba(54, 162, 235, 0.7)',     
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',     
    'rgba(255, 159, 64, 1)'
  ];

  constructor(
  private http: HttpClient,
  private apiService: ApiService,
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
    
    setTimeout(() => {
      if (!this.dataLoaded) {
        this.apiConnectionStatus = 'Conexión lenta, intentando recuperar datos...';
      }
    }, 5000);
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
    
    const limitRequests = this.limits.map(limit => 
  this.apiService.getLimiteById(limit.id).toPromise()
);


    Promise.all(limitRequests)
      .then((responses: any[]) => {
        responses.forEach((response, index) => {
          this.limits[index].value = response?.LIMITE ?? null;
        });
        
        this.limitsLoaded = true;
        if (this.dataLoaded) {
          this.initChartIfReady();
        }
      })
      .catch((error) => {
        console.error('Error al obtener los valores límite:', error);
        this.limits.forEach(limit => limit.value = null);
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

  private formatDate(dateString: string | Date): string {
    if (typeof dateString === 'string') {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      // Sumar un día a la fecha
      date.setDate(date.getDate() + 1);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month}`;
    } else if (dateString instanceof Date) {
      // Sumar un día a la fecha
      const newDate = new Date(dateString);
      newDate.setDate(newDate.getDate() + 1);
      const day = newDate.getDate().toString().padStart(2, '0');
      const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month}`;
    }
    return '';
  }

  checkApiConnection(): void {
    this.dataLoaded = false;
    this.apiService.getDatosDia().subscribe({
      next: (response) => {
        this.apiConnectionStatus = ' ';
        this.originalData = this.preserveOriginalTimes(response as any[]);
        this.filteredData = [...this.originalData];
        this.extractDataTypes();
        this.dataLoaded = true;
        if (this.limitsLoaded) {
          this.initChartIfReady();
        }
      },
      error: (error) => {
        this.apiConnectionStatus = 'Error al conectar con la API ';
        this.errorMessage = error.message;
        console.error('Error:', error);
        this.dataLoaded = true;
        if (this.limitsLoaded) {
          this.initChartIfReady();
        }
      }
    });
  }

  private preserveOriginalTimes(rawData: any[]): any[] {
    return rawData
      .filter(item => item.apartado === 'Color icumsa')
      .map(item => {
        let horaOriginal = '';
        if (item.hora) {
          horaOriginal = this.formatTimeToHHMM(item.hora);
        }

        return {
          ...item,
          HORA_ORIGINAL: horaOriginal || '00:00',
          valor: item.valor !== null ? Number(item.valor) : null,
          justificacion: item.justificacion || '',
          fechaDate: new Date(item.fecha),
          formattedDate: this.formatDate(item.fecha)
        };
      })
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
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

  private extractDataTypes(): void {
    const uniqueTypes = new Set<string>();
    this.originalData.forEach(item => {
      if (item.dato && item.apartado === 'Color icumsa') {
        uniqueTypes.add(item.dato);
      }
    });
    this.dataTypes = Array.from(uniqueTypes);
  }

  private initChart(): void {
    if (!this.isBrowser || !this.chartCanvas?.nativeElement || !this.chartContainer?.nativeElement) return;

    this.destroyChart();

    try {
      const canvas = this.chartCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      const container = this.chartContainer.nativeElement;
      
      if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas');
      }
      

      const visibleDataPoints = 10;
      const baseWidthPerPoint = 80; 
      const scrollWidthPerPoint = 30; 
      
      const showScroll = this.filteredData.length > visibleDataPoints;
      const chartWidth = showScroll 
        ? this.filteredData.length * scrollWidthPerPoint 
        : Math.max(this.filteredData.length * baseWidthPerPoint, 800);
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = chartWidth * dpr;
      canvas.height = 400 * dpr;
      canvas.style.width = `${chartWidth}px`;
      canvas.style.height = `400px`;
      ctx.scale(dpr, dpr);

      const uniqueDates = [...new Set(this.filteredData.map(item => item.formattedDate))];
      
      const datasets = this.dataTypes.map((type, index) => {
        const color = this.colorPalette[index % this.colorPalette.length];
        
        const data = uniqueDates.map(date => {
          const itemsForDate = this.filteredData.filter(
            item => item.formattedDate === date && item.dato === type
          );
          
          if (itemsForDate.length === 0) return null;
          
          const sum = itemsForDate.reduce((total, item) => total + (item.valor || 0), 0);
          return sum / itemsForDate.length;
        });

        return {
          label: type,
          data: data,
          borderColor: color,
          backgroundColor: color.replace('1)', '0.2)'),
          borderWidth: 2,
          tension: 0.1,
          yAxisID: 'y'
        };
      });

      const annotations: ChartAnnotations = {};
      
      this.limits.forEach(limit => {
        if (limit.value !== null) {
          annotations[`${limit.name}LimitLine`] = {
            type: 'line',
            yMin: limit.value,
            yMax: limit.value,
            borderColor: limit.color,
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: `Límite ${limit.name}: ${limit.value}${limit.unit}`,
              enabled: true,
              position: 'end',
              backgroundColor: 'rgba(255,255,255,0.8)'
            },
            yAxisID: limit.axis
          };
        }
      });

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: uniqueDates,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: ''
              },
              min: 0
            },
            x: {
              title: {
                display: true,
                text: 'Fechas'
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
                  return `${label}: ${value} lts`;
                },
                afterLabel: (context: any) => {
                  const date = uniqueDates[context.dataIndex];
                  const dataType = context.dataset.label;
                  
                  const dateData = this.filteredData.filter(item => 
                    item.formattedDate === date && item.dato === dataType
                  );
                  
                  if (dateData.length === 0) return 'No hay datos para esta fecha';
                  
                  const justificaciones = new Set<string>();
                  dateData.forEach(item => {
                    if (item.justificacion) {
                      justificaciones.add(item.justificacion);
                    }
                  });
                  
                  const justText = justificaciones.size > 0 
                    ? Array.from(justificaciones).join('\n') 
                    : 'No hay justificación registrada';
                  
                  return [
                    `─────────────────────`,
                    `Fecha: ${date}`,
                    `Justificaciones:`,
                    `${justText}`
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
              annotations: annotations
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
            
            this.limits.forEach(limit => {
              if (limit.value !== null && scales[limit.axis]) {
                const yPixel = Math.floor(scales[limit.axis].getPixelForValue(limit.value));
                
                ctx.beginPath();
                ctx.strokeStyle = limit.color;
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 6]);
                ctx.moveTo(Math.floor(chartArea.left), yPixel);
                ctx.lineTo(Math.floor(chartArea.right), yPixel);
                ctx.stroke();
                
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.fillRect(
                  Math.floor(chartArea.right - 150), 
                  Math.floor(yPixel - 15), 
                  150, 
                  20
                );
                
                ctx.fillStyle = limit.color;
                ctx.textAlign = 'right';
                ctx.fillText(` ${limit.name}: ${limit.value}${limit.unit}`, Math.floor(chartArea.right - 10), yPixel);
              }
            });
            
            ctx.restore();
          }
        }]
      });

      // Desplazar al final del gráfico después de que se renderice
      setTimeout(() => {
        if (container && container.scrollWidth > container.clientWidth) {
          container.scrollLeft = container.scrollWidth - container.clientWidth;
        }
      }, 100);

    } catch (error) {
      console.error('Error al crear el gráfico:', error);
      this.apiConnectionStatus = 'Error al renderizar el gráfico';
      this.errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    }
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  refreshData(): void {
    this.apiConnectionStatus = 'Actualizando datos...';
    this.errorMessage = '';
    this.dataLoaded = false;
    this.limitsLoaded = false;
    this.loadInitialData();
  }
}