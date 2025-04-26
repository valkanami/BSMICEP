import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, of } from 'rxjs';

interface ReporteCosecha {
  CONCEPTO: string;
  VALOR: number;
  OBJETIVO: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  private http = inject(HttpClient);

  data: ReporteCosecha[] = [];
  loading = true;
  error: string | null = null;
  apiUrl = 'http://localhost:3000/api/reportecosecha'; 

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.http.get<ReporteCosecha[]>(this.apiUrl)
      .pipe(
        catchError(err => {
          this.error = 'Error al cargar datos. Mostrando datos de ejemplo.';
          console.error(err);
          return of(this.getMockData());
        })
      )
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  private getMockData(): ReporteCosecha[] {
    return [
      { CONCEPTO: 'Cosecha Maíz', VALOR: 1500, OBJETIVO: '2000 ton' },
      { CONCEPTO: 'Cosecha Trigo', VALOR: 980, OBJETIVO: '1200 ton' },
      { CONCEPTO: 'Cosecha Soja', VALOR: 2100, OBJETIVO: '2500 ton' },
      { CONCEPTO: 'Rendimiento', VALOR: 3.2, OBJETIVO: '3.5 ton/ha' }
    ];
  }
}