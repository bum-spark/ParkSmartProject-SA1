import { Component, input, output, signal } from '@angular/core';
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
  error = input<string | null>(null);
  exito = input<boolean>(false);

  nombreLocal = signal<string>('');
  emailLocal = signal<string>('');

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
    this.onGuardar.emit({
      nombre: this.nombreLocal(),
      email: this.emailLocal()
    });
  }
}
