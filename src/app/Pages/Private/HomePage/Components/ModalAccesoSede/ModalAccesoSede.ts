import { Component, input, output, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Lock, Eye, EyeOff, XCircle, LockOpen } from 'lucide-angular';

@Component({
  selector: 'app-modal-acceso-sede',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ModalAccesoSede.html'
})
export class ModalAccesoSedeComponent {
  // Iconos
  readonly LockIcon = Lock;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;
  readonly XCircleIcon = XCircle;
  readonly LockOpenIcon = LockOpen;

  isOpen = input<boolean>(false);
  nombreSede = input<string>('');
  verificando = input<boolean>(false);
  error = input<string>('');

  onConfirmar = output<string>();
  onCancelar = output<void>();

  password = signal<string>('');
  mostrarPassword = signal<boolean>(false);
  passwordTouched = signal<boolean>(false);

  // Computed para validación
  passwordInvalido = computed(() => this.passwordTouched() && this.password().trim().length === 0);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.password.set('');
        this.mostrarPassword.set(false);
        this.passwordTouched.set(false);
      }
    });
  }

  toggleMostrarPassword(): void {
    this.mostrarPassword.update(v => !v);
  }

  confirmar(): void {
    // Marcar como touched para mostrar validación
    this.passwordTouched.set(true);
    
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
