import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AnnotationOptions } from 'chartjs-plugin-annotation';
import annotationPlugin from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-new-line-chart',
  templateUrl: './new-line-chart.component.html',
  styleUrls: ['./new-line-chart.component.css']
})
export class NewLineChartComponent implements OnInit {

  public chart: any;
  public limit1: number = 6.5; 
  public limit2: number = 7; 
  public limit3: number = 7.5; 

  ngOnInit(): void {
    this.createChart();

    
    setTimeout(() => {
      this.updateLimits(6.5, 7, 7.5); 
    }, 5000);

    
    
  }

  createChart() {
    
    Chart.register(annotationPlugin);

    
    const annotation1: AnnotationOptions = {
      type: 'line',
      yMin: this.limit1,
      yMax: this.limit1,
      borderColor: 'rgb(48, 216, 14)', 
      borderWidth: 2,
      borderDash: [10, 5], 
      label: {
        content: `Límite 1: ${this.limit1}`,
        position: 'end',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#000',
        font: {
          size: 12
        }
      }
    };

    const annotation2: AnnotationOptions = {
      type: 'line',
      yMin: this.limit2,
      yMax: this.limit2,
      borderColor: 'rgb(255, 99, 132)', 
      borderWidth: 2,
      borderDash: [10, 5], 
      label: {
        content: `Límite 2: ${this.limit2}`,
        position: 'end',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#000',
        font: {
          size: 12
        }
      }
    };

    const annotation3: AnnotationOptions = {
      type: 'line',
      yMin: this.limit3,
      yMax: this.limit3,
      borderColor: 'rgb(54, 162, 235)', 
      borderWidth: 2,
      borderDash: [10, 5], 
      label: {
        content: `Límite 3: ${this.limit3}`,
        position: 'end',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#000',
        font: {
          size: 12
        }
      }
    };

    this.chart = new Chart("NewLineChart", {
      type: 'line', 
      data: {
        labels: [
          '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
          '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', 
          '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', 
          '03:00', '04:00', '05:00', '06:00'
        ], 
        datasets: [
          {
            label: "PH Meladura",
            data: [6.2, 6.2, 6.3, 6.3, 6.2, 6.3, 6.3, 6.3, 6.2, 6.3, 6.3, 6.2, 6.2, 6.2, 6.1, 6.1, 6.1, 6.2, 6.1, 6.1, 6.1, 6.1, 6.1, 6.2], 
            borderColor: 'rgb(48, 216, 14)', 
            borderWidth: 2,
            fill: false
          },
          {
            label: "PH Claro",
            data: [7.0, 7.1, 6.9, 6.8, 6.9, 7.2, 6.9, 6.8, 6.7, 6.9, 6.8, 6.9, 6.5, 6.8, 6.7, 6.5, 6.5, 6.7, 6.7, 6.6, 6.7, 6.7, 6.8, 6.9], 
            borderColor: 'rgb(255, 99, 132)', 
            borderWidth: 2,
            fill: false
          },
          {
            label: "PH Alcalizado",
            data: [7.8, 7.9, 8.0, 7.4, 8.3, 7.5, 8.2, 7.1, 7.7, 7.6, 7.7, 7.4, 7.5, 7.6, 7.6, 7.8, 7.8, 7.6, 7.7, 7.7, 7.6, 7.8, 7.8, 7.7], 
            borderColor: 'rgb(54, 162, 235)', 
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false 
            
          }
        },
        plugins: {
          annotation: {
            annotations: {
              line1: annotation1, 
              line2: annotation2, 
              line3: annotation3  
            }
          },
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }

  
  updateLimits(newLimit1: number, newLimit2: number, newLimit3: number) {
    this.limit1 = newLimit1;
    this.limit2 = newLimit2;
    this.limit3 = newLimit3;

    if (this.chart) {
      
      this.chart.options.plugins.annotation.annotations.line1.yMin = this.limit1;
      this.chart.options.plugins.annotation.annotations.line1.yMax = this.limit1;
      this.chart.options.plugins.annotation.annotations.line1.label.content = `Límite 1: ${this.limit1}`;

      this.chart.options.plugins.annotation.annotations.line2.yMin = this.limit2;
      this.chart.options.plugins.annotation.annotations.line2.yMax = this.limit2;
      this.chart.options.plugins.annotation.annotations.line2.label.content = `Límite 2: ${this.limit2}`;

      this.chart.options.plugins.annotation.annotations.line3.yMin = this.limit3;
      this.chart.options.plugins.annotation.annotations.line3.yMax = this.limit3;
      this.chart.options.plugins.annotation.annotations.line3.label.content = `Límite 3: ${this.limit3}`;

      
      this.chart.update();
    }
  }

  
  updateChartData(newDataMeladura: number[], newDataClaro: number[], newDataAlcalizado: number[]) {
    if (this.chart) {
      
      this.chart.data.datasets[0].data = newDataMeladura;
      this.chart.data.datasets[1].data = newDataClaro;
      this.chart.data.datasets[2].data = newDataAlcalizado;

      
      this.chart.update();
    }
  }
}