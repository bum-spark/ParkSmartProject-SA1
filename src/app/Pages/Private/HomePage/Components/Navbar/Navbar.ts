import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Navbar.html',
})
export class NavbarComponent {
  nombreUsuario = input<string>('Usuario');
  
  onAbrirDrawer = output<void>();
  onCerrarSesion = output<void>();

  iniciales = computed(() => {
    const nombre = this.nombreUsuario();
    if (!nombre) return '??';
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  });

  abrirDrawer(): void {
    this.onAbrirDrawer.emit();
  }

  cerrarSesion(): void {
    this.onCerrarSesion.emit();
  }
}
