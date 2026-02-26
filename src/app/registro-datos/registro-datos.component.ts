import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-registro-datos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-datos.component.html',
  styleUrls: ['./registro-datos.component.css']
})
export class RegistroDatosComponent implements OnInit {

  /* ===============================
     VALORES FIJOS
  ================================ */
  zafra: string = '2025-2026';
  fecha: Date = new Date();

  /* ===============================
     SELECCIONES
  ================================ */
  apartadoSeleccionado: string = '';
  apartados: string[] = [];

  /* ===============================
     DATOS
  ================================ */
  datosOriginales: any[] = [];
  datosUnicos: any[] = [];
  registros: any[] = [];

  /* ===============================
     CATÁLOGOS
  ================================ */
  dias = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
  horas = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0') + ':00'
  );
  turnos = ['Turno 1', 'Turno 2', 'Turno 3'];

  constructor(private api: ApiService) {}

  /* ===============================
     INIT
  ================================ */
  ngOnInit(): void {
    this.cargarDatos();
  }

  /* ===============================
     CARGAR TODAS LAS RUTAS
  ================================ */
  cargarDatos() {
    forkJoin({
      datosSql: this.api.getDatosSql(),
      datosDia: this.api.getDatosDia(),
      datosHora: this.api.getDatosHora(),
      datosTurno: this.api.getDatosTurno(),
      datosTablas: this.api.getDatosTablas(),
      datosCuadros: this.api.getDatosCuadros(),
      promedios: this.api.getPromedios(),
      registroZafra: this.api.getRegistroZafra()
    }).subscribe({
      next: (resp) => {

        // Unir TODO
        this.datosOriginales = [
          ...resp.datosSql,
          ...resp.datosDia,
          ...resp.datosHora,
          ...resp.datosTurno,
          ...resp.datosTablas,
          ...resp.datosCuadros,
          ...resp.promedios,
          ...resp.registroZafra
        ];

        // Apartados únicos
        this.apartados = [
          ...new Set(
            this.datosOriginales
              .map(d => d.Apartado ?? d.apartado)
              .filter(a => a)
          )
        ];
      },
      error: err => console.error('Error cargando datos:', err)
    });
  }

  /* ===============================
     CAMBIO DE APARTADO
  ================================ */
  onApartadoChange() {

    if (!this.apartadoSeleccionado) {
      this.registros = [];
      return;
    }

    const filtrados = this.datosOriginales.filter(
      d => (d.Apartado ?? d.apartado) === this.apartadoSeleccionado
    );

    // Datos únicos por Dato
    this.datosUnicos = filtrados.filter(
      (obj, index, self) =>
        index === self.findIndex(
          d => (d.Dato ?? d.dato) === (obj.Dato ?? obj.dato)
        )
    );

    // Inicializar formulario
    this.registros = this.datosUnicos.map(d => ({
      Zafra: this.zafra,
      Fecha: this.fecha,
      Dia: null,
      Hora: null,
      Turno: null,
      Apartado: d.Apartado ?? d.apartado,
      Dato: d.Dato ?? d.dato,
      Valor: null,
      Justificacion: ''
    }));
  }

  /* ===============================
     DETECTAR TIPO
  ================================ */
  detectarTipo(dato: string): 'dia' | 'hora' | 'turno' | 'nada' {
    if (!dato) return 'nada';

    const texto = dato.toLowerCase();
    if (texto.includes('día') || texto.includes('dia')) return 'dia';
    if (texto.includes('hora')) return 'hora';
    if (texto.includes('turno')) return 'turno';

    return 'nada';
  }

  /* ===============================
     GUARDAR DATOS
  ================================ */
  guardarDatos() {

    const validos = this.registros.filter(
      r => r.Valor !== null && r.Valor !== ''
    );

    if (!validos.length) {
      alert('No hay datos válidos para guardar');
      return;
    }

    if (validos.length) {
      this.api.insertDatosSQL(validos).subscribe();
      this.api.insertDatosDia(validos).subscribe();
      this.api.insertDatosHora(validos).subscribe();
      this.api.insertDatosTurno(validos).subscribe();
      this.api.insertDatosTablas(validos).subscribe();
      this.api.insertDatosCuadros(validos).subscribe();
      this.api.insertPromedios(validos).subscribe();
      this.api.insertRegistroZafra(validos).subscribe();
    }

    alert('Datos guardados correctamente');

    this.registros = [];
    this.apartadoSeleccionado = '';
  }
}
