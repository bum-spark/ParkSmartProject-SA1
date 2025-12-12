import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Building2, X, Plus, Trash2, Key, Eye, EyeOff } from 'lucide-angular';

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
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ModalCrearSede.html'
})
export class ModalCrearSedeComponent {
  // Lucide icons
  readonly Building2Icon = Building2;
  readonly XIcon = X;
  readonly PlusIcon = Plus;
  readonly Trash2Icon = Trash2;
  readonly KeyIcon = Key;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;

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

  // Estados touched para validaciones
  nombreTouched = signal<boolean>(false);
  direccionTouched = signal<boolean>(false);
  tarifaTouched = signal<boolean>(false);
  multaTouched = signal<boolean>(false);
  passwordTouched = signal<boolean>(false);
  montoMaximoTouched = signal<boolean>(false);

  // Computed para validaciones
  nombreInvalido = computed(() => this.nombreTouched() && this.nombre().trim().length < 3);
  direccionInvalida = computed(() => this.direccionTouched() && this.direccion().trim().length < 5);
  tarifaInvalida = computed(() => this.tarifaTouched() && this.tarifaPorHora() <= 0);
  multaInvalida = computed(() => this.multaTouched() && this.multaPorHora() < 0);
  passwordInvalido = computed(() => this.passwordTouched() && this.passwordAcceso().length < 4);
  montoMaximoInvalido = computed(() => this.multaConTope() && this.montoMaximoTouched() && this.montoMaximoMulta() <= 0);

  // Computed para verificar si el formulario es válido
  formularioValido = computed(() => {
    const nombreValido = this.nombre().trim().length >= 3;
    const direccionValida = this.direccion().trim().length >= 5;
    const tarifaValida = this.tarifaPorHora() > 0;
    const multaValida = this.multaPorHora() >= 0;
    const passwordValido = this.passwordAcceso().length >= 4;
    const montoMaximoValido = !this.multaConTope() || this.montoMaximoMulta() > 0;
    return nombreValido && direccionValida && tarifaValida && multaValida && passwordValido && montoMaximoValido;
  });

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
    // Limpiar touched
    this.nombreTouched.set(false);
    this.direccionTouched.set(false);
    this.tarifaTouched.set(false);
    this.multaTouched.set(false);
    this.passwordTouched.set(false);
    this.montoMaximoTouched.set(false);
  }

  crear(): void {
    // Marcar todos los campos como touched para mostrar validaciones
    this.nombreTouched.set(true);
    this.direccionTouched.set(true);
    this.tarifaTouched.set(true);
    this.multaTouched.set(true);
    this.passwordTouched.set(true);
    if (this.multaConTope()) {
      this.montoMaximoTouched.set(true);
    }

    // Si el formulario no es válido, no continuar
    if (!this.formularioValido()) {
      return;
    }

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
