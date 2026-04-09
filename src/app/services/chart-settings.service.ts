import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartSettingsService {
  private showLabelsSubject = new BehaviorSubject<boolean>(false);
  showLabels$ = this.showLabelsSubject.asObservable();

  constructor() {
    // Intentar cargar la preferencia del localStorage si existe
    const savedPreference = localStorage.getItem('showChartLabels');
    if (savedPreference !== null) {
      this.showLabelsSubject.next(savedPreference === 'true');
    }
  }

  toggleLabels() {
    const newValue = !this.showLabelsSubject.value;
    this.showLabelsSubject.next(newValue);
    localStorage.setItem('showChartLabels', String(newValue));
  }

  setShowLabels(value: boolean) {
    this.showLabelsSubject.next(value);
    localStorage.setItem('showChartLabels', String(value));
  }

  get showLabelsValue(): boolean {
    return this.showLabelsSubject.value;
  }
}
