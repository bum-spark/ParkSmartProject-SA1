import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reserva } from '../../../../../../../Shared/Interfaces/asignacion.interface';
import { LucideAngularModule, Car, Clock, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-reserva-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './ReservaCard.html'
})
export class ReservaCardComponent {
  // Inputs
  reserva = input.required<Reserva>();

  // Outputs
  onVerDetalles = output<Reserva>();

  // Icons
  readonly CarIcon = Car;
  readonly ClockIcon = Clock;
  readonly AlertTriangleIcon = AlertTriangle;

  // Computed
  tiempoRestante = computed(() => this.getTiempoRestanteReserva(this.reserva()));
  estaVencida = computed(() => this.tiempoRestante() <= 0);
  tiempoFormateado = computed(() => this.formatearTiempoRestante(this.tiempoRestante()));

  // Métodos
  verDetalles(): void {
    this.onVerDetalles.emit(this.reserva());
  }

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

  private getTiempoRestanteReserva(reserva: Reserva): number {
    const ahora = new Date().getTime();
    const vencimiento = new Date(reserva.fechaVencimiento).getTime();
    return Math.floor((vencimiento - ahora) / (1000 * 60)); // minutos
  }

  private formatearTiempoRestante(minutos: number): string {
    if (minutos <= 0) return 'Vencida';
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins}m restantes`;
    }
    return `${mins}m restantes`;
  }
}
