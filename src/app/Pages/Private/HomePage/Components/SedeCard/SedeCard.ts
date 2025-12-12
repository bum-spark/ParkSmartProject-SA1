import { Component, input, output, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LucideAngularModule, MapPin, Settings, ShieldCheck, Check, Lock } from 'lucide-angular';
import { Sede } from '../../../../../Shared/Interfaces';
import { EstadoSede } from '../../../../../Shared/Interfaces/enums';

export interface AccesoSedeInfo {
  tieneAcceso: boolean;
  fechaExpiracion: string;
  tiempoRestante: string;
}

@Component({
  selector: 'app-sede-card',
  standalone: true,
  imports: [CommonModule, DecimalPipe, LucideAngularModule],
  templateUrl: './SedeCard.html',
})
export class SedeCardComponent {
  // Iconos
  readonly MapPinIcon = MapPin;
  readonly SettingsIcon = Settings;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly CheckIcon = Check;
  readonly LockIcon = Lock;

  sede = input.required<Sede>();
  esAdmin = input<boolean>(false);
  accesoInfo = input<AccesoSedeInfo>({ tieneAcceso: false, fechaExpiracion: '', tiempoRestante: '' });
  
  onAcceder = output<Sede>();
  onEditar = output<{ sede: Sede; event: Event }>();

  ocupacionPorcentaje = computed(() => {
    const s = this.sede();
    if (s.totalCajones === 0) return 0;
    // Cajones ocupados = tickets activos + reservas activas
    const ocupados = s.ticketsActivos + s.reservasActivas;
    return Math.round((ocupados / s.totalCajones) * 100);
  });

  getEstadoColor(estado: EstadoSede): string {
    switch (estado) {
      case EstadoSede.Activo:
        return 'badge-success';
      case EstadoSede.Inactivo:
        return 'badge-warning';
      case EstadoSede.Mantenimiento:
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  }

  getEstadoTexto(estado: EstadoSede): string {
    switch (estado) {
      case EstadoSede.Activo:
        return 'Activo';
      case EstadoSede.Inactivo:
        return 'Inactivo';
      case EstadoSede.Mantenimiento:
        return 'Mantenimiento';
      default:
        return String(estado);
    }
  }

  getOcupacionColor(porcentaje: number): string {
    if (porcentaje < 50) return 'progress-success';
    if (porcentaje < 80) return 'progress-warning';
    return 'progress-error';
  }

  acceder(): void {
    this.onAcceder.emit(this.sede());
  }

  editar(event: Event): void {
    this.onEditar.emit({ sede: this.sede(), event });
  }
}
