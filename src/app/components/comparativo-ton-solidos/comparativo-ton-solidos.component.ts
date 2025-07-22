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

interface ChartDataset {
  label: string;
  data: (number | null)[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
  yAxisID: string;
}

@Component({
  selector: 'app-comparativo-ton-solidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comparativo-ton-solidos.component.html',
  styleUrls: ['./comparativo-ton-solidos.component.css']
})
export class ComparativoTonSolidosComponent implements OnInit, AfterViewInit, OnDestroy {
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
  public limits: Limit[] = [];
  public dataLoaded: boolean = false;
  public limitsLoaded: boolean = false;
  public tonSolidosValue: number | null = null;
  public tonSolidosJustification: string = '';
  public tonSolidosTime: string = '';

  private colorPalette = [
    'rgba(54, 162, 235, 0.7)',  // Azul para fecha actual
    'rgba(255, 99, 132, 0.7)',  // Rojo para fecha anterior
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(86, 255, 213, 0.7)',
    'rgba(201, 203, 207, 0.7)',
    'rgba(255, 205, 86, 0.7)'
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
    this.http.get('http://localhost:3000/api/datosdia').subscribe({
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
      if (item.dato && item.apartado === 'Comparativo Ton Solidos') {
        uniqueTypes.add(item.dato);
      }
    });
    this.dataTypes = Array.from(uniqueTypes).filter(type => type !== 'Ton Solidos');
  }

  filterDataByDate(): void {
    if (!this.selectedDate) {
      this.filteredData = [...this.originalData];
      return;
    }

    // Obtener el índice de la fecha seleccionada
    const selectedIndex = this.availableDates.indexOf(this.selectedDate);
    
    // Obtener la fecha anterior (si existe)
    const previousDate = selectedIndex > 0 ? this.availableDates[selectedIndex - 1] : null;

    // Filtrar datos para la fecha seleccionada
    const currentDateData = this.originalData.filter(item => {
      if (!item.fecha) return false;
      const itemDate = new Date(item.fecha);
      if (isNaN(itemDate.getTime())) return false;
      const itemDateStr = itemDate.toISOString().split('T')[0];
      return itemDateStr === this.selectedDate;
    });

    // Filtrar datos para la fecha anterior (si existe)
    const previousDateData = previousDate ? this.originalData.filter(item => {
      if (!item.fecha) return false;
      const itemDate = new Date(item.fecha);
      if (isNaN(itemDate.getTime())) return false;
      const itemDateStr = itemDate.toISOString().split('T')[0];
      return itemDateStr === previousDate;
    }) : [];

    // Combinar los datos para procesamiento
    this.filteredData = [...currentDateData, ...previousDateData];

    // Extraer el valor de Ton Solidos de la fecha actual
    const tonSolidosItem = currentDateData.find(item => item.dato === 'Ton Solidos');
    if (tonSolidosItem) {
      this.tonSolidosValue = tonSolidosItem.valor !== null ? Number(tonSolidosItem.valor) : null;
      this.tonSolidosJustification = tonSolidosItem.justificacion || '';
      this.tonSolidosTime = tonSolidosItem.HORA_ORIGINAL || '';
    } else {
      this.tonSolidosValue = null;
      this.tonSolidosJustification = '';
      this.tonSolidosTime = '';
    }

    // Filtrar los datos para el gráfico (excluyendo Ton Solidos)
    this.filteredData = this.filteredData.filter(item => item.dato !== 'Ton Solidos');

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
      .filter(item => item.apartado === 'Comparativo Ton Solidos')
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

      const labels = this.dataTypes;
      
      // Obtener el índice de la fecha seleccionada
      const selectedIndex = this.availableDates.indexOf(this.selectedDate);
      const previousDate = selectedIndex > 0 ? this.availableDates[selectedIndex - 1] : null;

      // Crear datasets para ambas fechas
      const datasets: ChartDataset[] = [
        {
          label: this.selectedDate,
          data: this.dataTypes.map(type => {
            const dataItem = this.filteredData.find(item => 
              item.dato === type && new Date(item.fecha).toISOString().split('T')[0] === this.selectedDate
            );
            return dataItem ? dataItem.valor : null;
          }),
          backgroundColor: this.dataTypes.map(() => this.colorPalette[0]),
          borderColor: this.dataTypes.map(() => 'rgba(54, 162, 235, 1)'),
          borderWidth: 1,
          yAxisID: 'y'
        }
      ];

      // Añadir dataset de la fecha anterior si existe
      if (previousDate) {
        datasets.push({
          label: previousDate,
          data: this.dataTypes.map(type => {
            const dataItem = this.filteredData.find(item => 
              item.dato === type && new Date(item.fecha).toISOString().split('T')[0] === previousDate
            );
            return dataItem ? dataItem.valor : null;
          }),
          backgroundColor: this.dataTypes.map(() => this.colorPalette[1]),
          borderColor: this.dataTypes.map(() => 'rgba(255, 99, 132, 1)'),
          borderWidth: 1,
          yAxisID: 'y'
        });
      }

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
              stacked: false // Para barras agrupadas (no apiladas)
            },
            x: {
              title: {
                display: true,
                text: 'Datos de Molienda'
              },
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45
              },
              stacked: false // Para barras agrupadas
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const datasetLabel = context.dataset.label || '';
                  const value = context.parsed.y !== null ? context.parsed.y.toFixed(2) : 'N/D';
                  return `${datasetLabel}: ${value}`;
                },
                afterLabel: (context: any) => {
                  const dataType = labels[context.dataIndex];
                  const date = context.dataset.label;
                  
                  const dataItem = this.filteredData.find(item => 
                    item.dato === dataType && 
                    new Date(item.fecha).toISOString().split('T')[0] === date
                  );
                  
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
              position: 'top'
            },
            annotation: {
              annotations: annotations
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

    // Obtener el índice de la fecha seleccionada
    const selectedIndex = this.availableDates.indexOf(this.selectedDate);
    const previousDate = selectedIndex > 0 ? this.availableDates[selectedIndex - 1] : null;

    // Actualizar datos para la fecha actual
    this.chart.data.datasets[0] = {
      label: this.selectedDate,
      data: this.dataTypes.map(type => {
        const dataItem = this.filteredData.find(item => 
          item.dato === type && new Date(item.fecha).toISOString().split('T')[0] === this.selectedDate
        );
        return dataItem ? dataItem.valor : null;
      }),
      backgroundColor: this.dataTypes.map(() => this.colorPalette[0]),
      borderColor: this.dataTypes.map(() => 'rgba(54, 162, 235, 1)'),
      borderWidth: 1,
      yAxisID: 'y'
    };

    // Actualizar o añadir datos para la fecha anterior
    if (previousDate) {
      if (this.chart.data.datasets.length > 1) {
        // Actualizar dataset existente
        this.chart.data.datasets[1] = {
          label: previousDate,
          data: this.dataTypes.map(type => {
            const dataItem = this.filteredData.find(item => 
              item.dato === type && new Date(item.fecha).toISOString().split('T')[0] === previousDate
            );
            return dataItem ? dataItem.valor : null;
          }),
          backgroundColor: this.dataTypes.map(() => this.colorPalette[1]),
          borderColor: this.dataTypes.map(() => 'rgba(255, 99, 132, 1)'),
          borderWidth: 1,
          yAxisID: 'y'
        };
      } else {
        // Añadir nuevo dataset
        (this.chart.data.datasets as ChartDataset[]).push({
          label: previousDate,
          data: this.dataTypes.map(type => {
            const dataItem = this.filteredData.find(item => 
              item.dato === type && new Date(item.fecha).toISOString().split('T')[0] === previousDate
            );
            return dataItem ? dataItem.valor : null;
          }),
          backgroundColor: this.dataTypes.map(() => this.colorPalette[1]),
          borderColor: this.dataTypes.map(() => 'rgba(255, 99, 132, 1)'),
          borderWidth: 1,
          yAxisID: 'y'
        });
      }
    } else if (this.chart.data.datasets.length > 1) {
      // Eliminar dataset de fecha anterior si no existe
      this.chart.data.datasets = [this.chart.data.datasets[0]];
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