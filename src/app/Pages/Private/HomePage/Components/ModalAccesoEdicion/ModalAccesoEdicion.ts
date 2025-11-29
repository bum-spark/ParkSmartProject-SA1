import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sede } from '../../../../../Shared/Interfaces/sede.interface';

export interface VerificarAccesoData {
  sedeId: string;
  passwordAcceso: string;
}

@Component({
  selector: 'app-modal-acceso-edicion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ModalAccesoEdicion.html',
})
export class ModalAccesoEdicionComponent {
  isOpen = input<boolean>(false);
  sede = input<Sede | null>(null);
  verificando = input<boolean>(false);
  error = input<string>('');
  onVerificar = output<VerificarAccesoData>();
  onCerrar = output<void>();

  // Estado interno
  passwordAcceso = signal<string>('');
  mostrarPassword = signal<boolean>(false);

  toggleMostrarPassword(): void {
    this.mostrarPassword.update(v => !v);
  }

  verificar(): void {
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
    this.onCerrar.emit();
  }
}
