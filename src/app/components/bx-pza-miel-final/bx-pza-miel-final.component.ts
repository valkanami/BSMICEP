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
  @ViewChild('chartCanvasBrix', { static: false }) chartCanvasBrix!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvasPureza', { static: false }) chartCanvasPureza!: ElementRef<HTMLCanvasElement>;
  public chartBrix: Chart | null = null;
  public chartPureza: Chart | null = null;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public originalData: any[] = [];
  public filteredData: any[] = [];
  public isBrowser: boolean;
  public errorMessage: string = '';
  public selectedDate: string = '';
  public availableDates: string[] = [];
  public dataLoaded: boolean = false;
  public fixedHours: string[] = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00', '23:00', '00:00',
    '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'
  ];
  public promedioBrix: number = 0;
  public promedioPureza: number = 0;
  public purezaEsperada: number = 0;

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
    if (this.isBrowser && this.dataLoaded && this.filteredData.length > 0) {
      this.initCharts();
    }
  }

  ngOnDestroy(): void {
    this.destroyCharts();
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
        if (this.isBrowser) {
          this.initCharts();
        }
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
      if (!item.FECHA) return false;
      const itemDate = new Date(item.FECHA);
      if (isNaN(itemDate.getTime())) return false;
      const itemDateStr = itemDate.toISOString().split('T')[0];
      return itemDateStr === this.selectedDate;
    });

    this.filteredData.sort((a, b) => {
      const timeA = this.timeToMinutes(a.HORA_ORIGINAL);
      const timeB = this.timeToMinutes(b.HORA_ORIGINAL);
      return timeA - timeB;
    });

    this.calculateAverages();

    if (this.chartBrix && this.chartPureza) {
      this.updateCharts();
    } else if (this.isBrowser && this.dataLoaded) {
      this.initCharts();
    }
  }

  private calculateAverages(): void {
    let sumBrix = 0;
    let sumPureza = 0;
    let count = 0;

    this.filteredData.forEach(item => {
      if (item['BRIX MIEL FINAL'] !== null && item['BRIX MIEL FINAL'] !== undefined) {
        sumBrix += parseFloat(item['BRIX MIEL FINAL']);
        count++;
      }
      if (item['PZA MIEL FINAL'] !== null && item['PZA MIEL FINAL'] !== undefined) {
        sumPureza += parseFloat(item['PZA MIEL FINAL']);
      }
    });

    this.promedioBrix = count > 0 ? sumBrix / count : 0;
    this.promedioPureza = count > 0 ? sumPureza / count : 0;

    // Tomar el primer valor de PZA_ESPERADA que encontremos
    const firstItemWithPurezaEsperada = this.filteredData.find(item => 
      item['PZA_ESPERADA'] !== null && item['PZA_ESPERADA'] !== undefined
    );
    this.purezaEsperada = firstItemWithPurezaEsperada ? 
      parseFloat(firstItemWithPurezaEsperada['PZA_ESPERADA']) : 0;
  }

  private timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private preserveOriginalTimes(rawData: any[]): any[] {
    return rawData.map(item => {
      let horaOriginal = '';
      if (item.TURNO) {
        horaOriginal = this.formatTimeToHHMM(item.TURNO);
      }

      return {
        ...item,
        HORA_ORIGINAL: horaOriginal || '00:00',
        'BRIX MIEL FINAL': item['BRIX MIEL FINAL'] || null,
        'PZA MIEL FINAL': item['PZA MIEL FINAL'] || null,
        JUSTIFICACION_BRIX: item.JUSTIFICACION_BRIX || '',
        JUSTIFICACION_MIEL: item.JUSTIFICACION_MIEL || '',
        PROMEDIO_BRIX: item.PROMEDIO_BRIX || null,
        PROMEDIO_PZA: item.PROMEDIO_PZA || null,
        PZA_ESPERADA: item.PZA_ESPERADA || null
      };
    });
  }

  private initCharts(): void {
    if (!this.isBrowser || !this.chartCanvasBrix?.nativeElement || !this.chartCanvasPureza?.nativeElement) return;

    this.destroyCharts();

    try {
      // Gráfico de Brix
      const canvasBrix = this.chartCanvasBrix.nativeElement;
      const ctxBrix = canvasBrix.getContext('2d');
      
      if (!ctxBrix) {
        throw new Error('No se pudo obtener el contexto del canvas para Brix');
      }
      
      const dprBrix = window.devicePixelRatio || 1;
      const rectBrix = canvasBrix.getBoundingClientRect();
      
      canvasBrix.width = rectBrix.width * dprBrix;
      canvasBrix.height = rectBrix.height * dprBrix;
      canvasBrix.style.width = `${rectBrix.width}px`;
      canvasBrix.style.height = `${rectBrix.height}px`;
      ctxBrix.scale(dprBrix, dprBrix);

      const labels = this.fixedHours;
      const brixData = this.mapDataToFixedHours('BRIX MIEL FINAL');

      this.chartBrix = new Chart(ctxBrix, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Brix Miel Final',
              data: brixData,
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
              title: {
                display: true,
                text: 'Brix (%)'
              }
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
                label: (context: any) => {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y !== null ? context.parsed.y.toFixed(2) : 'N/D';
                  return `${label}: ${value}%`;
                },
                afterLabel: (context: any) => {
                  const hour = labels[context.dataIndex];
                  const dataItem = this.findDataItemByHour(hour);
                  
                  if (!dataItem) return 'No hay datos para esta hora';
                  
                  return [
                    `─────────────────────`,
                    `Hora: ${hour}`,
                    `Justificación:`,
                    `${dataItem.JUSTIFICACION_BRIX || 'No hay justificación registrada'}`
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
            }
          }
        }
      });

      // Gráfico de Pureza
      const canvasPureza = this.chartCanvasPureza.nativeElement;
      const ctxPureza = canvasPureza.getContext('2d');
      
      if (!ctxPureza) {
        throw new Error('No se pudo obtener el contexto del canvas para Pureza');
      }
      
      const dprPureza = window.devicePixelRatio || 1;
      const rectPureza = canvasPureza.getBoundingClientRect();
      
      canvasPureza.width = rectPureza.width * dprPureza;
      canvasPureza.height = rectPureza.height * dprPureza;
      canvasPureza.style.width = `${rectPureza.width}px`;
      canvasPureza.style.height = `${rectPureza.height}px`;
      ctxPureza.scale(dprPureza, dprPureza);

      const purezaData = this.mapDataToFixedHours('PZA MIEL FINAL');

      this.chartPureza = new Chart(ctxPureza, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Pureza Miel Final',
              data: purezaData,
              backgroundColor: 'rgba(153, 102, 255, 0.7)',
              borderColor: 'rgba(153, 102, 255, 1)',
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
              title: {
                display: true,
                text: 'Pureza (%)'
              }
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
                label: (context: any) => {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y !== null ? context.parsed.y.toFixed(2) : 'N/D';
                  return `${label}: ${value}%`;
                },
                afterLabel: (context: any) => {
                  const hour = labels[context.dataIndex];
                  const dataItem = this.findDataItemByHour(hour);
                  
                  if (!dataItem) return 'No hay datos para esta hora';
                  
                  return [
                    `─────────────────────`,
                    `Hora: ${hour}`,
                    `Justificación:`,
                    `${dataItem.JUSTIFICACION_MIEL || 'No hay justificación registrada'}`
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
            }
          }
        }
      });

    } catch (error) {
      console.error('Error al crear los gráficos:', error);
      this.apiConnectionStatus = 'Error al renderizar los gráficos';
      this.errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    }
  }

  private mapDataToFixedHours(dataField: string): (number | null)[] {
    return this.fixedHours.map(hour => {
      const dataItem = this.findDataItemByHour(hour);
      if (!dataItem || dataItem[dataField] === null || dataItem[dataField] === undefined) {
        return null;
      }
      return parseFloat(dataItem[dataField]);
    });
  }

  private findDataItemByHour(hour: string): any | null {
    const targetMinutes = this.timeToMinutes(hour);
    let closestItem = null;
    let smallestDiff = Infinity;

    for (const item of this.filteredData) {
      const itemMinutes = this.timeToMinutes(item.HORA_ORIGINAL);
      const diff = Math.abs(itemMinutes - targetMinutes);
      
      if (diff < 30 && diff < smallestDiff) {
        smallestDiff = diff;
        closestItem = item;
      }
    }

    return closestItem;
  }

  public updateCharts(): void {
    if (!this.chartBrix || !this.chartPureza) return;
  
    this.chartBrix.data.datasets[0].data = this.mapDataToFixedHours('BRIX MIEL FINAL');
    this.chartPureza.data.datasets[0].data = this.mapDataToFixedHours('PZA MIEL FINAL');
  
    this.chartBrix.update();
    this.chartPureza.update();

    this.calculateAverages();
  }

  private destroyCharts(): void {
    if (this.chartBrix) {
      this.chartBrix.destroy();
      this.chartBrix = null;
    }
    if (this.chartPureza) {
      this.chartPureza.destroy();
      this.chartPureza = null;
    }
  }

  refreshData(): void {
    this.apiConnectionStatus = 'Verificando conexión...';
    this.errorMessage = '';
    this.dataLoaded = false;
    this.checkApiConnection();
  }
}