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

interface Limit {
  id: number;
  name: string;
  value: number | null;
  color: string;
  axis: string;
  unit: string;
}

@Component({
  selector: 'app-eficiencia-fabrica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eficiencia-fabrica.component.html',
  styleUrls: ['./eficiencia-fabrica.component.css']
})
export class EficienciaFabricaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedWeek: string = '';
  public availableWeeks: string[] = [];
  public dataTypes: string[] = [];
  public limits: Limit[] = [
    { id: 20, name: 'limite', value: null, color: 'rgb(255, 0, 0)', axis: 'y', unit: '' },
  ];
  public dataLoaded: boolean = false;
  public limitsLoaded: boolean = false;
  public weekDays: string[] = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  private colorPalette = [
    'rgba(255, 99, 132, 0.7)', 
    'rgba(54, 162, 235, 0.7)',     
    'rgba(75, 192, 192, 0.7)',
    'rgb(86, 255, 213)',     
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
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
    
    const limitRequests = this.limits.map(limit => 
      this.http.get(`http://localhost:3000/api/limites/${limit.id}`).toPromise()
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
    this.http.get('http://localhost:3000/api/datossql').subscribe({
      next: (response) => {
        this.apiConnectionStatus = ' ';
        this.originalData = this.preserveOriginalTimes(response as any[]);
        this.extractAvailableWeeks();
        this.extractDataTypes();
        if (this.availableWeeks.length > 0) {
          this.selectedWeek = this.availableWeeks[this.availableWeeks.length - 1];
          this.filterDataByWeek();
        }
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

  private extractAvailableWeeks(): void {
    const weekMap = new Map<string, {start: Date, end: Date}>();
    
    this.originalData.forEach(item => {
      if (item.fecha) {
        const date = new Date(item.fecha);
        if (!isNaN(date.getTime())) {
          // Obtener el domingo de la semana
          const sunday = new Date(date);
          sunday.setDate(date.getDate() - date.getDay());
          sunday.setHours(0, 0, 0, 0);
          
          // Obtener el sábado de la semana
          const saturday = new Date(sunday);
          saturday.setDate(sunday.getDate() + 6);
          saturday.setHours(23, 59, 59, 999);
          
          const weekKey = `${sunday.toISOString().split('T')[0]} a ${saturday.toISOString().split('T')[0]}`;
          
          if (!weekMap.has(weekKey)) {
            weekMap.set(weekKey, {start: sunday, end: saturday});
          }
        }
      }
    });
    
    // Ordenar las semanas cronológicamente
    this.availableWeeks = Array.from(weekMap.keys()).sort((a, b) => {
      const dateA = weekMap.get(a)?.start || new Date(0);
      const dateB = weekMap.get(b)?.start || new Date(0);
      return dateA.getTime() - dateB.getTime();
    });
  }

  private extractDataTypes(): void {
    const uniqueTypes = new Set<string>();
    this.originalData.forEach(item => {
      if (item.dato && item.apartado === 'Eficiencia Fabrica') {
        uniqueTypes.add(item.dato);
      }
    });
    this.dataTypes = Array.from(uniqueTypes);
  }

  filterDataByWeek(): void {
    if (!this.selectedWeek) {
      this.filteredData = [...this.originalData];
      return;
    }

    // Extraer las fechas de inicio y fin de la semana seleccionada
    const [startDateStr, endDateStr] = this.selectedWeek.split(' a ');
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Ajustar la hora de endDate para incluir todo el día
    endDate.setHours(23, 59, 59, 999);

    this.filteredData = this.originalData.filter(item => {
      if (!item.fecha) return false;
      const itemDate = new Date(item.fecha);
      if (isNaN(itemDate.getTime())) return false;
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Ordenar por fecha y hora
    this.filteredData.sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      return this.timeToMinutes(a.HORA_ORIGINAL) - this.timeToMinutes(b.HORA_ORIGINAL);
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
    return rawData
      .filter(item => item.apartado === 'Eficiencia Fabrica')
      .map(item => {
        let horaOriginal = '';
        if (item.hora) {
          horaOriginal = this.formatTimeToHHMM(item.hora);
        }

        return {
          ...item,
          HORA_ORIGINAL: horaOriginal || '00:00',
          valor: item.valor !== null ? Number(item.valor) : null,
          justificacion: item.justificacion || ''
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

      const labels = this.weekDays;
      
      const datasets = this.dataTypes.map((type, index) => {
        const color = this.colorPalette[index % this.colorPalette.length];
        return {
          label: type,
          data: this.mapDataToWeekDays(type),
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
          labels: labels,
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
                text: 'Molienda'
              },
              min: 0
            },
            x: {
              title: {
                display: true,
                text: 'Días de la semana'
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
                  const day = labels[context.dataIndex];
                  const dataItem = this.findDataItemByDay(day, context.dataset.label);
                  
                  if (!dataItem) return 'No hay datos para este día';
                  
                  const justificacion = dataItem.justificacion || 'No hay justificación registrada';
                  
                  return [
                    `─────────────────────`,
                    `Día: ${day}`,
                    `Hora: ${dataItem.HORA_ORIGINAL}`,
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

    } catch (error) {
      console.error('Error al crear el gráfico:', error);
      this.apiConnectionStatus = 'Error al renderizar el gráfico';
      this.errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    }
  }

  private mapDataToWeekDays(dataType: string): (number | null)[] {
    return this.weekDays.map((day, index) => {
      const dataItems = this.findDataItemsByDayIndex(index, dataType);
      if (dataItems.length === 0) return null;
      
      // Calcular promedio para el día
      const sum = dataItems.reduce((acc, item) => acc + (item.valor || 0), 0);
      return sum / dataItems.length;
    });
  }

  private findDataItemsByDayIndex(dayIndex: number, dataType?: string): any[] {
    const [startDateStr, endDateStr] = this.selectedWeek.split(' a ');
    const startDate = new Date(startDateStr);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayIndex);
    
    return this.filteredData.filter(item => {
      if (!item.fecha) return false;
      const itemDate = new Date(item.fecha);
      if (isNaN(itemDate.getTime())) return false;
      
      // Comparar solo día, mes y año
      return itemDate.getDate() === targetDate.getDate() &&
             itemDate.getMonth() === targetDate.getMonth() &&
             itemDate.getFullYear() === targetDate.getFullYear() &&
             (!dataType || item.dato === dataType);
    });
  }

  private findDataItemByDay(day: string, dataType?: string): any | null {
    const dayIndex = this.weekDays.indexOf(day);
    if (dayIndex === -1) return null;
    
    const items = this.findDataItemsByDayIndex(dayIndex, dataType);
    return items.length > 0 ? items[0] : null;
  }

  public updateChartData(): void {
    if (!this.chart) return;
  
    this.chart.data.datasets = this.dataTypes.map((type, index) => {
      const color = this.colorPalette[index % this.colorPalette.length];
      return {
        label: type,
        data: this.mapDataToWeekDays(type),
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

    if (this.chart.options?.plugins?.annotation) {
      this.chart.options.plugins.annotation.annotations = annotations;
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