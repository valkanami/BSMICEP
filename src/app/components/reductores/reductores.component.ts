import { Component, OnInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartDataset, registerables, TooltipItem } from 'chart.js';
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

interface DatoCampo {
  nombre: string;
  valor: number;
}

interface GrupoCategoria {
  categoria: string;
  campos: DatoCampo[];
}

type LineDataset = ChartDataset<'line', (number | null)[]> & {
  tension: number;
};

type BarDataset = ChartDataset<'bar', (number | null)[]>;

@Component({
  selector: 'app-reductores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reductores.component.html',
  styleUrls: ['./reductores.component.css']
})
export class ReductoresComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedDate: string = '';
  public availableDates: string[] = [];
  public dataTypes: string[] = ['Desmenuzado', 'Mezclado']; 
  public limits: Limit[] = [
    { id: 5, name: '', value: null, color: 'rgba(255, 99, 132, 1)', axis: 'y', unit: '' },
    { id: 6, name: '', value: null, color: 'rgba(54, 162, 235, 1)', axis: 'y', unit: '' },
  ];
  public dataLoaded: boolean = false;
  public limitsLoaded: boolean = false;
  public fixedHours: string[] = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00', '23:00', '00:00',
    '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'
  ];

  // Variables para la tabla de reporte
  public datosOriginalesTabla: any[] = [];
  public gruposCategoria: GrupoCategoria[] = [];
  public todosCampos: string[] = [];
  public fechasDisponiblesTabla: string[] = [];
  public isLoadingTabla = true;
  public errorMessageTabla = '';
  public fechaSeleccionadaTabla = '';
  public readonly APARTADO_FILTRADO = 'Cuadro caña molida1';

  private colorPalette = [
    'rgba(255, 99, 132, 1)',    
    'rgba(54, 162, 235, 1)',     
    'rgba(255, 206, 86, 1)',     
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
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
      this.loadTableData();
    }
  }

  private loadInitialData(): void {
    this.checkApiConnection();
    this.loadLimitValues();
  }

  private loadTableData(): void {
    this.isLoadingTabla = true;
    this.apiService.getDatosCuadros().subscribe({
        next: (data) => {
          const datosFiltrados = data.filter(item => item.Apartado === this.APARTADO_FILTRADO);
          
          this.fechasDisponiblesTabla = [...new Set(datosFiltrados.map(item => {
            const fechaOriginal = new Date(item.Fecha);
            fechaOriginal.setDate(fechaOriginal.getDate() + 1); 
            return this.formatDate(fechaOriginal);
          }))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          
          this.datosOriginalesTabla = datosFiltrados;
          
          if (this.fechasDisponiblesTabla.length > 0) {
            this.fechaSeleccionadaTabla = this.fechasDisponiblesTabla[0];
            this.procesarDatosTabla();
          }
          
          this.isLoadingTabla = false;
        },
        error: (err) => {
          this.errorMessageTabla = 'Error al cargar los datos de la tabla';
          this.isLoadingTabla = false;
          console.error(err);
        }
      });
  }

  private procesarDatosTabla(): void {
    const datosFiltrados = this.datosOriginalesTabla.filter(item => {
      const fechaOriginal = new Date(item.Fecha);
      fechaOriginal.setDate(fechaOriginal.getDate() + 1);
      return this.formatDate(fechaOriginal) === this.fechaSeleccionadaTabla;
    });
    
    this.todosCampos = [...new Set(datosFiltrados.map(item => item.Dato))];
    
    const categoriasUnicas = [...new Set(datosFiltrados.map(item => item.Categoria))];
    
    this.gruposCategoria = categoriasUnicas.map(categoria => {
      const datosCategoria = datosFiltrados.filter(item => item.Categoria === categoria);
      
      const campos: DatoCampo[] = this.todosCampos.map(nombreCampo => {
        const dato = datosCategoria.find(item => item.Dato === nombreCampo);
        return {
          nombre: nombreCampo,
          valor: dato ? dato.Valor : 0 
        };
      });
      
      return {
        categoria,
        campos
      };
    });
  }

  aplicarFiltroTabla(): void {
    this.procesarDatosTabla();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
   this.apiService.getRegistroZafra().subscribe({
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
      return itemDateStr === this.selectedDate && 
             (item.dato === 'Desmenuzado' || item.dato === 'Mezclado');
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
      .filter(item => item.apartado === 'Reductores' && 
             (item.dato === 'Desmenuzado' || item.dato === 'Mezclado')) 
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

      const labels = this.fixedHours;
      
      const lineDatasets: LineDataset[] = this.dataTypes.map((type, index) => {
        const color = this.colorPalette[index % this.colorPalette.length];
        return {
          label: type,
          data: this.mapDataToFixedHours(type),
          borderColor: color,
          backgroundColor: color.replace('1)', '0.2)'),
          borderWidth: 2,
          tension: 0.1,
          yAxisID: 'y',
          type: 'line'
        };
      });

      const barDataset: BarDataset = {
        label: 'Diferencia',
        data: this.calculateDifferences(),
        backgroundColor: 'rgba(169, 169, 169, 0.5)',
        borderColor: 'rgba(169, 169, 169, 1)',
        borderWidth: 1,
        yAxisID: 'y',
        type: 'bar'
      };

      const datasets: (LineDataset | BarDataset)[] = [...lineDatasets, barDataset];

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
                text: 'Reductores'
              },
              min: 0
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
                label: (context: TooltipItem<'line' | 'bar'>) => {
                  const label = context.dataset.label || '';
                  if (label === 'Diferencia') {
                    const value = context.parsed.y !== null ? Math.abs(context.parsed.y).toFixed(2) : 'N/D';
                    return `${label}: ${value}`;
                  } else {
                    const value = context.parsed.y !== null ? context.parsed.y.toFixed(2) : 'N/D';
                    return `${label}: ${value}`;
                  }
                },
                afterLabel: (context: TooltipItem<'line' | 'bar'>) => {
                  if (context.dataset.label === 'Diferencia') return undefined;
                  
                  const hour = labels[context.dataIndex];
                  const dataItem = this.findDataItemByHour(hour, context.dataset.label);
                  
                  if (!dataItem) return 'No hay datos para esta hora';
                  
                  const justificacion = dataItem.justificacion || 'No hay justificación registrada';
                  
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

  private calculateDifferences(): (number | null)[] {
    if (this.dataTypes.length !== 2) return [];

    const desmenuzadoData = this.mapDataToFixedHours('Desmenuzado');
    const mezcladoData = this.mapDataToFixedHours('Mezclado');

    return desmenuzadoData.map((val, index) => {
      if (val === null || mezcladoData[index] === null) return null;
      return val - mezcladoData[index];
    });
  }

  private mapDataToFixedHours(dataType: string): (number | null)[] {
    return this.fixedHours.map(hour => {
      const dataItem = this.findDataItemByHour(hour, dataType);
      return dataItem ? dataItem.valor : null;
    });
  }

  private findDataItemByHour(hour: string, dataType?: string): any | null {
    const targetMinutes = this.timeToMinutes(hour);
    let closestItem = null;
    let smallestDiff = Infinity;

    for (const item of this.filteredData) {
      if (dataType && item.dato !== dataType) continue;
      
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
  
    const lineDatasets: LineDataset[] = this.dataTypes.map((type, index) => {
      const color = this.colorPalette[index % this.colorPalette.length];
      return {
        label: type,
        data: this.mapDataToFixedHours(type),
        borderColor: color,
        backgroundColor: color.replace('1)', '0.2)'),
        borderWidth: 2,
        tension: 0.1,
        yAxisID: 'y',
        type: 'line'
      };
    });

    const barDataset: BarDataset = {
      label: 'Diferencia',
      data: this.calculateDifferences(),
      backgroundColor: 'rgba(169, 169, 169, 0.5)',
      borderColor: 'rgba(169, 169, 169, 1)',
      borderWidth: 1,
      yAxisID: 'y',
      type: 'bar'
    };

    this.chart.data.datasets = [...lineDatasets, barDataset] as ChartDataset[];

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
    
    // También refrescamos los datos de la tabla
    this.errorMessageTabla = '';
    this.isLoadingTabla = true;
    this.loadTableData();
  }
}