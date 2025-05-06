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
  openMenus: {[key: string]: boolean} = {
    prueba: false,
    clima: false
  };
  isSidebarHidden = false;
  sidebarWidth = 220;

  /**
   * Muestra el componente seleccionado sin cerrar los menús
   */
  showChart(chartType: string): void {
    this.currentChart = chartType;
    if (window.innerWidth < 768) {
      this.toggleSidebarWithDelay();
    }
  }

  /**
   * Alterna el estado de un menú desplegable con delay para mejor animación
   */
  toggleMenu(menuKey: string): void {
    if (!this.openMenus[menuKey]) {
      setTimeout(() => {
        this.openMenus[menuKey] = true;
      }, 10);
    } else {
      this.openMenus[menuKey] = false;
    }
  }

  /**
   * Verifica si un menú está abierto
   */
  isMenuOpen(menuKey: string): boolean {
    return this.openMenus[menuKey] || false;
  }

  /**
   * Alterna la barra lateral con delay para mejor experiencia
   */
  toggleSidebar(): void {
    if (this.isSidebarHidden) {
      setTimeout(() => {
        this.isSidebarHidden = false;
      }, 50);
    } else {
      this.isSidebarHidden = true;
    }
  }

  /**
   * Alterna la barra lateral con un pequeño delay
   */
  private toggleSidebarWithDelay(): void {
    setTimeout(() => {
      this.toggleSidebar();
    }, 100);
  }

  /**
   * Cierra todos los menús desplegables
   */
  private closeAllMenus(): void {
    Object.keys(this.openMenus).forEach(key => {
      this.openMenus[key] = false;
    });
  }

  /**
   * Cierra otros menús excepto el especificado
   */
  private closeOtherMenus(menuKey: string): void {
    Object.keys(this.openMenus).forEach(key => {
      if (key !== menuKey) {
        this.openMenus[key] = false;
      }
    });
  }
}