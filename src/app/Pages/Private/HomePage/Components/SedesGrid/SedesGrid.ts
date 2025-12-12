import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Building, Plus } from 'lucide-angular';
import { SedeCardComponent, AccesoSedeInfo } from '../SedeCard/SedeCard';
import { Sede } from '../../../../../Shared/Interfaces/sede.interface';

@Component({
  selector: 'app-sedes-grid',
  standalone: true,
  templateUrl: './SedesGrid.html',
  imports: [CommonModule, SedeCardComponent, LucideAngularModule]
})
export class SedesGridComponent {
  // Iconos
  readonly BuildingIcon = Building;
  readonly PlusIcon = Plus;

  sedes = input.required<Sede[]>();
  esAdmin = input<boolean>(false);
  accesosValidos = input<Map<string, { fechaExpiracion: Date; tiempoRestante: string }>>(new Map());
  cargando = input<boolean>(false);

  onAcceder = output<Sede>();
  onEditar = output<{ sede: Sede; event: Event }>();
  onNuevaSede = output<void>();

  getAccesoInfo(sede: Sede): AccesoSedeInfo {
    const acceso = this.accesosValidos().get(sede.sedeId);
    if (acceso) {
      return {
        tieneAcceso: true,
        fechaExpiracion: acceso.fechaExpiracion.toLocaleString(),
        tiempoRestante: acceso.tiempoRestante
      };
    }
    return {
      tieneAcceso: false,
      fechaExpiracion: '',
      tiempoRestante: ''
    };
  }

  handleAcceder(sede: Sede): void {
    this.onAcceder.emit(sede);
  }

  handleEditar(data: { sede: Sede; event: Event }): void {
    this.onEditar.emit(data);
  }

  crearNuevaSede(): void {
    this.onNuevaSede.emit();
  }
}
