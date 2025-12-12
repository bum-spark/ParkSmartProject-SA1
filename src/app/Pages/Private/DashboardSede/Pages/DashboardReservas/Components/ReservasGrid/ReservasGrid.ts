import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reserva } from '../../../../../../../Shared/Interfaces/asignacion.interface';
import { ReservaCardComponent } from '../ReservaCard/ReservaCard';
import { LucideAngularModule, CalendarClock } from 'lucide-angular';

@Component({
  selector: 'app-reservas-grid',
  standalone: true,
  imports: [CommonModule, ReservaCardComponent, LucideAngularModule],
  templateUrl: './ReservasGrid.html'
})
export class ReservasGridComponent {
  // Inputs
  reservas = input.required<Reserva[]>();

  // Outputs
  onVerDetalles = output<Reserva>();

  // Icons
  readonly CalendarClockIcon = CalendarClock;

  // Métodos
  handleVerDetalles(reserva: Reserva): void {
    this.onVerDetalles.emit(reserva);
  }
}
