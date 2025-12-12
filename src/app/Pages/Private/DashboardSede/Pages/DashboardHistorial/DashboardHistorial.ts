import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStateService } from '../../Services/dashboard-state.service';
import { LucideAngularModule, History } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-historial',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './DashboardHistorial.html'
})
export class DashboardHistorial {
  // Inyección del servicio de estado
  private dashboardState = inject(DashboardStateService);

  // Lucide icons
  readonly HistoryIcon = History;

  // Computed - Historial desde el servicio de estado
  historial = computed(() => this.dashboardState.historial());

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

  getEstadoTransaccionColor(estado: string): string {
    switch (estado) {
      case 'completado': return 'badge-success';
      case 'activo': return 'badge-info';
      case 'cancelado': return 'badge-error';
      default: return 'badge-ghost';
    }
  }
}
