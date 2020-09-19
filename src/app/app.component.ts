import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /** FormControl que se bindea al componente de selección de color */
  colorSelectorControl: FormControl;

  constructor() {
    // Se inicializa el FormControl
    this.colorSelectorControl = new FormControl();
  }

  /**
   * Habilita o deshabilita el control del ColorSelector
   */
  toggleDisableState(): void {
    if (this.colorSelectorControl.disabled) {
      this.colorSelectorControl.enable();
    }
    else {
      this.colorSelectorControl.disable();
    }
  }

  /**
   * Marca como requerido el componente de selección de color
   */
  markAsRequired(): void {
    this.colorSelectorControl.setValidators(Validators.required);
    this.colorSelectorControl.updateValueAndValidity();
  }

  /**
   * Marca como NO requerido el componente de selección de color
   */
  markAsNotRequired(): void {
    this.colorSelectorControl.clearValidators();
    this.colorSelectorControl.updateValueAndValidity();
  }
}
