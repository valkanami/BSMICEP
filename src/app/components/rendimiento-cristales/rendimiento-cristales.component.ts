import { Component, OnInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RendimientoData {
  FECHA: Date;
  DIA: string;
  'Rendimiento_Cristales_A': number | null;
  'Rendimiento_Cristales_B': number | null;
  'Rendimiento_Cristales_C': number | null;
}

interface WeekRange {
  label: string;
  startDate: string;
  endDate: string;
}

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
  public originalData: RendimientoData[] = [];
  public filteredData: RendimientoData[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedWeek: string = '';
  public availableWeeks: WeekRange[] = [];
  public currentWeekLabel: string = '';

  private weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

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
    this.http.get<any[]>('http://localhost:3000/api/rendimientocristales').subscribe({
      next: (response) => {
        this.apiConnectionStatus = ' ';
        this.originalData = response.map(item => {
          // Solución definitiva para el problema de fechas
          const fecha = new Date(item.FECHA);
          // Ajustar la fecha sumando el offset de la zona horaria
          const offset = fecha.getTimezoneOffset() * 60000;
          const fechaAjustada = new Date(fecha.getTime() + offset);
          
          return {
            ...item,
            FECHA: fechaAjustada,
            DIA: this.getDayName(fechaAjustada),
            'Rendimiento_Cristales_A': item['Rendimiento_Cristales_A'] ?? null,
            'Rendimiento_Cristales_B': item['Rendimiento_Cristales_B'] ?? null,
            'Rendimiento_Cristales_C': item['Rendimiento_Cristales_C'] ?? null
          };
        });
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
    return this.weekDays[date.getDay()];
  }

  private getWeekRange(date: Date): {startDate: Date, endDate: Date} {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const startDate = new Date(date);
    startDate.setDate(diff);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    
    return {startDate, endDate};
  }

  private formatWeekLabel(startDate: Date, endDate: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    };
    return `Semana ${startDate.toLocaleDateString('es-ES', options)} - ${endDate.toLocaleDateString('es-ES', options)}`;
  }

  private extractAvailableWeeks(): void {
    const weekMap = new Map<string, {startDate: Date, endDate: Date}>();
    
    this.originalData.forEach(item => {
      if (item.FECHA) {
        const date = new Date(item.FECHA);
        if (!isNaN(date.getTime())) {
          const {startDate, endDate} = this.getWeekRange(date);
          const weekKey = startDate.toISOString().split('T')[0];
          
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
    
    const currentWeekKey = startDate.toISOString().split('T')[0];
    const foundWeek = this.availableWeeks.find(w => 
      new Date(w.startDate).toISOString().split('T')[0] === currentWeekKey
    );
    
    this.currentWeekLabel = this.formatWeekLabel(startDate, endDate);
    this.selectedWeek = foundWeek?.label || (this.availableWeeks.length > 0 ? this.availableWeeks[0].label : '');
    
    this.filterDataByWeek();
  }

  filterDataByWeek(): void {
    if (!this.selectedWeek || !this.availableWeeks.length) {
      this.filteredData = [...this.originalData];
      return;
    }

    const selectedWeek = this.availableWeeks.find(w => w.label === this.selectedWeek);
    if (!selectedWeek) return;

    const startDate = new Date(selectedWeek.startDate);
    const endDate = new Date(selectedWeek.endDate);

    const weekData = this.originalData.filter(item => {
      if (!item.FECHA) return false;
      const itemDate = new Date(item.FECHA);
      if (isNaN(itemDate.getTime())) return false;
      return itemDate >= startDate && itemDate <= endDate;
    });

    const weekDaysData: Record<string, RendimientoData | null> = {};
    this.weekDays.forEach(day => {
      weekDaysData[day] = null;
    });

    weekData.forEach(item => {
      const dayName = this.getDayName(new Date(item.FECHA));
      weekDaysData[dayName] = item;
    });

    this.filteredData = this.weekDays.map(day => {
      const existingData = weekDaysData[day];
      if (existingData) {
        return existingData;
      } else {
        const dateForDay = this.getDateForDayInWeek(day, startDate);
        return {
          DIA: day,
          FECHA: dateForDay,
          'Rendimiento_Cristales_A': null,
          'Rendimiento_Cristales_B': null,
          'Rendimiento_Cristales_C': null
        };
      }
    });

    if (this.chart) {
      this.updateChartData();
    } else if (this.isBrowser) {
      this.initChart();
    }
  }

  private getDateForDayInWeek(dayName: string, weekStartDate: Date): Date {
    const dayIndex = this.weekDays.indexOf(dayName);
    if (dayIndex === -1) return new Date(weekStartDate);
    
    const date = new Date(weekStartDate);
    date.setDate(weekStartDate.getDate() + dayIndex);
    return date;
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
          data: this.filteredData.map(item => item['Rendimiento_Cristales_A']),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Rendimiento Cristales B',
          data: this.filteredData.map(item => item['Rendimiento_Cristales_B']),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Rendimiento Cristales C',
          data: this.filteredData.map(item => item['Rendimiento_Cristales_C']),
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
              min: 0,
              max: 100,
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
                  // Mostrar fecha en formato local sin problemas de zona horaria
                  return `Fecha: ${item.FECHA.toISOString().split('T')[0]}`;
                }
              }
            },
            legend: { 
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
  
    const labels = this.filteredData.map(item => item.DIA);
    this.chart.data.labels = labels;
    
    this.chart.data.datasets[0].data = this.filteredData.map(item => item['Rendimiento_Cristales_A']);
    this.chart.data.datasets[1].data = this.filteredData.map(item => item['Rendimiento_Cristales_B']);
    this.chart.data.datasets[2].data = this.filteredData.map(item => item['Rendimiento_Cristales_C']);
  
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
    this.checkApiConnection();
  }
}