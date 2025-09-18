import { Component, OnInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Limit {
  id: number;
  name: string;
  value: number | null;
  color: string;
  axis: string;
  unit: string;
}

@Component({
  selector: 'app-ph-promedio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ph-promedio.component.html',
  styleUrls: ['./ph-promedio.component.css']
})
export class PhPromedioComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedDate: string = '';
  public availableDates: string[] = [];
  public dataTypes: string[] = [];
  public limits: Limit[] = [
    { id: 21, name: 'Desmenuzado', value: null, color: 'rgb(255, 0, 0)', axis: 'y', unit: '' },
    { id: 22, name: 'Mezclado', value: null, color: 'rgb(0, 255, 0)', axis: 'y', unit: '' },
    { id: 23, name: 'Alcalizado', value: null, color: 'rgb(0, 0, 255)', axis: 'y', unit: '' },
    { id: 24, name: 'Claro', value: null, color: 'rgb(255, 255, 0)', axis: 'y', unit: '' },
    { id: 25, name: 'Meladura', value: null, color: 'rgb(255, 0, 255)', axis: 'y', unit: '' },
  ];
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

  checkApiConnection(): void {
    this.dataLoaded = false;
    this.apiService.getPromedios().subscribe({
      next: (response) => {
        this.apiConnectionStatus = ' ';
        this.originalData = this.preserveOriginalTimes(response as any[]);
        this.extractAvailableDates();
        this.extractDataTypes();
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

  private extractAvailableDates(): void {
    const uniqueDates = new Set<string>();
    this.originalData.forEach(item => {
      if (item.fecha) {
        const date = new Date(item.fecha);
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

  private extractDataTypes(): void {
    const uniqueTypes = new Set<string>();
    this.originalData.forEach(item => {
      if (item.dato && item.apartado === 'pH Promedio') {
        uniqueTypes.add(item.dato);
      }
    });
    this.dataTypes = Array.from(uniqueTypes);
  }

  filterDataByDate(): void {
    if (!this.selectedDate) {
      this.filteredData = [...this.originalData];
      return;
    }

    this.filteredData = this.originalData.filter(item => {
      if (!item.fecha) return false;
      const itemDate = new Date(item.fecha);
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
    return rawData
      .filter(item => item.apartado === 'pH Promedio')
      .map(item => {
        let horaOriginal = '';
        if (item.hora) {
          horaOriginal = this.formatTimeToHHMM(item.hora);
        }

        return {
          ...item,
          HORA_ORIGINAL: horaOriginal || '00:00',
          promedio: item.promedio !== null ? Number(item.promedio) : null,
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

      
      const mainDataset = {
        label: 'Valores de pH',
        data: this.dataTypes.map(type => {
          const dataItem = this.filteredData.find(item => item.dato === type);
          return dataItem ? dataItem.promedio : null;
        }),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 2,
        yAxisID: 'y',
        type: 'line' as const,
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7
      };

      
      const limitsDataset = {
        label: 'Límites',
        data: this.limits.map(limit => limit.value),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
        yAxisID: 'y',
        type: 'line' as const,
        tension: 0,
        pointBackgroundColor: this.limits.map(limit => limit.color),
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: false
      };

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.limits.map(limit => limit.name),
          datasets: [mainDataset, limitsDataset]
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
                text: 'Valores de pH'
              },
              min: 0
            },
            x: {
              title: {
                display: true,
                text: 'Etapas de Proceso'
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
                label: (context: TooltipItem<'line'>) => {
                  const datasetLabel = context.dataset.label || '';
                  const value = context.parsed.y !== null ? context.parsed.y.toFixed(2) : 'N/D';
                  
                  if (datasetLabel === 'Límites') {
                    const limit = this.limits[context.dataIndex];
                    return `Límite ${limit?.name || ''}: ${value}`;
                  } else {
                    const dataType = this.dataTypes[context.dataIndex];
                    return `${dataType}: ${value}`;
                  }
                },
                afterLabel: (context: TooltipItem<'line'>) => {
                  if (context.datasetIndex === 0) {
                    const dataType = this.dataTypes[context.dataIndex];
                    const dataItem = this.filteredData.find(item => item.dato === dataType);
                    
                    if (!dataItem) return 'No hay datos para este tipo';
                    
                    const hora = dataItem.HORA_ORIGINAL || 'Hora desconocida';
                    const justificacion = dataItem.justificacion || 'No hay justificación registrada';
                    
                    return [
                      `─────────────────────`,
                      `Hora: ${hora}`,
                      `Justificación:`,
                      `${justificacion}`
                    ];
                  }
                  return undefined;
                }
              },
              displayColors: true,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 12 },
              padding: 12,
              bodySpacing: 4
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 12
              }
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

  public updateChartData(): void {
    if (!this.chart) return;

    
    this.chart.data.datasets[0] = {
      label: 'Valores de pH',
      data: this.dataTypes.map(type => {
        const dataItem = this.filteredData.find(item => item.dato === type);
        return dataItem ? dataItem.promedio : null;
      }),
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderWidth: 2,
      yAxisID: 'y',
      type: 'line',
      tension: 0.1,
      pointRadius: 5,
      pointHoverRadius: 7
    };

    
    this.chart.data.datasets[1] = {
      label: 'Límites',
      data: this.limits.map(limit => limit.value),
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderWidth: 2,
      borderDash: [5, 5],
      yAxisID: 'y',
      type: 'line',
      tension: 0,
      pointBackgroundColor: this.limits.map(limit => limit.color),
      pointRadius: 6,
      pointHoverRadius: 8,
      fill: false
    };

    
    this.chart.data.labels = this.limits.map(limit => limit.name);

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