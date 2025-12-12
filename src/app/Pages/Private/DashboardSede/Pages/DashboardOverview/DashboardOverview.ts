import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardStateService } from '../../Services/dashboard-state.service';
import { LucideAngularModule, ParkingSquare, CircleCheck, CircleX, Clock, DollarSign, CalendarClock } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './DashboardOverview.html'
})
export class DashboardOverview {
  private router = inject(Router);
  private dashboardState = inject(DashboardStateService);

  // Lucide icons
  readonly ParkingSquareIcon = ParkingSquare;
  readonly CircleCheckIcon = CircleCheck;
  readonly CircleXIcon = CircleX;
  readonly ClockIcon = Clock;
  readonly DollarSignIcon = DollarSign;
  readonly CalendarClockIcon = CalendarClock;

  // Exponer signals del servicio de estado
  estadisticas = this.dashboardState.estadisticas;
  niveles = this.dashboardState.niveles;
  sede = this.dashboardState.sede;
  resumenEstadisticas = this.dashboardState.resumenEstadisticas;

  verMapa(): void {
    const sedeId = this.sede()?.sedeId;
    if (sedeId) {
      this.router.navigate(['/dashboard', sedeId, 'mapa']);
    }
  }

  verReservas(): void {
    const sedeId = this.sede()?.sedeId;
    if (sedeId) {
      this.router.navigate(['/dashboard', sedeId, 'reservas']);
    }
  }
}
