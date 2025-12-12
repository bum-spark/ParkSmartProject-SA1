import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Reserva, DetallesPagoReserva } from '../../../../../Shared/Interfaces/asignacion.interface';
import { ModalDetalleReserva } from '../../Interfaces/dashboard.interfaces';
import { DashboardStateService } from '../../Services/dashboard-state.service';
import { AsignacionService } from '../../../../../Shared/Services/asignacion.service';
import { LucideAngularModule, ClipboardList, Check, Clock, AlertTriangle } from 'lucide-angular';
import { ReservasGridComponent } from './Components';

@Component({
  selector: 'app-dashboard-reservas',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReservasGridComponent],
  templateUrl: './DashboardReservas.html'
})
export class DashboardReservas {
  
  // Inyección de servicios
  private dashboardState = inject(DashboardStateService);
  private asignacionService = inject(AsignacionService);

  // Lucide icons (solo para el modal)
  readonly ClockIcon = Clock;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly CheckIcon = Check;
  readonly ClipboardListIcon = ClipboardList;

  // Estado del modal
  modalDetalleReserva = signal<ModalDetalleReserva>({
    abierto: false,
    reserva: null,
    calculando: false,
    costoCalculado: null,
    cargando: false,
    error: ''
  });

  // Computed - Reservas desde el servicio de estado
  reservas = computed(() => this.dashboardState.reservas());
  
  reservasPendientes = computed(() => {
    return this.reservas().filter(r => r.estado === 'pendiente');
  });

  // Métodos del modal
  async abrirDetalleReserva(reserva: Reserva): Promise<void> {
    this.modalDetalleReserva.set({
      abierto: true,
      reserva,
      calculando: true,
      costoCalculado: null,
      cargando: false,
      error: ''
    });

    try {
      const response = await firstValueFrom(
        this.asignacionService.calcularPagoReserva(reserva.reservaId)
      );

      if (!response.error && response.data) {
        const costoCalculado: DetallesPagoReserva = {
          ...response.data,
          reservaId: reserva.reservaId,
          fechaReserva: reserva.fechaReserva,
          fechaVencimiento: reserva.fechaVencimiento,
          duracionReservadaHoras: reserva.duracionEstimadaHoras
        };

        this.modalDetalleReserva.update(m => ({
          ...m,
          calculando: false,
          costoCalculado
        }));
      } else {
        this.modalDetalleReserva.update(m => ({
          ...m,
          calculando: false,
          error: response.msg || 'Error al calcular costo'
        }));
      }
    } catch (error: any) {
      this.modalDetalleReserva.update(m => ({
        ...m,
        calculando: false,
        error: error.error?.msg || 'Error al conectar con el servidor'
      }));
    }
  }

  cerrarDetalleReserva(): void {
    this.modalDetalleReserva.set({
      abierto: false,
      reserva: null,
      calculando: false,
      costoCalculado: null,
      cargando: false,
      error: ''
    });
  }

  async pagarReserva(): Promise<void> {
    const modal = this.modalDetalleReserva();
    if (!modal.reserva) return;

    this.modalDetalleReserva.update(m => ({ ...m, cargando: true, error: '' }));

    try {
      const response = await firstValueFrom(
        this.asignacionService.pagarReserva(modal.reserva.reservaId)
      );

      if (!response.error) {
        // Cerrar modal
        this.cerrarDetalleReserva();
        // Recargar todos los datos (reservas, niveles, historial)
        await this.dashboardState.recargarDatos();
      } else {
        this.modalDetalleReserva.update(m => ({
          ...m,
          cargando: false,
          error: response.msg || 'Error al procesar pago'
        }));
      }
    } catch (error: any) {
      this.modalDetalleReserva.update(m => ({
        ...m,
        cargando: false,
        error: error.error?.msg || 'Error al conectar con el servidor'
      }));
    }
  }

  // Métodos de utilidad
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

  getTiempoRestanteReserva(reserva: Reserva): number {
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
}
