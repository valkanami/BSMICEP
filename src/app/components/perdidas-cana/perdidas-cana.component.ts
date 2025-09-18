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
  selector: 'app-perdidas-cana',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perdidas-cana.component.html',
  styleUrls: ['./perdidas-cana.component.css']
})
export class PerdidasCanaComponent implements OnInit, AfterViewInit, OnDestroy {
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
    { id: 20, name: '', value: null, color: 'rgba(255, 99, 132, 1)', axis: 'y', unit: '' },
  ];
  public dataLoaded: boolean = false;
  public limitsLoaded: boolean = false;
  public daysOfWeek: string[] = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  private colorPalette = [
    'rgba(255, 99, 132, 0.7)', 
    'rgba(54, 162, 235, 0.7)',     
    'rgba(74, 85, 226, 0.7)',
    'hsl(118, 48.50%, 53.50%)',     
    'rgb(19, 193, 199)',
    'rgba(255, 159, 64, 1)'
  ];

  private weekDateRanges = new Map<string, {start: Date, end: Date}>();

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

  private getDayOfWeek(dateString: string): number {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', dateString);
        return 0;
      }
      
      date.setDate(date.getDate() + 1);
      return date.getDay(); 
    } catch (error) {
      console.error('Error al procesar fecha:', dateString, error);
      return 0;
    }
  }

  checkApiConnection(): void {
    this.dataLoaded = false;
    this.apiService.getDatosSql().subscribe({
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

  private preserveOriginalTimes(rawData: any[]): any[] {
    return rawData
      .filter(item => item.apartado === 'Pérdidas % caña')
      .map(item => {
        let horaOriginal = '';
        if (item.hora) {
          horaOriginal = this.formatTimeToHHMM(item.hora);
        }

        let dayOfWeek = 0;
        try {
          dayOfWeek = this.getDayOfWeek(item.fecha);
        } catch (error) {
          console.error('Error al procesar fecha:', item.fecha, error);
        }

        return {
          ...item,
          HORA_ORIGINAL: horaOriginal || '00:00',
          valor: item.valor !== null ? Number(item.valor) : null,
          justificacion: item.justificacion || '',
          dayOfWeek: dayOfWeek,
          fechaDate: new Date(item.fecha)
        };
      });
  }

  private extractAvailableWeeks(): void {
    const weeksMap = new Map<string, {start: Date, end: Date}>();
    
    this.originalData.forEach(item => {
      if (item.fechaDate && !isNaN(item.fechaDate.getTime())) {
        const date = new Date(item.fechaDate);
        
        date.setDate(date.getDate() + 1);
        
        const sunday = new Date(date);
        sunday.setDate(date.getDate() - date.getDay());
        sunday.setHours(0, 0, 0, 0);
        
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        saturday.setHours(23, 59, 59, 999);
        
        const weekKey = sunday.toISOString().split('T')[0];
        
        if (!weeksMap.has(weekKey)) {
          weeksMap.set(weekKey, {
            start: sunday,
            end: saturday
          });
        }
      }
    });
    
    const sortedWeeks = Array.from(weeksMap.entries())
      .sort((a, b) => a[1].start.getTime() - b[1].start.getTime());
    
    this.availableWeeks = sortedWeeks.map(([_, range]) => {
      return this.formatDateRange(range.start, range.end);
    });
    
    this.weekDateRanges = new Map();
    sortedWeeks.forEach(([weekKey, range], index) => {
      this.weekDateRanges.set(this.availableWeeks[index], range);
    });
  }

  private formatDateRange(start: Date, end: Date): string {
    const format = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month}/${date.getFullYear()}`;
    };
    
    return `${format(start)} - ${format(end)}`;
  }

  private extractDataTypes(): void {
    const uniqueTypes = new Set<string>();
    this.originalData.forEach(item => {
      if (item.dato && item.apartado === 'Pérdidas % caña') {
        uniqueTypes.add(item.dato);
      }
    });
    this.dataTypes = Array.from(uniqueTypes);
  }

  filterDataByWeek(): void {
    if (!this.selectedWeek || !this.weekDateRanges.has(this.selectedWeek)) {
      this.filteredData = [];
      return;
    }

    const weekRange = this.weekDateRanges.get(this.selectedWeek);
    if (!weekRange) return;

    this.filteredData = this.originalData.filter(item => {
      if (!item.fechaDate) return false;
      
      const adjustedDate = new Date(item.fechaDate);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      
      return adjustedDate >= weekRange.start && adjustedDate <= weekRange.end;
    });

    if (this.chart) {
      this.updateChartData();
    } else if (this.isBrowser && this.dataLoaded && this.limitsLoaded) {
      this.initChart();
    }
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

      const labels = this.daysOfWeek;
      
      
      const barDatasets = this.dataTypes.slice(0, -1).map((type, index) => {
        const color = this.colorPalette[index % this.colorPalette.length];
        return {
          label: type,
          data: this.mapDataToDaysOfWeek(type),
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
          yAxisID: 'y',
          stack: 'stack1'
        };
      });

      
      const lineDataset = {
        label: this.dataTypes[this.dataTypes.length - 1],
        data: this.mapDataToDaysOfWeek(this.dataTypes[this.dataTypes.length - 1]),
        borderColor: this.colorPalette[(this.dataTypes.length - 1) % this.colorPalette.length],
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointBackgroundColor: this.colorPalette[(this.dataTypes.length - 1) % this.colorPalette.length],
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: 'y',
        type: 'line' as const,
        fill: false
      };

      const datasets = [...barDatasets, lineDataset];

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
                text: ''
              },
              min: 0,
              stacked: true 
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
              },
              stacked: true 
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
                  const dayIndex = context.dataIndex;
                  const dayName = this.daysOfWeek[dayIndex];
                  const dataType = context.dataset.label;
                  
                  const dayData = this.filteredData.filter(item => 
                    item.dayOfWeek === dayIndex && item.dato === dataType
                  );
                  
                  if (dayData.length === 0) return 'No hay datos para este día';
                  
                  const justificaciones = new Set<string>();
                  dayData.forEach(item => {
                    if (item.justificacion) {
                      justificaciones.add(item.justificacion);
                    }
                  });
                  
                  const justText = justificaciones.size > 0 
                    ? Array.from(justificaciones).join('\n') 
                    : 'No hay justificación registrada';
                  
                  return [
                    `─────────────────────`,
                    `Día: ${dayName}`,
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

    } catch (error) {
      console.error('Error al crear el gráfico:', error);
      this.apiConnectionStatus = 'Error al renderizar el gráfico';
      this.errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    }
  }

  private mapDataToDaysOfWeek(dataType: string): (number | null)[] {
    return this.daysOfWeek.map((_, dayIndex) => {
      const dayData = this.filteredData.filter(item => 
        item.dayOfWeek === dayIndex && 
        item.dato === dataType &&
        item.valor !== null
      );
      
      if (dayData.length === 0) return null;
      
      const sum = dayData.reduce((total, item) => total + (item.valor || 0), 0);
      return sum / dayData.length;
    });
  }

  public updateChartData(): void {
    if (!this.chart) return;
  
    // Datasets para barras (todos menos el último)
    const barDatasets = this.dataTypes.slice(0, -1).map((type, index) => {
      const color = this.colorPalette[index % this.colorPalette.length];
      return {
        label: type,
        data: this.mapDataToDaysOfWeek(type),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        yAxisID: 'y',
        stack: 'stack1'
      };
    });

    // Dataset para línea (último dato)
    const lineDataset = {
      label: this.dataTypes[this.dataTypes.length - 1],
      data: this.mapDataToDaysOfWeek(this.dataTypes[this.dataTypes.length - 1]),
      borderColor: this.colorPalette[(this.dataTypes.length - 1) % this.colorPalette.length],
      backgroundColor: 'transparent',
      borderWidth: 3,
      pointBackgroundColor: this.colorPalette[(this.dataTypes.length - 1) % this.colorPalette.length],
      pointRadius: 5,
      pointHoverRadius: 7,
      yAxisID: 'y',
      type: 'line' as const,
      fill: false
    };

    this.chart.data.datasets = [...barDatasets, lineDataset];

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