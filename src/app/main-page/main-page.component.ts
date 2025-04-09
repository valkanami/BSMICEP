import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { ColumnChartComponent } from '../column-chart/column-chart.component';
import { ComboChartComponent } from '../combo-chart/combo-chart.component';
import { TableComponent } from '../table/table.component';
import { NewBarChartComponent } from '../new-bar-chart/new-bar-chart.component';
import { NewLineChartComponent } from '../new-line-chart/new-line-chart.component';
import { MultiChartComponent } from '../multi-chart/multi-chart.component';
import { NewTableComponent } from '../new-table/new-table.component'; 
import { StackedBarChartComponent } from '../stacked-bar-chart/stacked-bar-chart.component';
import { ClimaComponent } from '../clima/clima.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    BarChartComponent,
    LineChartComponent,
    ColumnChartComponent,
    ComboChartComponent,
    TableComponent,
    NewBarChartComponent,
    NewLineChartComponent,
    MultiChartComponent,
    NewTableComponent,
    StackedBarChartComponent,
    ClimaComponent
    
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  currentChart: string = 'bar';

  showChart(chartType: string) {
    this.currentChart = chartType;
  }
}