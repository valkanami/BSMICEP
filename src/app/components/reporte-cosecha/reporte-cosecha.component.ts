import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface DatoCosecha {
  zafra: string;
  fecha: string;
  apartado: string;
  categoria: string;
  dato: string;
  valor: number;
}

@Component({
  selector: 'app-reporte-cosecha',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './reporte-cosecha.component.html',
  styleUrls: ['./reporte-cosecha.component.css']
})
export class ReporteCosechaComponent implements OnInit {
  datos: DatoCosecha[] = [];
  datosFiltrados: DatoCosecha[] = [];
  cargando = true;
  error: string | null = null;

  // Filtros
  filtroZafra = '';
  filtroApartado = '';
  filtroCategoria = '';
  filtroFechaInicio = '';
  filtroFechaFin = '';

  // Paginación
  paginaActual = 1;
  itemsPorPagina = 10;
  totalItems = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.http.get<DatoCosecha[]>('http://localhost:3000/api/datostablas')
      .subscribe({
        next: (data) => {
          this.datos = data;
          this.aplicarFiltros();
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los datos';
          this.cargando = false;
          console.error('Error:', err);
          // Datos de ejemplo en caso de error
          this.datos = this.datosEjemplo();
          this.aplicarFiltros();
        }
      });
  }

  datosEjemplo(): DatoCosecha[] {
    return [
      // Datos de ejemplo según tu estructura
      { zafra: '2023-2024', fecha: '2023-11-01', apartado: 'Producción', categoria: 'Caña', dato: 'TONS CAÑA DIA ANTERIOR', valor: 8875.00 },
      { zafra: '2023-2024', fecha: '2023-11-01', apartado: 'Producción', categoria: 'Caña', dato: 'TONS CAÑA ENTREGADA', valor: 6570.25 },
      // Agrega más datos de ejemplo según sea necesario
    ];
  }

  aplicarFiltros(): void {
    this.datosFiltrados = this.datos.filter(dato => {
      const cumpleZafra = !this.filtroZafra || dato.zafra.toLowerCase().includes(this.filtroZafra.toLowerCase());
      const cumpleApartado = !this.filtroApartado || dato.apartado.toLowerCase().includes(this.filtroApartado.toLowerCase());
      const cumpleCategoria = !this.filtroCategoria || dato.categoria.toLowerCase().includes(this.filtroCategoria.toLowerCase());
      
      let cumpleFecha = true;
      if (this.filtroFechaInicio && this.filtroFechaFin) {
        const fechaDato = new Date(dato.fecha);
        const fechaInicio = new Date(this.filtroFechaInicio);
        const fechaFin = new Date(this.filtroFechaFin);
        cumpleFecha = fechaDato >= fechaInicio && fechaDato <= fechaFin;
      }
      
      return cumpleZafra && cumpleApartado && cumpleCategoria && cumpleFecha;
    });

    this.totalItems = this.datosFiltrados.length;
    this.paginaActual = 1;
  }

  get datosPagina(): DatoCosecha[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.datosFiltrados.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  get paginasTotales(): number {
    return Math.ceil(this.totalItems / this.itemsPorPagina);
  }

  get rangosPaginas(): number[] {
    const totalPages = this.paginasTotales;
    const current = this.paginaActual;
    const delta = 2;
    const range = [];
    
    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i);
    }
    
    if (current - delta > 2) {
      range.unshift(-1); // Marcador de elipsis
    }
    if (current + delta < totalPages - 1) {
      range.push(-1); // Marcador de elipsis
    }
    
    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  }

  // Métodos para cálculos matemáticos
  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  formatearNumero(valor: number): string {
    return valor.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}