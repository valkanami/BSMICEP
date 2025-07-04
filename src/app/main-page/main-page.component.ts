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
import { BagazoComponent } from '../components/bagazo/bagazo.component';
import { ImbibicionComponent } from '../components/imbibicion/imbibicion.component';
import { ReductoresComponent } from '../components/reductores/reductores.component';
import { PhClaroFiltradoComponent } from '../components/ph-claro-filtrado/ph-claro-filtrado.component';
import { PhDesmenuzadoMezcladoComponent } from '../components/ph-desmenuzado-mezclado/ph-desmenuzado-mezclado.component';
import { PhPromedioComponent } from '../components/ph-promedio/ph-promedio.component';
import { ReductoresClaroMeladuraComponent } from '../components/reductores-claro-meladura/reductores-claro-meladura.component';
import { ReductoresPromedioComponent } from '../components/reductores-promedio/reductores-promedio.component';
import { BrixMeladuraComponent } from '../components/brix-meladura/brix-meladura.component';
import { PurezaMielFinalComponent } from '../components/pureza-miel-final/pureza-miel-final.component';
import { MolidaProduccionComponent } from '../components/molida-produccion/molida-produccion.component';
import { MolidaRendimientoComponent } from '../components/molida-rendimiento/molida-rendimiento.component';
import { SedimentosComponent } from '../components/sedimentos/sedimentos.component';
import { PurezaJugoComponent } from '../components/pureza-jugo/pureza-jugo.component';
import { RendimientoCristalesDiaComponent } from '../components/rendimiento-cristales-dia/rendimiento-cristales-dia.component';
import { ColorComponent } from '../components/color/color.component';
import { BxPzaMielFinalComponent } from '../components/bx-pza-miel-final/bx-pza-miel-final.component';
import { ColorFcrComponent } from '../components/color-fcr/color-fcr.component';
import { DextranasSolidosComponent } from '../components/dextranas-solidos/dextranas-solidos.component';
import { PhFcrComponent } from '../components/ph-fcr/ph-fcr.component';
import { TonVaporCanaComponent } from '../components/ton-vapor-cana/ton-vapor-cana.component';
import { TurbidezAzucarComponent } from '../components/turbidez-azucar/turbidez-azucar.component';
import { ClimaDiaComponent } from '../components/clima-dia/clima-dia.component';
import { ClimaSemanaComponent } from '../components/clima-semana/clima-semana.component';
import { EficienciaFabricaComponent } from '../components/eficiencia-fabrica/eficiencia-fabrica.component';
import { CachazaCanaComponent } from '../components/cachaza-cana/cachaza-cana.component';
import { CanaMolidaComponent } from '../components/cana-molida/cana-molida.component';
import { DextranasBrixComponent } from '../components/dextranas-brix/dextranas-brix.component';
import { PerdidasCanaComponent } from '../components/perdidas-cana/perdidas-cana.component';
import { PolCanaComponent } from '../components/pol-cana/pol-cana.component';
import { PzaJugoMezcladoTierraComponent } from '../components/pza-jugo-mezclado-tierra/pza-jugo-mezclado-tierra.component';
import { CortadoresComponent } from '../components/cortadores/cortadores.component';
import { FrescuraHoraComponent } from '../components/frescura-hora/frescura-hora.component';
import { PerdidasCosechamientoComponent } from '../components/perdidas-cosechamiento/perdidas-cosechamiento.component';
import { PhAcmComponent } from '../components/ph-acm/ph-acm.component';
import { PhTratadoComponent } from '../components/ph-tratado/ph-tratado.component';
import { MasaCocidaComponent } from '../components/masa-cocida/masa-cocida.component';
import { RendimientoCristalesSemanaComponent } from '../components/rendimiento-cristales-semana/rendimiento-cristales-semana.component';
import { RecirculacionComponent } from '../components/recirculacion/recirculacion.component';


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
    MoliendaComponent,
    BagazoComponent,
    ImbibicionComponent,
    ReductoresComponent,
    PhClaroFiltradoComponent,
    PhDesmenuzadoMezcladoComponent,
    PhPromedioComponent,
    ReductoresClaroMeladuraComponent,
    ReductoresPromedioComponent,
    BrixMeladuraComponent,
    PurezaMielFinalComponent,
    MolidaProduccionComponent,
    MolidaRendimientoComponent,
    SedimentosComponent,
    PurezaJugoComponent,
    RendimientoCristalesDiaComponent,
    ColorComponent,
    BxPzaMielFinalComponent,
    ColorFcrComponent,
    DextranasSolidosComponent,
    PhFcrComponent,
    TonVaporCanaComponent,
    TurbidezAzucarComponent,
    ClimaDiaComponent,
    ClimaSemanaComponent,
    EficienciaFabricaComponent,
    CachazaCanaComponent,
    CanaMolidaComponent,
    DextranasBrixComponent,
    PerdidasCanaComponent,
    PolCanaComponent,
    PzaJugoMezcladoTierraComponent,
    CortadoresComponent,
    FrescuraHoraComponent,
    PerdidasCosechamientoComponent,
    PhAcmComponent,
    PhTratadoComponent,
    MasaCocidaComponent,
    RendimientoCristalesSemanaComponent,
    RecirculacionComponent,
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