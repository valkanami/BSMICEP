import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface DatoCampo {
  nombre: string;
  valor: number;
}

interface GrupoCategoria {
  categoria: string;
  campos: DatoCampo[];
}

@Component({
  selector: 'app-reporte-cosecha',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './reporte-cosecha.component.html',
  styleUrls: ['./reporte-cosecha.component.css']
})
export class ReporteCosechaComponent implements OnInit {
  datosOriginales: any[] = [];
  gruposCategoria: GrupoCategoria[] = [];
  todosCampos: string[] = [];
  fechasDisponibles: string[] = [];
  isLoading = true;
  errorMessage = '';
  fechaSeleccionada = '';

  readonly APARTADO_FILTRADO = 'Reporte de cosecha';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/api/datostablas')
      .subscribe({
        next: (data) => {

          const datosFiltrados = data.filter(item => item.Apartado === this.APARTADO_FILTRADO);
          
          
          this.fechasDisponibles = [...new Set(datosFiltrados.map(item => item.Fecha))]
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          
          this.datosOriginales = datosFiltrados;
          
          if (this.fechasDisponibles.length > 0) {
            this.fechaSeleccionada = this.fechasDisponibles[0];
            this.procesarDatos();
          }
          
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar los datos';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  procesarDatos(): void {
    const datosFiltrados = this.datosOriginales.filter(
      item => item.Fecha === this.fechaSeleccionada
    );
    
    
    this.todosCampos = [...new Set(datosFiltrados.map(item => item.Dato))];
    
    
    const categoriasUnicas = [...new Set(datosFiltrados.map(item => item.Categoria))];
    
    this.gruposCategoria = categoriasUnicas.map(categoria => {
      const datosCategoria = datosFiltrados.filter(item => item.Categoria === categoria);
      
      const campos: DatoCampo[] = this.todosCampos.map(nombreCampo => {
        const dato = datosCategoria.find(item => item.Dato === nombreCampo);
        return {
          nombre: nombreCampo,
          valor: dato ? dato.Valor : 0 
        };
      });
      
      return {
        categoria,
        campos
      };
    });
  }

  aplicarFiltro(): void {
    this.procesarDatos();
  }
}