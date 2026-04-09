import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart, ChartModule } from 'angular-highcharts';
import { catchError, of, Subscription } from 'rxjs';
import { inject } from '@angular/core';
import { ChartSettingsService } from '../services/chart-settings.service';

@Component({
  selector: 'app-stacked-bar-chart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ChartModule],
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.css']
})
export class StackedBarChartComponent implements OnInit {
  chart!: Chart;
  apiStatus: 'testing' | 'connected' | 'error' = 'testing';
  errorMessage: string = '';
  data: any[] = [];
  
  private http = inject(HttpClient);
  private chartSettingsService = inject(ChartSettingsService);
  private labelsSubscription!: Subscription;
  showDataLabels: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.labelsSubscription = this.chartSettingsService.showLabels$.subscribe(value => {
      this.showDataLabels = value;
      if (this.data.length > 0) {
        this.createChart();
      }
    });
    this.testApiConnection();
  }

  ngOnDestroy(): void {
    if (this.labelsSubscription) {
      this.labelsSubscription.unsubscribe();
    }
  }

  testApiConnection(): void {
    this.http.get<any[]>('http://localhost:3000/api/perdidascosechamiento')
      .pipe(
        catchError(error => {
          this.apiStatus = 'error';
          this.errorMessage = 'Error conectando a la API: ' + error.message;
          console.error('API connection error:', error);
          return of([]);
        })
      )
      .subscribe(data => {
        if (data.length > 0) {
          this.apiStatus = 'connected';
          this.data = data;
          this.createChart();
        } else {
          this.apiStatus = 'error';
          this.errorMessage = 'La API respondió pero no hay datos disponibles';
        }
      });
  }

  createChart(): void {
    
    const categories = this.data.map(item => item.Dia);
    const perdidasData = this.data.map(item => item.PerdidaxCosecha);
    const polData = this.data.map(item => item.PolFabrica);

    this.chart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Pérdidas de Cosechamiento y Pol en Fábrica'
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Día'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Valores'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold'
          }
        }
      },
      legend: {
        reversed: true 
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        },
        column: {
          dataLabels: {
            enabled: this.showDataLabels,
            format: '{point.y:.2f}',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderWidth: 1,
            borderColor: '#333333',
            borderRadius: 4,
            padding: 4,
            style: {
              color: '#000000',
              fontWeight: 'bold',
              textOutline: 'none'
            }
          }
        }
      },
      series: [
        
        {
          name: 'Pol en Fábrica',
          type: 'column',
          data: polData,
          color: '#47e1e1'
        } as any,
        
        {
          name: 'Pérdida por Cosecha',
          type: 'column',
          data: perdidasData,
          color: '#36a2eb'
        } as any
      ],
      credits: {
        enabled: false
      }
    });
  }

  refreshData(): void {
    this.apiStatus = 'testing';
    this.testApiConnection();
  }
}