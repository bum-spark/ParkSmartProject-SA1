import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cajon } from '../../../../Interfaces/dashboard.interfaces';
import { CajonCardComponent } from '../CajonCard/CajonCard';

@Component({
  selector: 'app-cajones-grid',
  standalone: true,
  imports: [CommonModule, CajonCardComponent],
  templateUrl: './CajonesGrid.html'
})
export class CajonesGridComponent {
  cajones = input.required<Cajon[]>();
  esAdmin = input<boolean>(false);

  onCajonClick = output<Cajon>();
  onReservar = output<{ cajon: Cajon; event: MouseEvent }>();
  onCambiarTipo = output<{ cajon: Cajon; event: MouseEvent }>();

  handleCajonClick(cajon: Cajon): void {
    this.onCajonClick.emit(cajon);
  }

  handleReservar(data: { cajon: Cajon; event: MouseEvent }): void {
    this.onReservar.emit(data);
  }

  handleCambiarTipo(data: { cajon: Cajon; event: MouseEvent }): void {
    this.onCambiarTipo.emit(data);
  }
}
