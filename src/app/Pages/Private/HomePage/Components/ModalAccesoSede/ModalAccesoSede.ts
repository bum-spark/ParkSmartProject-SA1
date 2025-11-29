import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-acceso-sede',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ModalAccesoSede.html'
})
export class ModalAccesoSedeComponent {
  isOpen = input<boolean>(false);
  nombreSede = input<string>('');
  verificando = input<boolean>(false);
  error = input<string>('');

  onConfirmar = output<string>();
  onCancelar = output<void>();

  password = signal<string>('');
  mostrarPassword = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.password.set('');
        this.mostrarPassword.set(false);
      }
    });
  }

  toggleMostrarPassword(): void {
    this.mostrarPassword.update(v => !v);
  }

  confirmar(): void {
    if (this.password().trim()) {
      this.onConfirmar.emit(this.password());
    }
  }

  cancelar(): void {
    this.password.set('');
    this.onCancelar.emit();
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.password().trim() && !this.verificando()) {
      this.confirmar();
    }
    if (event.key === 'Escape') {
      this.cancelar();
    }
  }
}
