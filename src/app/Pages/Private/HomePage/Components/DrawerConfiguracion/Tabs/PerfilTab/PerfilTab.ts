import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PerfilData {
  nombre: string;
  email: string;
}

@Component({
  selector: 'app-perfil-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './PerfilTab.html'
})
export class PerfilTabComponent {
  nombre = input<string>('');
  email = input<string>('');
  guardando = input<boolean>(false);
  exito = input<boolean>(false);

  nombreLocal = signal<string>('');
  emailLocal = signal<string>('');

  // Estados touched para validaciones
  nombreTouched = signal<boolean>(false);
  emailTouched = signal<boolean>(false);

  // Computed para validaciones
  nombreInvalido = computed(() => this.nombreTouched() && this.nombreLocal().trim().length < 3);
  emailInvalido = computed(() => {
    if (!this.emailTouched()) return false;
    const email = this.emailLocal().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(email);
  });

  // Computed para verificar si el formulario es válido
  formularioValido = computed(() => {
    const nombreValido = this.nombreLocal().trim().length >= 3;
    const email = this.emailLocal().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValido = emailRegex.test(email);
    return nombreValido && emailValido;
  });

  onGuardar = output<PerfilData>();

  
  ngOnInit(): void {
    this.nombreLocal.set(this.nombre());
    this.emailLocal.set(this.email());
  }

  ngOnChanges(): void {
    if (this.nombre()) {
      this.nombreLocal.set(this.nombre());
    }
    if (this.email()) {
      this.emailLocal.set(this.email());
    }
  }

  guardar(): void {
    // Marcar todos los campos como touched para mostrar validaciones
    this.nombreTouched.set(true);
    this.emailTouched.set(true);

    // Si el formulario no es válido, no continuar
    if (!this.formularioValido()) {
      return;
    }

    this.onGuardar.emit({
      nombre: this.nombreLocal(),
      email: this.emailLocal()
    });
  }
}
