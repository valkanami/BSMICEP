import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  referenceDate: Date = new Date('2025-06-01');
  currentWeek: number = 0;
  currentDate: Date = new Date();

  ngOnInit(): void {
    this.calculateCurrentWeek();
  }

  calculateCurrentWeek(): void {
    const today = new Date();
    this.currentDate = today;
    const diffInMs = today.getTime() - this.referenceDate.getTime();
    const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    this.currentWeek = diffInWeeks + 1;
  }
}