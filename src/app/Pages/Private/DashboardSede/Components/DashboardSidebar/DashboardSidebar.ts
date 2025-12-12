import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Car, LayoutDashboard, Map, CalendarClock, History, ArrowLeft, LogOut } from 'lucide-angular';

export type TabActiva = 'dashboard' | 'mapa' | 'reservas' | 'historial';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './DashboardSidebar.html'
})
export class DashboardSidebarComponent {
  // Lucide icons
  readonly CarIcon = Car;
  readonly LayoutDashboardIcon = LayoutDashboard;
  readonly MapIcon = Map;
  readonly CalendarClockIcon = CalendarClock;
  readonly HistoryIcon = History;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly LogOutIcon = LogOut;

  // Inputs
  sedeId = input.required<string | undefined>();
  nombreSede = input<string>('');
  cantidadReservasActivas = input<number>(0);

  // Outputs
  onVolverInicio = output<void>();
  onCerrarSesion = output<void>();

  volverInicio(): void {
    this.onVolverInicio.emit();
  }

  cerrarSesion(): void {
    this.onCerrarSesion.emit();
  }
}
