import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface NivelForm {
  numeroPiso: number;
  capacidad: number;
}

export interface CrearSedeData {
  nombre: string;
  direccion: string;
  tarifaPorHora: number;
  multaPorHora: number;
  multaConTope: boolean;
  montoMaximoMulta: number;
  passwordAcceso: string;
  niveles: NivelForm[];
}

@Component({
  selector: 'app-modal-crear-sede',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ModalCrearSede.html'
})
export class ModalCrearSedeComponent {
  // Inputs
  isOpen = input.required<boolean>();
  creando = input<boolean>(false);
  error = input<string | null>(null);

  // Outputs
  onCrear = output<CrearSedeData>();
  onCerrar = output<void>();

  // Estado interno del formulario
  nombre = signal<string>('');
  direccion = signal<string>('');
  tarifaPorHora = signal<number>(0);
  multaPorHora = signal<number>(0);
  multaConTope = signal<boolean>(false);
  montoMaximoMulta = signal<number>(0);
  passwordAcceso = signal<string>('');
  niveles = signal<NivelForm[]>([{ numeroPiso: 1, capacidad: 10 }]);
  mostrarPassword = signal<boolean>(false);

  // Computed para total de cajones
  totalCajones = computed(() => {
    return this.niveles().reduce((acc, n) => acc + (n.capacidad || 0), 0);
  });

  // Métodos para niveles
  agregarNivel(): void {
    const nivelesActuales = this.niveles();
    const ultimoPiso = nivelesActuales.length > 0 
      ? Math.max(...nivelesActuales.map(n => n.numeroPiso)) 
      : 0;
    this.niveles.update(niveles => [...niveles, { numeroPiso: ultimoPiso + 1, capacidad: 10 }]);
  }

  eliminarNivel(index: number): void {
    if (this.niveles().length <= 1) return;
    this.niveles.update(niveles => niveles.filter((_, i) => i !== index));
  }

  actualizarCapacidadNivel(index: number, capacidad: number): void {
    this.niveles.update(niveles => 
      niveles.map((nivel, i) => i === index ? { ...nivel, capacidad } : nivel)
    );
  }

  actualizarPisoNivel(index: number, numeroPiso: number): void {
    this.niveles.update(niveles => 
      niveles.map((nivel, i) => i === index ? { ...nivel, numeroPiso } : nivel)
    );
  }

  toggleMostrarPassword(): void {
    this.mostrarPassword.update(v => !v);
  }

  cerrar(): void {
    this.limpiarFormulario();
    this.onCerrar.emit();
  }

  limpiarFormulario(): void {
    this.nombre.set('');
    this.direccion.set('');
    this.tarifaPorHora.set(0);
    this.multaPorHora.set(0);
    this.multaConTope.set(false);
    this.montoMaximoMulta.set(0);
    this.passwordAcceso.set('');
    this.niveles.set([{ numeroPiso: 1, capacidad: 10 }]);
    this.mostrarPassword.set(false);
  }

  crear(): void {
    const data: CrearSedeData = {
      nombre: this.nombre().trim(),
      direccion: this.direccion().trim(),
      tarifaPorHora: this.tarifaPorHora(),
      multaPorHora: this.multaPorHora(),
      multaConTope: this.multaConTope(),
      montoMaximoMulta: this.multaConTope() ? this.montoMaximoMulta() : 0,
      passwordAcceso: this.passwordAcceso(),
      niveles: this.niveles().map(n => ({
        numeroPiso: n.numeroPiso,
        capacidad: n.capacidad
      }))
    };
    this.onCrear.emit(data);
  }
}
