import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root', // ← Debe coincidir con index.html
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <router-outlet></router-outlet>
    <!-- O si no usas router: -->
    <!-- <app-main-page></app-main-page> -->
  `
})
export class AppComponent {}