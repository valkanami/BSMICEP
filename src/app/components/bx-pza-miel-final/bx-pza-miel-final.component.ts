import { Component, OnInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bx-pza-miel-final',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bx-pza-miel-final.component.html',
  styleUrls: ['./bx-pza-miel-final.component.css']
})
export class BxPzaMielFinalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedDate: string = '';
  public availableDates: string[] = [];
  public dataLoaded: boolean = false;
  public fixedHours: string[] = [
    '07:00',  '11:00', '15:00',
    '19:00', '23:00', '03:00',
    'Promedios'
  ];

  public promedioBrix: number | null = null;
  public promedioPureza: number | null = null;
  public purezaEsperada: number | null = null;

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
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.dataLoaded) {
      this.initChartIfReady();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private initChartIfReady(): void {
    if (this.isBrowser && this.dataLoaded && this.filteredData.length > 0) {
      this.initChart();
    }
  }

  private formatTimeToHHMM(timeString: string | Date): string {
    if (typeof timeString === 'string') {
      if (timeString.includes('T')) {
        const timePart = timeString.split('T')[1].split('.')[0];
        const [hours, minutes] = timePart.split(':');
        return `${hours}:${minutes}`;
      }
      return timeString.length >= 5 ? timeString.substring(0, 5) : '00:00';
    } else if (timeString instanceof Date) {
      return timeString.toTimeString().substring(0, 5);
    }
    return '00:00';
  }

  checkApiConnection(): void {
    this.dataLoaded = false;
    this.http.get('http://localhost:3000/api/bxpzamielfinal').subscribe({
      next: (response) => {
        this.apiConnectionStatus = ' ';
        this.originalData = this.preserveOriginalTimes(response as any[]);
        this.extractAvailableDates();
        if (this.availableDates.length > 0) {
          this.selectedDate = this.availableDates[this.availableDates.length - 1];
          this.filterDataByDate();
        }
        this.dataLoaded = true;
        this.initChartIfReady();
      },
      error: (error) => {
        this.apiConnectionStatus = 'Error al conectar con la API';
        this.errorMessage = error.message;
        console.error('Error:', error);
        this.dataLoaded = true;
      }
    });
  }

  private extractAvailableDates(): void {
    const uniqueDates = new Set<string>();
    this.originalData.forEach(item => {
      if (item.FECHA) {
        const date = new Date(item.FECHA);
        if (!isNaN(date.getTime())) {
          uniqueDates.add(date.toISOString().split('T')[0]);
        }
      }
    });
    this.availableDates = Array.from(uniqueDates).sort();
  }

  filterDataByDate(): void {
    if (!this.selectedDate) {
      this.filteredData = [...this.originalData];
      return;
    }

    this.filteredData = this.originalData.filter(item => {
      if (!item.FECHA) return false;
      const itemDate = new Date(item.FECHA);
      return itemDate.toISOString().split('T')[0] === this.selectedDate;
    });

    this.filteredData.sort((a, b) => this.timeToMinutes(a.HORA_ORIGINAL) - this.timeToMinutes(b.HORA_ORIGINAL));

    if (this.filteredData.length > 0) {
      this.promedioBrix = this.filteredData[0].PROMEDIO_BRIX ? parseFloat(this.filteredData[0].PROMEDIO_BRIX) : null;
      this.promedioPureza = this.filteredData[0].PROMEDIO_PZA ? parseFloat(this.filteredData[0].PROMEDIO_PZA) : null;
      this.purezaEsperada = this.filteredData[0].PZA_ESPERADA ? parseFloat(this.filteredData[0].PZA_ESPERADA) : null;
    }

    if (this.chart) {
      this.updateChartData();
    } else if (this.isBrowser) {
      this.initChart();
    }
  }

  private timeToMinutes(timeStr: string): number {
    if (timeStr === 'Promedios') return 24 * 60;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private preserveOriginalTimes(rawData: any[]): any[] {
    return rawData.map(item => ({
      ...item,
      HORA_ORIGINAL: this.formatTimeToHHMM(item.HORA || '00:00'), // Cambiado de TURNO a HORA
      BRIX_MIEL_FINAL: item['BRIX MIEL FINAL'] || null,
      PZA_MIEL_FINAL: item['PZA MIEL FINAL'] || null,
      JUSTIFICACION_BRIX: item.JUSTIFICACION_BRIX || '',
      JUSTIFICACION_MIEL: item.JUSTIFICACION_MIEL || '',
      PROMEDIO_BRIX: item.PROMEDIO_BRIX || null,
      PROMEDIO_PZA: item.PROMEDIO_PZA || null,
      PZA_ESPERADA: item.PZA_ESPERADA || null
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
      ctx.scale(dpr, dpr);

      const labels = this.fixedHours;
      const brixData = this.mapDataToFixedHours('BRIX_MIEL_FINAL');
      const purezaData = this.mapDataToFixedHours('PZA_MIEL_FINAL');

      brixData.push(this.promedioBrix);
      purezaData.push(this.promedioPureza);

      const purezaEsperadaData = labels.map((_, i) => 
        i === labels.length - 1 ? this.purezaEsperada : null
      );

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Brix Miel Final',
              data: brixData,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'Pureza Miel Final',
              data: purezaData,
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'Pureza Esperada',
              data: purezaEsperadaData,
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
              title: { display: true, text: 'Valores (%)' }
            },
            x: {
              title: { display: true, text: 'Hora del turno' },
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
                label: (context) => {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y !== null ? context.parsed.y.toFixed(2) : 'N/D';
                  return `${label}: ${value}%`;
                },
                afterLabel: (context) => {
                  const hour = labels[context.dataIndex];
                  if (hour === 'Promedios') {
                    return context.dataset.label === 'Pureza Esperada' 
                      ? 'Valor objetivo de pureza' 
                      : `Promedio diario`;
                  }
                  
                  const dataItem = this.findDataItemByHour(hour);
                  if (!dataItem) return 'No hay datos para esta hora';
                  
                  const justification = context.datasetIndex === 0 
                    ? dataItem.JUSTIFICACION_BRIX 
                    : dataItem.JUSTIFICACION_MIEL;
                  
                  return [
                    '─────────────────────',
                    `Hora: ${hour}`,
                    `Justificación:`,
                    justification || 'No hay justificación registrada'
                  ];
                }
              },
              displayColors: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 12 },
              padding: 12
            },
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                padding: 20
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

  private mapDataToFixedHours(dataField: string): (number | null)[] {
    return this.fixedHours.slice(0, -1).map(hour => {
      const dataItem = this.findDataItemByHour(hour);
      return dataItem?.[dataField] !== null && dataItem?.[dataField] !== undefined 
        ? parseFloat(dataItem[dataField]) 
        : null;
    });
  }

  private findDataItemByHour(hour: string): any | null {
    if (hour === 'Promedios') return null;
    const targetMinutes = this.timeToMinutes(hour);
    
    return this.filteredData.reduce((closest, item) => {
      const itemMinutes = this.timeToMinutes(item.HORA_ORIGINAL);
      const diff = Math.abs(itemMinutes - targetMinutes);
      return diff < 30 && (!closest || diff < this.timeToMinutes(closest.HORA_ORIGINAL) - targetMinutes) 
        ? item 
        : closest;
    }, null);
  }

  public updateChartData(): void {
    if (!this.chart) return;
    
    const brixData = this.mapDataToFixedHours('BRIX_MIEL_FINAL');
    const purezaData = this.mapDataToFixedHours('PZA_MIEL_FINAL');
    const purezaEsperadaData = this.fixedHours.map((_, i) => 
      i === this.fixedHours.length - 1 ? this.purezaEsperada : null
    );

    brixData.push(this.promedioBrix);
    purezaData.push(this.promedioPureza);

    this.chart.data.datasets[0].data = brixData;
    this.chart.data.datasets[1].data = purezaData;
    this.chart.data.datasets[2].data = purezaEsperadaData;
    
    this.chart.update();
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
    this.loadInitialData();
  }
}