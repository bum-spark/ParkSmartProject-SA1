import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ClipboardList, Clock, AlertTriangle, Check } from 'lucide-angular';
import { ModalDetalleReserva } from '../../../../../Interfaces/dashboard.interfaces';
import { Reserva } from '../../../../../../../../Shared/Interfaces/asignacion.interface';

@Component({
  selector: 'app-modal-detalle-reserva',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './ModalDetalleReserva.html'
})
export class ModalDetalleReservaComponent {
  readonly ClipboardListIcon = ClipboardList;
  readonly ClockIcon = Clock;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly CheckIcon = Check;

  modal = input.required<ModalDetalleReserva>();
  
  onCerrar = output<void>();
  onPagar = output<void>();

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

  getTiempoRestanteReserva(reserva: Reserva | null): number {
    if (!reserva?.fechaVencimiento) return 0;
    const ahora = new Date().getTime();
    const vencimiento = new Date(reserva.fechaVencimiento).getTime();
    return Math.floor((vencimiento - ahora) / (1000 * 60)); // minutos
  }

  formatearTiempoRestante(minutos: number): string {
    if (minutos <= 0) return 'Vencida';
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins}m restantes`;
    }
    return `${mins}m restantes`;
  }

  pagar(): void {
    this.onPagar.emit();
  }

  cerrar(): void {
    this.onCerrar.emit();
  }
}
