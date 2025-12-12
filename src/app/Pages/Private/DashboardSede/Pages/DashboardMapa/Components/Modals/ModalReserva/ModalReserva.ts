import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, CalendarClock } from 'lucide-angular';
import { ModalReserva } from '../../../../../Interfaces/dashboard.interfaces';

@Component({
  selector: 'app-modal-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ModalReserva.html'
})
export class ModalReservaComponent {
  readonly CalendarClockIcon = CalendarClock;

  modal = input.required<ModalReserva>();
  tarifaPorHora = input<number>(0);
  
  onCerrar = output<void>();
  onCrearReserva = output<void>();
  onPlacaChange = output<string>();
  onDuracionChange = output<number>();

  costoEstimado = computed(() => {
    return this.tarifaPorHora() * this.modal().duracionHoras;
  });

  actualizarPlaca(placa: string): void {
    this.onPlacaChange.emit(placa);
  }

  actualizarDuracion(duracion: number): void {
    this.onDuracionChange.emit(duracion);
  }

  crearReserva(): void {
    this.onCrearReserva.emit();
  }

  cerrar(): void {
    this.onCerrar.emit();
  }
}
