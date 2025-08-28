import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface DatoCampo {
  nombre: string;
  valor: number;
}

interface FilaDatos {
  fecha: string;
  categoria: string;
  campos: DatoCampo[];
}

@Component({
  selector: 'app-azucar-refundida',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './azucar-refundida.component.html',
  styleUrls: ['./azucar-refundida.component.css']
})
export class AzucarRefundidaComponent implements OnInit {
  datosOriginales: any[] = [];
  filasDatos: FilaDatos[] = [];
  todosCampos: string[] = [];
  isLoading = true;
  errorMessage = '';

  readonly APARTADO_FILTRADO = 'Azúcar refundida';

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
          this.datosOriginales = datosFiltrados;
          this.procesarDatos();
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
    this.todosCampos = [...new Set(this.datosOriginales.map(item => item.Dato))];
    
    
    const fechasUnicas = [...new Set(this.datosOriginales.map(item => {
      const fechaOriginal = new Date(item.Fecha);
      fechaOriginal.setDate(fechaOriginal.getDate() + 1);
      return this.formatDate(fechaOriginal);
    }))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    this.filasDatos = [];
    
    fechasUnicas.forEach(fecha => {
      const datosFecha = this.datosOriginales.filter(item => {
        const itemFecha = new Date(item.Fecha);
        itemFecha.setDate(itemFecha.getDate() + 1);
        return this.formatDate(itemFecha) === fecha;
      });
      
      const categoriasUnicas = [...new Set(datosFecha.map(item => item.Categoria))];
      
      categoriasUnicas.forEach(categoria => {
        const datosCategoria = datosFecha.filter(item => item.Categoria === categoria);
        
        const campos: DatoCampo[] = this.todosCampos.map(nombreCampo => {
          const dato = datosCategoria.find(item => item.Dato === nombreCampo);
          return {
            nombre: nombreCampo,
            valor: dato ? dato.Valor : 0 
          };
        });
        
        this.filasDatos.push({
          fecha,
          categoria,
          campos
        });
      });
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}