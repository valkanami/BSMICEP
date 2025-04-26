import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart, ChartModule } from 'angular-highcharts';
import { catchError, of } from 'rxjs';
import type { XAxisOptions } from 'highcharts';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ChartModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  chart!: Chart;
  apiStatus: 'testing' | 'connected' | 'error' = 'testing';
  errorMessage: string = '';
  data: any[] = [];

  phClaroLimits = { min: 7, max: 0 };
  phFiltradoLimits = { min: 7.5, max: 0 };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.testApiConnection();
  }

  testApiConnection(): void {
    this.http.get<any[]>('http://localhost:3000/api/phclarofiltrado')
      .pipe(
        catchError(error => {
          this.apiStatus = 'error';
          this.errorMessage = 'Error connecting to API: ' + error.message;
          console.error('API connection error:', error);
          return of([]);
        })
      )
      .subscribe(data => {
        if (data.length > 0) {
          this.apiStatus = 'connected';
          this.data = data;
          console.log('Datos recibidos:', data);
          this.createChart();
        } else {
          this.apiStatus = 'error';
          this.errorMessage = 'API responded but no data available';
        }
      });
  }

  createChart(): void {
    
    const sampleDate = this.data[0]?.Hora;
    console.log('Formato de hora recibido:', sampleDate);

    
    const categories = this.data.map(item => {
      
      if (typeof item.Hora === 'string' && item.Hora.match(/^\d{2}:\d{2}:\d{2}$/)) {
        return item.Hora;
      }
      
      
      if (typeof item.Hora === 'string' && item.Hora.includes('T')) {
        return item.Hora.split('T')[1].split('.')[0];
      }
      
      
      const date = new Date(item.Hora);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[1].split('.')[0];
      }
      
      
      console.warn('Formato de hora no reconocido:', item.Hora);
      return String(item.Hora);
    });

    const phClaroData = this.data.map(item => item.PHClaro);
    const phFiltradoData = this.data.map(item => item.PHFiltrado);

    
    const xAxisOptions: XAxisOptions = {
      categories: categories,
      title: { text: 'Hora' },
      crosshair: true,
      labels: {
        formatter: function() {
          
          return String(this.value);
        }
      }
    };

    this.chart = new Chart({
      chart: {
        type: 'line',
        zooming: {
          type: 'xy'
        }
      },
      title: {
        text: 'PH Claro y Filtrado'
      },
      xAxis: xAxisOptions,
      yAxis: {
        title: { text: 'PH Value' },
        crosshair: true,
        plotLines: this.createPlotLines()
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function() {
          const points = (this as any).points || [];
          return `<b>${this.x}</b><br/>` +
            points.map((point: any) => 
              `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y?.toFixed(2) ?? 'N/A'}</b>`
            ).join('<br/>');
        }
      },
      plotOptions: {
        series: {
          marker: { radius: 4 }
        }
      },
      series: [
        {
          name: 'PH Claro',
          type: 'line',
          data: phClaroData,
          color: '#36a2eb',
          marker: { symbol: 'circle' },
          zIndex: 1
        },
        {
          name: 'PH Filtrado',
          type: 'line',
          data: phFiltradoData,
          color: '#47e1e1',
          marker: { symbol: 'square' },
          zIndex: 1
        }
      ],
      credits: { enabled: false }
    });
  }

  private createPlotLines(): any[] {
    return [
      {
        value: this.phClaroLimits.min,
        color: '#36a2eb',
        width: 2,
        dashStyle: 'Dash',
        label: {
          text: `PH Claro (${this.phClaroLimits.min})`,
          align: 'right',
          style: { color: '#36a2eb' }
        }
      },
      {
        value: this.phClaroLimits.max,
        color: '#36a2eb',
        width: 2,
        dashStyle: 'Dash',
        label: {
          text: `PH Claro (${this.phClaroLimits.max})`,
          align: 'right',
          style: { color: '#36a2eb' }
        }
      },
      {
        value: this.phFiltradoLimits.min,
        color: '#47e1e1',
        width: 2,
        dashStyle: 'Dash',
        label: {
          text: `PH Filtrado (${this.phFiltradoLimits.min})`,
          align: 'right',
          style: { color: '#47e1e1' }
        }
      },
      {
        value: this.phFiltradoLimits.max,
        color: '#33FF57',
        width: 2,
        dashStyle: 'Dash',
        label: {
          text: `PH Filtrado (${this.phFiltradoLimits.max})`,
          align: 'right',
          style: { color: '#47e1e1' }
        }
      }
    ];
  }

  refreshData(): void {
    this.apiStatus = 'testing';
    this.testApiConnection();
  }
}