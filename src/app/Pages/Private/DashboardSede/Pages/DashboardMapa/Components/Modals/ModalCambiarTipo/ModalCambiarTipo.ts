import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Settings, Car, Zap, Accessibility, Check } from 'lucide-angular';
import { ModalCambiarTipo, TipoCajon } from '../../../../../Interfaces/dashboard.interfaces';

@Component({
  selector: 'app-modal-cambiar-tipo',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './ModalCambiarTipo.html'
})
export class ModalCambiarTipoComponent {
  readonly SettingsIcon = Settings;
  readonly CarIcon = Car;
  readonly ZapIcon = Zap;
  readonly AccessibilityIcon = Accessibility;
  readonly CheckIcon = Check;

  modal = input.required<ModalCambiarTipo>();
  tiposCajon: TipoCajon[] = ['normal', 'electrico', 'discapacitado'];
  
  onCerrar = output<void>();
  onCambiarTipo = output<void>();
  onTipoChange = output<TipoCajon>();

  getTipoCajonLabel(tipo: TipoCajon): string {
    switch (tipo) {
      case 'normal': return 'Normal';
      case 'electrico': return 'Eléctrico';
      case 'discapacitado': return 'Discapacitado';
      default: return tipo;
    }
  }

  actualizarTipo(tipo: TipoCajon): void {
    this.onTipoChange.emit(tipo);
  }

  cambiarTipo(): void {
    this.onCambiarTipo.emit();
  }

  cerrar(): void {
    this.onCerrar.emit();
  }
}
