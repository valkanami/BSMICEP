import { Component, OnInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rendimiento-cristales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rendimiento-cristales.component.html',
  styleUrls: ['./rendimiento-cristales.component.css']
})
export class RendimientoCristalesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedWeek: string = '';
  public availableWeeks: {label: string, startDate: string, endDate: string}[] = [];
  public currentWeekLabel: string = '';

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

  checkApiConnection(): void {
    this.http.get('http://localhost:3000/api/rendimientocristales').subscribe({
      next: (response) => {
        this.apiConnectionStatus = ' ';
        this.originalData = (response as any[]).map(item => ({
          ...item,
          FECHA: new Date(item.FECHA),
          DIA: item.DIA || this.getDayName(new Date(item.FECHA))
        }));
        this.extractAvailableWeeks();
        this.setCurrentWeek();
      },
      error: (error) => {
        this.apiConnectionStatus = 'Error al conectar con la API';
        this.errorMessage = error.message;
        console.error('Error:', error);
      }
    });
  }

  private getDayName(date: Date): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
  }

  private getWeekRange(date: Date): {startDate: Date, endDate: Date} {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? 0 : -6); // Ajuste para que la semana empiece en domingo
    const startDate = new Date(date);
    startDate.setDate(diff);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    
    return {startDate, endDate};
  }

  private formatWeekLabel(startDate: Date, endDate: Date): string {
    return `Semana ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  }

  private extractAvailableWeeks(): void {
    const weekMap = new Map<string, {startDate: Date, endDate: Date}>();
    
    this.originalData.forEach(item => {
      if (item.FECHA) {
        const date = new Date(item.FECHA);
        if (!isNaN(date.getTime())) {
          const {startDate, endDate} = this.getWeekRange(date);
          const weekKey = startDate.toISOString();
          
          if (!weekMap.has(weekKey)) {
            weekMap.set(weekKey, {startDate, endDate});
          }
        }
      }
    });

    this.availableWeeks = Array.from(weekMap.values())
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      .map(week => ({
        label: this.formatWeekLabel(week.startDate, week.endDate),
        startDate: week.startDate.toISOString(),
        endDate: week.endDate.toISOString()
      }));
  }

  private setCurrentWeek(): void {
    const today = new Date();
    const {startDate, endDate} = this.getWeekRange(today);
    
    this.currentWeekLabel = this.formatWeekLabel(startDate, endDate);
    this.selectedWeek = this.availableWeeks.find(w => 
      new Date(w.startDate).getTime() === startDate.getTime()
    )?.label || '';
    
    this.filterDataByWeek();
  }

  filterDataByWeek(): void {
    if (!this.selectedWeek) {
      this.filteredData = [...this.originalData];
      return;
    }

    const selectedWeek = this.availableWeeks.find(w => w.label === this.selectedWeek);
    if (!selectedWeek) return;

    const startDate = new Date(selectedWeek.startDate);
    const endDate = new Date(selectedWeek.endDate);

    this.filteredData = this.originalData.filter(item => {
      if (!item.FECHA) return false;
      const itemDate = new Date(item.FECHA);
      if (isNaN(itemDate.getTime())) return false;
      return itemDate >= startDate && itemDate <= endDate;
    }).sort((a, b) => new Date(a.FECHA).getTime() - new Date(b.FECHA).getTime());

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
      if (!ctx) throw new Error('No se pudo obtener el contexto del canvas');

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      const labels = this.filteredData.map(item => item.DIA);
      
      const datasets = [
        {
          label: 'Rendimiento Cristales A',
          data: this.filteredData.map(item => item['Rend# Cristales de A']),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Rendimiento Cristales B',
          data: this.filteredData.map(item => item['Rend# Cristales de B']),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Rendimiento Cristales C',
          data: this.filteredData.map(item => item['Rend# Cristales de C']),
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
              title: { display: true, text: 'Rendimiento (%)' },
              grid: { display: true }
            },
            x: {
              title: { display: true, text: 'Día de la semana' },
              grid: { display: false }
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
                  const item = this.filteredData[context.dataIndex];
                  return `Fecha: ${new Date(item.FECHA).toLocaleDateString()}`;
                }
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
  
    const labels = this.filteredData.map(item => item.DIA);
    this.chart.data.labels = labels;
    
    this.chart.data.datasets[0].data = this.filteredData.map(item => item['Rend# Cristales de A']);
    this.chart.data.datasets[1].data = this.filteredData.map(item => item['Rend# Cristales de B']);
    this.chart.data.datasets[2].data = this.filteredData.map(item => item['Rend# Cristales de C']);
  
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