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
import { TurbidezJugoClaroComponent } from '../components/turbidez-jugo-claro/turbidez-jugo-claro.component';
import { RsdComponent } from '../components/rsd/rsd.component';
import { RendimientoCristalesComponent } from '../components/rendimiento-cristales/rendimiento-cristales.component';
import { MoliendaComponent } from '../components/molienda/molienda.component';

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
    ClimaComponent,
    TurbidezJugoClaroComponent,
    RsdComponent,
    RendimientoCristalesComponent,
    MoliendaComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  currentChart: string = 'bar';
  openMenus: {[key: string]: boolean} = {
    prueba: false,
    clima: false
  };
  isSidebarHidden = false;
  sidebarWidth = 220;

  
  showChart(chartType: string): void {
    this.currentChart = chartType;
    if (window.innerWidth < 768) {
      this.toggleSidebarWithDelay();
    }
  }

  
  toggleMenu(menuKey: string): void {
    if (!this.openMenus[menuKey]) {
      setTimeout(() => {
        this.openMenus[menuKey] = true;
      }, 10);
    } else {
      this.openMenus[menuKey] = false;
    }
  }

  
  isMenuOpen(menuKey: string): boolean {
    return this.openMenus[menuKey] || false;
  }

  
  toggleSidebar(): void {
    if (this.isSidebarHidden) {
      setTimeout(() => {
        this.isSidebarHidden = false;
      }, 50);
    } else {
      this.isSidebarHidden = true;
    }
  }

  
  private toggleSidebarWithDelay(): void {
    setTimeout(() => {
      this.toggleSidebar();
    }, 100);
  }

  
  private closeAllMenus(): void {
    Object.keys(this.openMenus).forEach(key => {
      this.openMenus[key] = false;
    });
  }

  
  private closeOtherMenus(menuKey: string): void {
    Object.keys(this.openMenus).forEach(key => {
      if (key !== menuKey) {
        this.openMenus[key] = false;
      }
    });
  }
}