import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Menu } from 'lucide-angular';

export type TabActiva = 'dashboard' | 'mapa' | 'reservas' | 'historial';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './DashboardHeader.html'
})
export class DashboardHeaderComponent {
  // Lucide icons
  readonly MenuIcon = Menu;

  // Inputs
  sedeId = input.required<string | undefined>();
  direccionSede = input<string>('');
  tabActiva = input<TabActiva>('dashboard');
  rolUsuario = input<string>('');
  nombreUsuario = input<string>('Usuario');
  iniciales = input<string>('U');

  // Outputs
  onVolverInicio = output<void>();
  onCerrarSesion = output<void>();

  getTituloTab(): string {
    switch (this.tabActiva()) {
      case 'dashboard': return 'Dashboard';
      case 'mapa': return 'Mapa de Cajones';
      case 'reservas': return 'Reservas Activas';
      case 'historial': return 'Historial';
      default: return 'Dashboard';
    }
  }

  volverInicio(): void {
    this.onVolverInicio.emit();
  }

  cerrarSesion(): void {
    this.onCerrarSesion.emit();
  }
}
