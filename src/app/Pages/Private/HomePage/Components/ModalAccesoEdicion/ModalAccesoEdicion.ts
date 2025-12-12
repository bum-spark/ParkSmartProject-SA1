import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Lock, X, Info, Key, Eye, EyeOff, LockOpen } from 'lucide-angular';
import { Sede } from '../../../../../Shared/Interfaces/sede.interface';

export interface VerificarAccesoData {
  sedeId: string;
  passwordAcceso: string;
}

@Component({
  selector: 'app-modal-acceso-edicion',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ModalAccesoEdicion.html',
})
export class ModalAccesoEdicionComponent {
  // Iconos
  readonly LockIcon = Lock;
  readonly XIcon = X;
  readonly InfoIcon = Info;
  readonly KeyIcon = Key;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;
  readonly LockOpenIcon = LockOpen;

  isOpen = input<boolean>(false);
  sede = input<Sede | null>(null);
  verificando = input<boolean>(false);
  error = input<string>('');
  onVerificar = output<VerificarAccesoData>();
  onCerrar = output<void>();

  // Estado interno
  passwordAcceso = signal<string>('');
  mostrarPassword = signal<boolean>(false);
  passwordTouched = signal<boolean>(false);

  // Computed para validación
  passwordInvalido = computed(() => this.passwordTouched() && this.passwordAcceso().trim().length === 0);

  toggleMostrarPassword(): void {
    this.mostrarPassword.update(v => !v);
  }

  verificar(): void {
    // Marcar como touched para mostrar validación
    this.passwordTouched.set(true);
    
    const sedeActual = this.sede();
    if (!sedeActual || !this.passwordAcceso().trim()) return;

    this.onVerificar.emit({
      sedeId: sedeActual.sedeId,
      passwordAcceso: this.passwordAcceso().trim()
    });
  }

  cerrar(): void {
    this.passwordAcceso.set('');
    this.mostrarPassword.set(false);
    this.passwordTouched.set(false);
    this.onCerrar.emit();
  }
}
