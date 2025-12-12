import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';

export interface PasswordData {
  passwordActual: string;
  passwordNueva: string;
  passwordConfirmar: string;
}

@Component({
  selector: 'app-password-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './PasswordTab.html'
})
export class PasswordTabComponent {
  // Lucide icons
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;

  guardando = input<boolean>(false);
  exito = input<boolean>(false);

  passwordActual = signal<string>('');
  passwordNueva = signal<string>('');
  passwordConfirmar = signal<string>('');
  mostrarPasswordActual = signal<boolean>(false);
  mostrarPasswordNueva = signal<boolean>(false);

  // Estados touched para validaciones
  passwordActualTouched = signal<boolean>(false);
  passwordNuevaTouched = signal<boolean>(false);
  passwordConfirmarTouched = signal<boolean>(false);

  // Computed para validaciones
  passwordActualInvalida = computed(() => this.passwordActualTouched() && this.passwordActual().length === 0);
  passwordNuevaInvalida = computed(() => this.passwordNuevaTouched() && this.passwordNueva().length < 6);
  passwordConfirmarInvalida = computed(() => this.passwordConfirmarTouched() && this.passwordConfirmar() !== this.passwordNueva());

  // Computed para verificar si el formulario es válido
  formularioValido = computed(() => {
    const passwordActualValida = this.passwordActual().length > 0;
    const passwordNuevaValida = this.passwordNueva().length >= 6;
    const passwordConfirmarValida = this.passwordConfirmar() === this.passwordNueva();
    return passwordActualValida && passwordNuevaValida && passwordConfirmarValida;
  });

  onGuardar = output<PasswordData>();

  toggleMostrarPasswordActual(): void {
    this.mostrarPasswordActual.update(v => !v);
  }

  toggleMostrarPasswordNueva(): void {
    this.mostrarPasswordNueva.update(v => !v);
  }

  guardar(): void {
    // Marcar todos los campos como touched para mostrar validaciones
    this.passwordActualTouched.set(true);
    this.passwordNuevaTouched.set(true);
    this.passwordConfirmarTouched.set(true);

    // Si el formulario no es válido, no continuar
    if (!this.formularioValido()) {
      return;
    }

    this.onGuardar.emit({
      passwordActual: this.passwordActual(),
      passwordNueva: this.passwordNueva(),
      passwordConfirmar: this.passwordConfirmar()
    });
  }

  ngOnChanges(): void {
    if (this.exito()) {
      this.passwordActual.set('');
      this.passwordNueva.set('');
      this.passwordConfirmar.set('');
      // Limpiar touched
      this.passwordActualTouched.set(false);
      this.passwordNuevaTouched.set(false);
      this.passwordConfirmarTouched.set(false);
    }
  }
}
