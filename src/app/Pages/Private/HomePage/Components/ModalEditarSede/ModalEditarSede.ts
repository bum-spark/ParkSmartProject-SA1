import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sede } from '../../../../../Shared/Interfaces';
import { EstadoSede } from '../../../../../Shared/Interfaces/enums';

export interface NivelFormEditar {
  numeroPiso: number;
  capacidad: number;
}

export interface EditarSedeData {
  nombre: string;
  direccion: string;
  tarifaPorHora: number;
  multaPorHora: number;
  multaConTope: boolean;
  montoMaximoMulta: number;
  passwordAcceso: string;
  niveles: NivelFormEditar[];
  contrasenaCreador: string;
}

export interface CambiarEstadoData {
  nuevoEstado: EstadoSede;
  contrasenaCreador: string;
}

@Component({
  selector: 'app-modal-editar-sede',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ModalEditarSede.html'
})
export class ModalEditarSedeComponent {
  // Inputs
  isOpen = input.required<boolean>();
  sede = input<Sede | null>(null);
  editando = input<boolean>(false);
  error = input<string | null>(null);
  exito = input<boolean>(false);
  errorCambiarEstado = input<string | null>(null);
  cambiandoEstado = input<boolean>(false);

  // Outputs
  onGuardar = output<EditarSedeData>();
  onCambiarEstado = output<CambiarEstadoData>();
  onCerrar = output<void>();

  // Estado interno del formulario
  nombre = signal<string>('');
  direccion = signal<string>('');
  tarifaPorHora = signal<number>(0);
  multaPorHora = signal<number>(0);
  multaConTope = signal<boolean>(false);
  montoMaximoMulta = signal<number>(0);
  passwordAcceso = signal<string>('');
  niveles = signal<NivelFormEditar[]>([]);
  contrasenaCreador = signal<string>('');
  mostrarPasswordAcceso = signal<boolean>(false);
  mostrarPasswordCreador = signal<boolean>(false);

  // Datos originales para comparar cambios
  private datosOriginales = signal<{
    nombre: string;
    direccion: string;
    tarifaPorHora: number;
    multaPorHora: number;
    multaConTope: boolean;
    montoMaximoMulta: number;
    niveles: NivelFormEditar[];
  } | null>(null);

  // Estados disponibles
  estadosSede = [EstadoSede.Activo, EstadoSede.Mantenimiento, EstadoSede.Inactivo];

  // Computed para total de cajones
  totalCajones = computed(() => {
    return this.niveles().reduce((acc, n) => acc + (n.capacidad || 0), 0);
  });

  // Computed para verificar si hay cambios pendientes
  hayCambiosPendientes = computed(() => {
    const originales = this.datosOriginales();
    if (!originales) return false;

    // Comparar campos
    if (this.nombre().trim() !== originales.nombre) return true;
    if (this.direccion().trim() !== originales.direccion) return true;
    if (this.tarifaPorHora() !== originales.tarifaPorHora) return true;
    if (this.multaPorHora() !== originales.multaPorHora) return true;
    if (this.multaConTope() !== originales.multaConTope) return true;
    if (this.montoMaximoMulta() !== originales.montoMaximoMulta) return true;
    if (this.passwordAcceso().trim()) return true; // Nueva contraseña
    
    // Comparar niveles
    const nivelesActuales = this.niveles();
    if (nivelesActuales.length !== originales.niveles.length) return true;
    for (let i = 0; i < nivelesActuales.length; i++) {
      if (nivelesActuales[i].numeroPiso !== originales.niveles[i].numeroPiso ||
          nivelesActuales[i].capacidad !== originales.niveles[i].capacidad) {
        return true;
      }
    }
    
    return false;
  });

  constructor() {
    // Sincronizar datos cuando cambia la sede
    effect(() => {
      const sedeActual = this.sede();
      if (sedeActual && this.isOpen()) {
        this.cargarDatosSede(sedeActual);
      }
    });
  }

  private cargarDatosSede(sede: Sede): void {
    this.nombre.set(sede.nombre);
    this.direccion.set(sede.direccion);
    this.tarifaPorHora.set(sede.tarifaPorHora);
    this.multaPorHora.set(sede.multaPorHora);
    this.multaConTope.set(sede.multaConTope);
    this.montoMaximoMulta.set(sede.montoMaximoMulta);
    this.passwordAcceso.set('');
    this.contrasenaCreador.set('');

    // Crear niveles basados en totalNiveles
    const nivelesSimulados: NivelFormEditar[] = [];
    for (let i = 1; i <= sede.totalNiveles; i++) {
      nivelesSimulados.push({
        numeroPiso: i,
        capacidad: Math.ceil(sede.totalCajones / sede.totalNiveles)
      });
    }
    this.niveles.set(nivelesSimulados);

    // Guardar datos originales
    this.datosOriginales.set({
      nombre: sede.nombre,
      direccion: sede.direccion,
      tarifaPorHora: sede.tarifaPorHora,
      multaPorHora: sede.multaPorHora,
      multaConTope: sede.multaConTope,
      montoMaximoMulta: sede.montoMaximoMulta,
      niveles: JSON.parse(JSON.stringify(nivelesSimulados))
    });
  }

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

  toggleMostrarPasswordAcceso(): void {
    this.mostrarPasswordAcceso.update(v => !v);
  }

  toggleMostrarPasswordCreador(): void {
    this.mostrarPasswordCreador.update(v => !v);
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
    this.niveles.set([]);
    this.contrasenaCreador.set('');
    this.mostrarPasswordAcceso.set(false);
    this.mostrarPasswordCreador.set(false);
    this.datosOriginales.set(null);
  }

  guardar(): void {
    const data: EditarSedeData = {
      nombre: this.nombre().trim(),
      direccion: this.direccion().trim(),
      tarifaPorHora: this.tarifaPorHora(),
      multaPorHora: this.multaPorHora(),
      multaConTope: this.multaConTope(),
      montoMaximoMulta: this.multaConTope() ? this.montoMaximoMulta() : 0,
      passwordAcceso: this.passwordAcceso().trim(),
      niveles: this.niveles().map(n => ({
        numeroPiso: n.numeroPiso,
        capacidad: n.capacidad
      })),
      contrasenaCreador: this.contrasenaCreador()
    };
    this.onGuardar.emit(data);
  }

  cambiarEstado(nuevoEstado: EstadoSede): void {
    const sedeActual = this.sede();
    if (!sedeActual || sedeActual.estado === nuevoEstado) return;
    
    this.onCambiarEstado.emit({
      nuevoEstado,
      contrasenaCreador: this.contrasenaCreador()
    });
  }

  // Helpers para UI
  getEstadoTexto(estado: EstadoSede): string {
    switch (estado) {
      case EstadoSede.Activo: return 'Activo';
      case EstadoSede.Inactivo: return 'Inactivo';
      case EstadoSede.Mantenimiento: return 'Mantenimiento';
      default: return String(estado);
    }
  }

  getEstadoBotonClass(estado: EstadoSede): string {
    const sedeActual = this.sede();
    const esEstadoActual = sedeActual?.estado === estado;
    
    if (esEstadoActual) {
      switch (estado) {
        case EstadoSede.Activo: return 'btn-success cursor-not-allowed';
        case EstadoSede.Mantenimiento: return 'btn-error cursor-not-allowed';
        case EstadoSede.Inactivo: return 'btn-warning cursor-not-allowed';
        default: return 'btn-neutral cursor-not-allowed';
      }
    }
    
    switch (estado) {
      case EstadoSede.Activo: return 'btn-outline border-green-500 text-green-400 hover:bg-green-500 hover:text-white';
      case EstadoSede.Mantenimiento: return 'btn-outline border-red-500 text-red-400 hover:bg-red-500 hover:text-white';
      case EstadoSede.Inactivo: return 'btn-outline border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white';
      default: return 'btn-outline';
    }
  }
}
