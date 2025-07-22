import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  currentDate: Date = new Date();
  currentWeek: number = 0;

  ngOnInit(): void {
    this.calculateWeek();
  }

  calculateWeek(): void {
    // Fecha de referencia (puedes cambiarla según tus necesidades)
    const referenceDate = new Date('2023-01-01');
    const diffInTime = this.currentDate.getTime() - referenceDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    this.currentWeek = Math.floor(diffInDays / 7) + 1;
  }

  changeWeek(): void {
    // Cambia la fecha actual (simulando selección de día)
    const randomDays = Math.floor(Math.random() * 30) - 15; // +/- 15 días
    this.currentDate = new Date();
    this.currentDate.setDate(this.currentDate.getDate() + randomDays);
    this.calculateWeek();
  }
}