import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface DatoCampo {
  nombre: string;
  valor: string; // Cambiado de number a string
}

interface GrupoCategoria {
  categoria: string;
  campos: DatoCampo[];
}

@Component({
  selector: 'app-calidad-azucar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './calidad-azucar.component.html',
  styleUrls: ['./calidad-azucar.component.css']
})
export class CalidadAzucarComponent implements OnInit {
  datosOriginales: any[] = [];
  gruposCategoria: GrupoCategoria[] = [];
  todosCampos: string[] = [];
  fechasDisponibles: string[] = [];
  isLoading = true;
  errorMessage = '';
  fechaSeleccionada = '';

  readonly APARTADO_FILTRADO = 'Calidad del azucar';

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
          
          this.fechasDisponibles = [...new Set(datosFiltrados.map(item => {
            const fechaOriginal = new Date(item.Fecha);
            fechaOriginal.setDate(fechaOriginal.getDate() + 1); 
            return this.formatDate(fechaOriginal);
          }))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          
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
    const datosFiltrados = this.datosOriginales.filter(item => {
      const fechaOriginal = new Date(item.Fecha);
      fechaOriginal.setDate(fechaOriginal.getDate() + 1);
      return this.formatDate(fechaOriginal) === this.fechaSeleccionada;
    });
    
    this.todosCampos = [...new Set(datosFiltrados.map(item => item.Dato))];
    
    const categoriasUnicas = [...new Set(datosFiltrados.map(item => item.Categoria))];
    
    this.gruposCategoria = categoriasUnicas.map(categoria => {
      const datosCategoria = datosFiltrados.filter(item => item.Categoria === categoria);
      
      const campos: DatoCampo[] = this.todosCampos.map(nombreCampo => {
        const dato = datosCategoria.find(item => item.Dato === nombreCampo);
        return {
          nombre: nombreCampo,
          valor: dato ? dato.Valor.toString() : '' // Aseguramos que sea string y usamos '' como valor por defecto
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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Método auxiliar para convertir a número si es necesario
  convertirANumero(valor: string): number {
    return parseFloat(valor) || 0;
  }
}