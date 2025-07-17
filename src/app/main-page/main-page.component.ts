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
import { ComparativoAblComponent } from '../components/comparativo-abl/comparativo-abl.component';
import { ComparativoTonSolidosComponent } from '../components/comparativo-ton-solidos/comparativo-ton-solidos.component';
import { ConsumoBagazoAstillaComponent } from '../components/consumo-bagazo-astilla/consumo-bagazo-astilla.component';
import { ConsumoAguaM3Component } from '../components/consumo-agua-m3/consumo-agua-m3.component';
import { ConsumoAguaLtsComponent } from '../components/consumo-agua-lts/consumo-agua-lts.component';
import { ConsumoGralAguaComponent } from '../components/consumo-gral-agua/consumo-gral-agua.component';
import { DescargaGralAguaComponent } from '../components/descarga-gral-agua/descarga-gral-agua.component';
import { PolDescargaFabricaComponent } from '../components/pol-descarga-fabrica/pol-descarga-fabrica.component';
import { PhDescargaFabricaComponent } from '../components/ph-descarga-fabrica/ph-descarga-fabrica.component';
import { PolAguaTorreComponent } from '../components/pol-agua-torre/pol-agua-torre.component';
import { PhAguaTorreComponent } from '../components/ph-agua-torre/ph-agua-torre.component';
import { TonPolPerdidasComponent } from '../components/ton-pol-perdidas/ton-pol-perdidas.component';
import { FrescuraRsdComponent } from '../components/frescura-rsd/frescura-rsd.component';
import { TonCanaImbibicionComponent } from '../components/ton-cana-imbibicion/ton-cana-imbibicion.component';
import { CanaMayorComponent } from '../components/cana-mayor/cana-mayor.component';
import { CanaAccidentadaComponent } from '../components/cana-accidentada/cana-accidentada.component';
import { CanaCorralonComponent } from '../components/cana-corralon/cana-corralon.component';
import { FibraPolComponent } from '../components/fibra-pol/fibra-pol.component';
import { TonPolCachazaComponent } from '../components/ton-pol-cachaza/ton-pol-cachaza.component';
import { ColorIcumsaComponent } from '../components/color-icumsa/color-icumsa.component';
import { SilosComponent } from '../components/silos/silos.component';
import { TamanoGranoComponent } from '../components/tamano-grano/tamano-grano.component';
import { ReporteCosechaComponent } from '../components/reporte-cosecha/reporte-cosecha.component';
import { RangosFrescuraComponent } from '../components/rangos-frescura/rangos-frescura.component';
import { TablaFrescuraComponent } from '../components/tabla-frescura/tabla-frescura.component';
import { ReporteCanaAccidentalComponent } from '../components/reporte-cana-accidental/reporte-cana-accidental.component';
import { RezasurinaComponent } from '../components/rezasurina/rezasurina.component';
import { ColumnasCarbonComponent } from '../components/columnas-carbon/columnas-carbon.component';
import { TablaRendimientoCyrComponent } from '../components/tabla-rendimiento-cyr/tabla-rendimiento-cyr.component';
import { CalidadAzucarComponent } from '../components/calidad-azucar/calidad-azucar.component';
import { DatosCalderasComponent } from '../components/datos-calderas/datos-calderas.component';
import { CalderasDatosDiaComponent } from '../components/calderas-datos-dia/calderas-datos-dia.component';
import { RellenoTorreComponent } from '../components/relleno-torre/relleno-torre.component';
import { TanqueComponent } from '../components/tanque/tanque.component';  
import { ComparativoBbComponent } from '../components/comparativo-bb/comparativo-bb.component';
import { ConsumoMedidorComponent } from '../components/consumo-medidor/consumo-medidor.component';
import { MuestreoComponent } from '../components/muestreo/muestreo.component';
import { DatosCanaComponent } from '../components/datos-cana/datos-cana.component';
import { CachazaClarificadoresComponent } from '../components/cachaza-clarificadores/cachaza-clarificadores.component';
import { RendimientoTurnoComponent } from '../components/rendimiento-turno/rendimiento-turno.component';
import { ProduccionFnComponent } from '../components/produccion-fn/produccion-fn.component';
import { ProduccionOficialComponent } from '../components/produccion-oficial/produccion-oficial.component';
import { AzucarRefundidaComponent } from '../components/azucar-refundida/azucar-refundida.component';
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
    ComparativoAblComponent,
    ComparativoTonSolidosComponent,
    ConsumoBagazoAstillaComponent,
    ConsumoAguaM3Component,
    ConsumoAguaLtsComponent,
    ConsumoGralAguaComponent,
    DescargaGralAguaComponent,
    PolDescargaFabricaComponent,
    PhDescargaFabricaComponent,
    PolAguaTorreComponent,
    PhAguaTorreComponent,
    TonPolPerdidasComponent,
    FrescuraRsdComponent,
    TonCanaImbibicionComponent,
    CanaMayorComponent,
    CanaAccidentadaComponent,
    CanaCorralonComponent,
    FibraPolComponent,
    TonPolCachazaComponent,
    ColorIcumsaComponent,
    SilosComponent,
    TamanoGranoComponent,
    ReporteCosechaComponent,
    RangosFrescuraComponent,
    TablaFrescuraComponent,
    ReporteCanaAccidentalComponent,
    RezasurinaComponent,
    ColumnasCarbonComponent,
    TablaRendimientoCyrComponent,
    CalidadAzucarComponent,
    DatosCalderasComponent,
    CalderasDatosDiaComponent,
    RellenoTorreComponent,
    TanqueComponent,
    ComparativoBbComponent,
    ConsumoMedidorComponent,
    MuestreoComponent,
    DatosCanaComponent,
    CachazaClarificadoresComponent,
    RendimientoTurnoComponent,
    ProduccionFnComponent,
    ProduccionOficialComponent,
    AzucarRefundidaComponent,

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