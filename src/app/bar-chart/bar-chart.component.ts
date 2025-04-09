import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  public chart: any;
  public apiConnectionStatus: string = 'Verificando conexión...';
  public data: any[] = [];

  constructor(private http: HttpClient) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.checkApiConnection();
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  checkApiConnection(): void {
    this.http.get('http://localhost:3000/api/polEnCana').subscribe({
      next: (response) => {
        this.apiConnectionStatus = '✅ Conexión exitosa con la API';
        this.data = response as any[];
        this.initChart();
      },
      error: (error) => {
        this.apiConnectionStatus = '❌ Error al conectar con la API: ' + error.message;
        console.error('Error:', error);
      }
    });
  }

  initChart(): void {
    
    setTimeout(() => {
      try {
        this.destroyChart();
        
        const ctx = this.chartCanvas.nativeElement.getContext('2d');
        if (!ctx) {
          throw new Error('No se pudo obtener el contexto del canvas');
        }

        const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        const values = days.map(day => this.data[0]?.[day.toLowerCase()] || 0);

        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: days,
            datasets: [{
              label: 'Valores por día',
              data: values,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      } catch (error) {
        console.error('Error al crear el gráfico:', error);
        this.apiConnectionStatus = '❌ Error al renderizar el gráfico';
      }
    });
  }

  destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}