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
  ['limitLine']?: LimitLineAnnotation;
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
  public limitValue: number = 5;

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
      RDS_PULIDO: item.RDS_PULIDO || null
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

      const labels = this.filteredData.map(item => item.HORA_ORIGINAL);
      const datasets = [
        {
          label: 'RDS Fundido',
          data: this.filteredData.map(item => item.RDS_FUNDIDO),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'RDS Clarif',
          data: this.filteredData.map(item => item.RDS_CLARIF),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'RDS Pulido',
          data: this.filteredData.map(item => item.RDS_PULIDO),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ];

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
              grid: { display: false }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${context.parsed.y?.toFixed(2) || 'N/D'}`,
                afterLabel: (context) => `Hora: ${labels[context.dataIndex]}`
              }
            },
            legend: { position: 'top' }
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
  
    const labels = this.filteredData.map(item => item.HORA_ORIGINAL);
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = this.filteredData.map(item => item.RDS_FUNDIDO);
    this.chart.data.datasets[1].data = this.filteredData.map(item => item.RDS_CLARIF);
    this.chart.data.datasets[2].data = this.filteredData.map(item => item.RDS_PULIDO);
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