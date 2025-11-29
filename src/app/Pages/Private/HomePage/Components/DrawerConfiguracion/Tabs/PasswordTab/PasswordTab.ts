import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PasswordData {
  passwordActual: string;
  passwordNueva: string;
  passwordConfirmar: string;
}

@Component({
  selector: 'app-password-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './PasswordTab.html'
})
export class PasswordTabComponent {
  guardando = input<boolean>(false);
  error = input<string | null>(null);
  exito = input<boolean>(false);

  passwordActual = signal<string>('');
  passwordNueva = signal<string>('');
  passwordConfirmar = signal<string>('');
  mostrarPasswordActual = signal<boolean>(false);
  mostrarPasswordNueva = signal<boolean>(false);

  onGuardar = output<PasswordData>();

  toggleMostrarPasswordActual(): void {
    this.mostrarPasswordActual.update(v => !v);
  }

  toggleMostrarPasswordNueva(): void {
    this.mostrarPasswordNueva.update(v => !v);
  }

  guardar(): void {
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
    }
  }
}
