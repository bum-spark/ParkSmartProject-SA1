import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cajon, TipoCajon } from '../../../../Interfaces/dashboard.interfaces';
import { Accessibility, Annoyed, Car, LucideAngularModule, Zap } from 'lucide-angular';

@Component({
  selector: 'app-cajon-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './CajonCard.html'
})
export class CajonCardComponent {

  readonly CarIcon = Car;
  readonly ZapIcon = Zap;
  readonly AccessibilityIcon = Accessibility;
  readonly Annoyed = Annoyed;

  // Inputs
  cajon = input.required<Cajon>();
  esAdmin = input<boolean>(false);

  // Outputs
  onCajonClick = output<Cajon>();
  onReservar = output<{ cajon: Cajon; event: MouseEvent }>();
  onCambiarTipo = output<{ cajon: Cajon; event: MouseEvent }>();

  // Computed para las clases de color según estado
  estadoColor = computed(() => {
    const estado = this.cajon().estadoActual;
    switch (estado) {
      case 'libre': return 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20';
      case 'ocupado': return 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20';
      case 'reservado': return 'bg-amber-500/10 border-amber-500/50 hover:bg-amber-500/20';
      case 'inactivo': return 'bg-stone-500/10 border-stone-500/50 opacity-50 cursor-not-allowed';
      default: return 'bg-stone-500/10 border-stone-500/50';
    }
  });

  // Computed para verificar si está deshabilitado
  estaDeshabilitado = computed(() => this.cajon().estadoActual === 'inactivo');

  // Computed para verificar si es libre
  esLibre = computed(() => this.cajon().estadoActual === 'libre');

  // Computed para mostrar placa
  mostrarPlaca = computed(() => {
    const cajon = this.cajon();
    return (cajon.estadoActual === 'ocupado' || cajon.estadoActual === 'reservado') && cajon.placaVehiculo;
  });

  // Handlers
  handleClick(): void {
    if (!this.estaDeshabilitado()) {
      this.onCajonClick.emit(this.cajon());
    }
  }

  handleReservar(event: MouseEvent): void {
    event.stopPropagation();
    this.onReservar.emit({ cajon: this.cajon(), event });
  }

  handleCambiarTipo(event: MouseEvent): void {
    event.stopPropagation();
    this.onCambiarTipo.emit({ cajon: this.cajon(), event });
  }
}
