import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { TurbidezJugoClaroComponent } from '../turbidez-jugo-claro/turbidez-jugo-claro.component';
import { RsdComponent } from '../rsd/rsd.component';
import { RendimientoCristalesComponent } from '../rendimiento-cristales/rendimiento-cristales.component';
import { MoliendaComponent } from '../molienda/molienda.component';
import { BagazoComponent } from '../bagazo/bagazo.component';
import { ImbibicionComponent } from '../imbibicion/imbibicion.component';
import { ReductoresComponent } from '../reductores/reductores.component';
import { PhClaroFiltradoComponent } from '../ph-claro-filtrado/ph-claro-filtrado.component';
import { PhDesmenuzadoMezcladoComponent } from '../ph-desmenuzado-mezclado/ph-desmenuzado-mezclado.component';
import { PhPromedioComponent } from '../ph-promedio/ph-promedio.component';
import { ReductoresClaroMeladuraComponent } from '../reductores-claro-meladura/reductores-claro-meladura.component';
import { ReductoresPromedioComponent } from '../reductores-promedio/reductores-promedio.component';
import { BrixMeladuraComponent } from '../brix-meladura/brix-meladura.component';
import { PurezaMielFinalComponent } from '../pureza-miel-final/pureza-miel-final.component';
import { MolidaProduccionComponent } from '../molida-produccion/molida-produccion.component';
import { MolidaRendimientoComponent } from '../molida-rendimiento/molida-rendimiento.component';
import { SedimentosComponent } from '../sedimentos/sedimentos.component';
import { PurezaJugoComponent } from '../pureza-jugo/pureza-jugo.component';
import { RendimientoCristalesDiaComponent } from '../rendimiento-cristales-dia/rendimiento-cristales-dia.component';
import { ColorComponent } from '../color/color.component';
import { BxPzaMielFinalComponent } from '../bx-pza-miel-final/bx-pza-miel-final.component';
import { ColorFcrComponent } from '../color-fcr/color-fcr.component';
import { DextranasSolidosComponent } from '../dextranas-solidos/dextranas-solidos.component';
import { PhFcrComponent } from '../ph-fcr/ph-fcr.component';
import { TonVaporCanaComponent } from '../ton-vapor-cana/ton-vapor-cana.component';
import { TurbidezAzucarComponent } from '../turbidez-azucar/turbidez-azucar.component';
import { ClimaDiaComponent } from '../clima-dia/clima-dia.component';
import { ClimaSemanaComponent } from '../clima-semana/clima-semana.component';
import { EficienciaFabricaComponent } from '../eficiencia-fabrica/eficiencia-fabrica.component';
import { CachazaCanaComponent } from '../cachaza-cana/cachaza-cana.component';
import { CanaMolidaComponent } from '../cana-molida/cana-molida.component';
import { DextranasBrixComponent } from '../dextranas-brix/dextranas-brix.component';
import { PerdidasCanaComponent } from '../perdidas-cana/perdidas-cana.component';
import { PolCanaComponent } from '../pol-cana/pol-cana.component';
import { PzaJugoMezcladoTierraComponent } from '../pza-jugo-mezclado-tierra/pza-jugo-mezclado-tierra.component';
import { CortadoresComponent } from '../cortadores/cortadores.component';
import { FrescuraHoraComponent } from '../frescura-hora/frescura-hora.component';
import { PerdidasCosechamientoComponent } from '../perdidas-cosechamiento/perdidas-cosechamiento.component';
import { PhAcmComponent } from '../ph-acm/ph-acm.component';
import { PhTratadoComponent } from '../ph-tratado/ph-tratado.component';
import { MasaCocidaComponent } from '../masa-cocida/masa-cocida.component';
import { RendimientoCristalesSemanaComponent } from '../rendimiento-cristales-semana/rendimiento-cristales-semana.component';
import { RecirculacionComponent } from '../recirculacion/recirculacion.component';
import { ComparativoAblComponent } from '../comparativo-abl/comparativo-abl.component';
import { ComparativoTonSolidosComponent } from '../comparativo-ton-solidos/comparativo-ton-solidos.component';
import { ConsumoBagazoAstillaComponent } from '../consumo-bagazo-astilla/consumo-bagazo-astilla.component';
import { ConsumoAguaM3Component } from '../consumo-agua-m3/consumo-agua-m3.component';
import { ConsumoAguaLtsComponent } from '../consumo-agua-lts/consumo-agua-lts.component';
import { ConsumoGralAguaComponent } from '../consumo-gral-agua/consumo-gral-agua.component';
import { DescargaGralAguaComponent } from '../descarga-gral-agua/descarga-gral-agua.component';
import { PolDescargaFabricaComponent } from '../pol-descarga-fabrica/pol-descarga-fabrica.component';
import { PhDescargaFabricaComponent } from '../ph-descarga-fabrica/ph-descarga-fabrica.component';
import { PolAguaTorreComponent } from '../pol-agua-torre/pol-agua-torre.component';
import { PhAguaTorreComponent } from '../ph-agua-torre/ph-agua-torre.component';
import { TonPolPerdidasComponent } from '../ton-pol-perdidas/ton-pol-perdidas.component';
import { FrescuraRsdComponent } from '../frescura-rsd/frescura-rsd.component';
import { TonCanaImbibicionComponent } from '../ton-cana-imbibicion/ton-cana-imbibicion.component';
import { CanaMayorComponent } from '../cana-mayor/cana-mayor.component';
import { CanaAccidentadaComponent } from '../cana-accidentada/cana-accidentada.component';
import { CanaCorralonComponent } from '../cana-corralon/cana-corralon.component';
import { FibraPolComponent } from '../fibra-pol/fibra-pol.component';
import { TonPolCachazaComponent } from '../ton-pol-cachaza/ton-pol-cachaza.component';
import { ColorIcumsaComponent } from '../color-icumsa/color-icumsa.component';
import { SilosComponent } from '../silos/silos.component';
import { TamanoGranoComponent } from '../tamano-grano/tamano-grano.component';
import { ReporteCosechaComponent } from '../reporte-cosecha/reporte-cosecha.component';
import { RangosFrescuraComponent } from '../rangos-frescura/rangos-frescura.component';
import { TablaFrescuraComponent } from '../tabla-frescura/tabla-frescura.component';
import { ReporteCanaAccidentalComponent } from '../reporte-cana-accidental/reporte-cana-accidental.component';
import { RezasurinaComponent } from '../rezasurina/rezasurina.component';
import { ColumnasCarbonComponent } from '../columnas-carbon/columnas-carbon.component';
import { TablaRendimientoCyrComponent } from '../tabla-rendimiento-cyr/tabla-rendimiento-cyr.component';
import { CalidadAzucarComponent } from '../calidad-azucar/calidad-azucar.component';
import { DatosCalderasComponent } from '../datos-calderas/datos-calderas.component';
import { CalderasDatosDiaComponent } from '../calderas-datos-dia/calderas-datos-dia.component';
import { RellenoTorreComponent } from '../relleno-torre/relleno-torre.component';
import { TanqueComponent } from '../tanque/tanque.component';
import { ComparativoBbComponent } from '../comparativo-bb/comparativo-bb.component';
import { ConsumoMedidorComponent } from '../consumo-medidor/consumo-medidor.component';
import { MuestreoComponent } from '../muestreo/muestreo.component';
import { DatosCanaComponent } from '../datos-cana/datos-cana.component';
import { CachazaClarificadoresComponent } from '../cachaza-clarificadores/cachaza-clarificadores.component';
import { RendimientoTurnoComponent } from '../rendimiento-turno/rendimiento-turno.component';
import { ProduccionFnComponent } from '../produccion-fn/produccion-fn.component';
import { ProduccionOficialComponent } from '../produccion-oficial/produccion-oficial.component';
import { AzucarRefundidaComponent } from '../azucar-refundida/azucar-refundida.component';
import { InicioComponent } from '../inicio/inicio.component';
import { ProductosQuimicosComponent } from '../productos-quimicos/productos-quimicos.component';
import { CondensadosImpurosComponent } from '../condensados-impuros/condensados-impuros.component';

@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [
    CommonModule,
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
    InicioComponent,
    ProductosQuimicosComponent,
    CondensadosImpurosComponent
  ],
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  isGeneratingResult = false;
  showComponents = false;
  progressMessage = '';

  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * Extrae los estilos computados y los inyecta en línea en el SVG
   * Esto asegura que Highcharts conserve sus colores, textos y proporciones
   * cuando lo serializamos directamente, sin necesidad de html2canvas.
   */
  private inlineSvgStyles(svgNode: SVGElement) {
    const iter = document.createNodeIterator(svgNode, NodeFilter.SHOW_ELEMENT, null);
    let currentNode: Node | null;

    while (currentNode = iter.nextNode()) {
      if (currentNode instanceof SVGElement) {
        const element = currentNode as SVGElement;
        const computedStyle = window.getComputedStyle(element);
        // Propiedades críticas de Highcharts
        const propsToCopy = [
          'fill', 'stroke', 'stroke-width', 'font-family', 'font-size', 
          'font-weight', 'color', 'opacity', 'visibility'
        ];
        
        propsToCopy.forEach(prop => {
          const value = computedStyle.getPropertyValue(prop);
          if (value && value !== 'none' && value !== '') {
            element.style.setProperty(prop, value);
          }
        });
      }
    }
  }

  /**
   * Convierte un SVG a Canvas casi instantáneamente (1-5ms)
   */
  private fastSvgToCanvas(svgElement: SVGElement, wrapperWidth: number, wrapperHeight: number): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      try {
        const svgClone = svgElement.cloneNode(true) as SVGElement;
        
        // Incrustar propiedades CSS (colores, fuentes) para que Highcharts no se vea transparente
        this.inlineSvgStyles(svgClone);
        
        svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgClone.setAttribute('width', wrapperWidth.toString());
        svgClone.setAttribute('height', wrapperHeight.toString());

        const svgData = new XMLSerializer().serializeToString(svgClone);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Escala x2 para alta nitidez en el PDF
          canvas.width = wrapperWidth * 2;
          canvas.height = wrapperHeight * 2;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff'; // Fondo blanco puro
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0, wrapperWidth, wrapperHeight);
          }
          URL.revokeObjectURL(url);
          resolve(canvas);
        };
        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(e);
        };
        img.src = url;
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Captura un componente de Angular.
   * Si detecta SVG (Highcharts), usa la conversión nativa (ultrarrápida).
   * Si no (tablas, texto), hace fallback a html2canvas.
   */
  private async captureBlock(el: HTMLElement): Promise<{canvas: HTMLCanvasElement | null, height: number, width: number}> {
    const rect = el.getBoundingClientRect();
    const svg = el.querySelector('svg');
    
    // Si contiene un SVG grande (gráfica), convertimos directamente el SVG
    if (svg && rect.height > 50) {
      try {
        const canvas = await this.fastSvgToCanvas(svg, rect.width, rect.height);
        return { canvas, height: rect.height, width: rect.width };
      } catch (e) {
        console.warn('Fallback a html2canvas por fallo en SVG', e);
      }
    }

    // Fallback: Es una tabla, o el SVG nativo falló. Usar html2canvas en muy baja resolución (ultrarrápido).
    const canvas = await html2canvas(el, {
      scale: 0.5, // Reducido drásticamente para máxima velocidad
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    return { canvas, height: rect.height, width: rect.width };
  }

  async generatePDF() {
    if (this.isGeneratingResult) return;
    this.isGeneratingResult = true;
    this.showComponents = true;
    this.progressMessage = 'Cargando datos en memoria (estimado: 2.5s)...';
    this.cdr.detectChanges();

    // Reducido a 2.5s para no hacer esperar tanto al usuario
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const elements = Array.from(document.querySelectorAll('.components-grid > *')) as HTMLElement[];
      if (elements.length === 0) throw new Error('No se encontraron componentes');

      this.progressMessage = 'Generando capturas ultrarrápidas...';
      this.cdr.detectChanges();

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginX = 10;
      const marginY = 10;
      const availableWidth = pdfWidth - (marginX * 2);
      let currentY = marginY;

      // Iteramos rápido 
      for (let i = 0; i < elements.length; i++) {
        this.progressMessage = `Convirtiendo ${i + 1} de ${elements.length}...`;
        this.cdr.detectChanges();
        
        // Respiro de CPU de 1ms
        await new Promise(resolve => setTimeout(resolve, 1));

        const result = await this.captureBlock(elements[i]);
        if (!result.canvas || result.canvas.width === 0) continue;

        const imgData = result.canvas.toDataURL('image/jpeg', 0.5); // 50% compresión
        const renderWidth = availableWidth;
        const renderHeight = (result.canvas.height * renderWidth) / result.canvas.width;

        // Paginación si la imagen no cabe
        if (currentY + renderHeight > pageHeight - marginY && currentY !== marginY) {
          pdf.addPage();
          currentY = marginY;
        }

        // Título del componente (opcional para legibilidad)
        const tagName = elements[i].tagName.toLowerCase().replace('app-', '').replace(/-/g, ' ').toUpperCase();
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text(tagName, marginX, currentY - 2);

        pdf.addImage(imgData, 'JPEG', marginX, currentY, renderWidth, renderHeight);
        currentY += renderHeight + 10; // Margen inferior
      }

      this.progressMessage = 'Guardando documento PDF...';
      this.cdr.detectChanges();
      pdf.save('Reporte_General_BSMICEP.pdf');
      this.progressMessage = '¡El PDF está listo!';
    } catch (error) {
      console.error('Error al generar PDF', error);
      this.progressMessage = 'Hubo un error al generar el PDF.';
    } finally {
      this.cdr.detectChanges();
      setTimeout(() => {
        this.isGeneratingResult = false;
        this.showComponents = false;
        this.progressMessage = '';
        this.cdr.detectChanges();
      }, 3000);
    }
  }
}
