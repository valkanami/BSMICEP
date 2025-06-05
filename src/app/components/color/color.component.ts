import { Component, OnInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedDate: string = '';
  public availableDates: string[] = [];
  public categories: string[] = ['COLOR_AZUCAR_A', 'LOM_COLOR'];

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

  private formatDateToYYYYMMDD(dateString: string | Date): string {
    if (typeof dateString === 'string') {
      if (dateString.includes('T')) {
        return dateString.split('T')[0];
      }
      return dateString;
    } else if (dateString instanceof Date) {
      return dateString.toISOString().split('T')[0];
    }
    return '';
  }

  checkApiConnection(): void {
    this.http.get('http://localhost:3000/api/colorazucar').subscribe({
      next: (response) => {
        this.apiConnectionStatus = ' ';
        this.originalData = (response as any[]).map(item => ({
          ...item,
          LOM_COLOR: item[' LOM_COLOR '] || item['LOM_COLOR'] || item.LOM_COLOR
        }));
        this.extractAvailableDates();
        if (this.availableDates.length > 0) {
          this.selectedDate = this.availableDates[this.availableDates.length - 1];
          this.filterDataByDate();
        }
        if (this.isBrowser) {
          setTimeout(() => this.initChart(), 0);
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
        const dateStr = this.formatDateToYYYYMMDD(item.FECHA);
        uniqueDates.add(dateStr);
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
      const itemDateStr = this.formatDateToYYYYMMDD(item.FECHA);
      return itemDateStr === this.selectedDate;
    });

    if (this.chart) {
      this.updateChartData();
    } else if (this.isBrowser) {
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

      const sortedData = [...this.filteredData].sort((a, b) => {
        return new Date(a.FECHA).getTime() - new Date(b.FECHA).getTime();
      });

      const displayData = sortedData.slice(0, 3);
      
      const colorAzucarData = displayData.map(item => item.COLOR_AZUCAR_A ? parseFloat(item.COLOR_AZUCAR_A) : null);
      const lomColorData = displayData.map(item => item.LOM_COLOR ? parseFloat(item.LOM_COLOR) : null);

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['', '1', '2', '3', ''], // Espacios vacíos al inicio y final
          datasets: [
            {
              label: 'Color Azúcar A',
              data: [null, ...colorAzucarData, null], // Null al inicio y final
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderWidth: 2,
              tension: 0.1,
              fill: false
            },
            {
              label: 'LOM Color',
              data: [null, ...lomColorData, null], // Null al inicio y final
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderWidth: 2,
              tension: 0.1,
              fill: false
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
                text: 'Valor de Color'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Muestras'
              },
              ticks: {
                autoSkip: false
              },
              offset: true,       // Agregado para espacio adicional
              bounds: 'ticks'    // Agregado para espacio adicional
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y !== null ? context.parsed.y.toFixed(2) : 'N/D';
                  return `${label}: ${value}`;
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

  public updateChartData(): void {
    if (!this.chart || this.filteredData.length === 0) return;
  
    const sortedData = [...this.filteredData].sort((a, b) => {
      return new Date(a.FECHA).getTime() - new Date(b.FECHA).getTime();
    });

    const displayData = sortedData.slice(0, 3);
    
    const colorAzucarData = displayData.map(item => item.COLOR_AZUCAR_A ? parseFloat(item.COLOR_AZUCAR_A) : null);
    const lomColorData = displayData.map(item => item.LOM_COLOR ? parseFloat(item.LOM_COLOR) : null);
  
    this.chart.data.labels = ['', '1', '2', '3', ''];
    this.chart.data.datasets[0].data = [null, ...colorAzucarData, null];
    this.chart.data.datasets[1].data = [null, ...lomColorData, null];
    
    this.chart.update();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}