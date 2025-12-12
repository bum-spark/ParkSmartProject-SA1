import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, LogIn } from 'lucide-angular';
import { ModalEntrada } from '../../../../../Interfaces/dashboard.interfaces';

@Component({
  selector: 'app-modal-entrada',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ModalEntrada.html'
})
export class ModalEntradaComponent {
  readonly LogInIcon = LogIn;

  modal = input.required<ModalEntrada>();
  
  onCerrar = output<void>();
  onRegistrar = output<void>();
  onPlacaChange = output<string>();

  actualizarPlaca(placa: string): void {
    this.onPlacaChange.emit(placa);
  }

  registrar(): void {
    this.onRegistrar.emit();
  }

  cerrar(): void {
    this.onCerrar.emit();
  }
}
