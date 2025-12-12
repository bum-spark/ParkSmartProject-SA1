import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Zap, Check, Info } from 'lucide-angular';
import { ModalAsignacionAutomatica } from '../../../../../Interfaces/dashboard.interfaces';

@Component({
  selector: 'app-modal-asignacion-automatica',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ModalAsignacionAutomatica.html'
})
export class ModalAsignacionAutomaticaComponent {
  readonly ZapIcon = Zap;
  readonly CheckIcon = Check;
  readonly InfoIcon = Info;

  modal = input.required<ModalAsignacionAutomatica>();
  nivelSeleccionado = input<number | null>(null);
  
  onCerrar = output<void>();
  onAsignar = output<void>();
  onPlacaChange = output<string>();

  actualizarPlaca(placa: string): void {
    this.onPlacaChange.emit(placa);
  }

  asignar(): void {
    this.onAsignar.emit();
  }

  cerrar(): void {
    this.onCerrar.emit();
  }
}
