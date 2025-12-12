import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LogOut } from 'lucide-angular';
import { ModalSalida } from '../../../../../Interfaces/dashboard.interfaces';

@Component({
  selector: 'app-modal-salida',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './ModalSalida.html'
})
export class ModalSalidaComponent {
  readonly LogOutIcon = LogOut;

  modal = input.required<ModalSalida>();
  
  onCerrar = output<void>();
  onProcesarPago = output<void>();

  formatearFecha(fecha: string | Date): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  procesarPago(): void {
    this.onProcesarPago.emit();
  }

  cerrar(): void {
    this.onCerrar.emit();
  }
}
