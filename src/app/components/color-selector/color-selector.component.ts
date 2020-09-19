import {
  Component,
  OnInit,
  Self,
  OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';

/** Función adaptadora para el array de colores */
const colorsType = <T extends string>(array: T[]) => array;

/** Colores admitidos por el componente */
const colors = colorsType(['red', 'green', 'blue']);

/** Modelo de colores del componente */
type ColorSelected = (typeof colors)[number];

/** Valida si un valor es de tipo ColorSelected */
const isColor = (x: any): x is ColorSelected => colors.includes(x);

/* Validador que controla el valor recibido por nuestro control */
const isValidColor = (control: AbstractControl) => {
  if (control.value && !isColor(control.value)) {
    return { validColor: false };
  }

  return null;
};

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss'],
})
export class ColorSelectorComponent implements OnInit, OnDestroy, ControlValueAccessor {
  /** Color seleccionado */
  selection: ColorSelected;

  /** Controla si el componente está habilitado */
  disabled: boolean;

  /* Controla si el componente es requerido */
  required: boolean;

  /* Suscripciones que se ejecutan en nuestro componente */
  subscriptions: Subscription;

  /** Función para actualizar el valor del CVA */
  onChanged: any;

  /** Funcion para marcar como 'touched' el CVA */
  onTouched: any;

  /** FormControl para controlarse a sí mismo */
  control: FormControl;

  constructor(
    @Self() private ngControl: NgControl
  ) {
    this.ngControl.valueAccessor = this;

    // Se inicializan los valores del componente por defecto
    this.selection = null;
    this.disabled = false;
    this.required = false;

    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    // Si el componente se está usando como control de un formulario
    if (this.ngControl) {
      this.control = this.ngControl.control as FormControl;
    }
    // En caso contrario se inicializa el control del componente por defecto
    else {
      this.control = new FormControl();
    }

    // Actualizamos el estado del componente
    this.updateState();

    // Listener para escuchar los cambios del FormControl externo
    this.subscriptions.add(
      this.control.statusChanges.subscribe(() => {
        this.updateState();
      })
    );
  }

  ngOnDestroy(): void {
    // Eliminamos las suscripciones de los listeners guardados
    this.subscriptions.unsubscribe();
  }

  /**
   * Selecciona un color
   * @param color Color sobre el que se ha hecho click
   */
  colorSelected(color: ColorSelected): void {
    if (color === this.selection) {
      this.clearSelection();
    }
    else {
      this.selection = color;
    }

    if (!this.disabled) {
      this.onChanged(this.selection);
      this.onTouched();
    }
  }

  /**
   * Limpia el valor de la selección del componente
   */
  clearSelection(): void {
    this.selection = null;
  }

  /**
   * Recibe un valor desde fuera del componente (a través del CVA)
   * @param color Valor recibido desde fuera del componente
   */
  writeValue(color: any): void {
    if (isColor(color)) {
      this.selection = color;
    }
    else if (!color) {
      this.clearSelection();
    }
  }

  /**
   * Recibe la función para emitir un cambio en el valor del CVA
   * @param fn Función a implementar
   */
  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  /**
   * Recibe la función para emitir un cambio en el estado 'touched' del CVA
   * @param fn Función a implementar
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Recibe si el CVA está habilitado o no
   * @param isDisabled Estado del CVA
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Se actualizan los validadores del componente
   */
  updateValidators(): void {
    const validators = this.control.validator ? [this.control.validator, isValidColor] : isValidColor;
    this.control.setValidators(validators);
    this.control.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Comprueba si el componente está marcado como requerido
   * @returns Si el componente es requerido
   */
  isRequired(): boolean {
    if (this.control?.validator) {
      const validator = this.control.validator({} as AbstractControl);
      if (validator?.required) {
        return true;
      }
    }

    return false;
  }

  /**
   * Actualiza el estado del componente
   */
  updateState(): void {
    this.updateValidators();
    this.required = this.isRequired();
  }

}
