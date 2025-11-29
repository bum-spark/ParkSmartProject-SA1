import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioLista } from '../../../../../../../Shared/Interfaces';
import { RolUsuario } from '../../../../../../../Shared/Interfaces/enums';

export interface CambiarRolData {
  usuarioId: string;
  nuevoRol: RolUsuario;
}

@Component({
  selector: 'app-usuarios-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './UsuariosTab.html'
})
export class UsuariosTabComponent {
  usuarios = input<UsuarioLista[]>([]);
  cargando = input<boolean>(false);
  error = input<string | null>(null);
  esAdmin = input<boolean>(false);
  idUsuarioActual = input<string | null>(null);

  modalAbierto = signal<boolean>(false);
  usuarioSeleccionado = signal<UsuarioLista | null>(null);
  nuevoRolSeleccionado = signal<RolUsuario | null>(null);
  guardandoRol = signal<boolean>(false);
  errorCambiarRol = signal<string | null>(null);

  onCambiarRol = output<CambiarRolData>();
  onRecargar = output<void>();

  rolesDisponibles = computed(() => {
    if (this.esAdmin()) {
      return [RolUsuario.Admin, RolUsuario.Gerente, RolUsuario.Empleado];
    }
    return [RolUsuario.Gerente, RolUsuario.Empleado];
  });

  puedeEditar(usuario: UsuarioLista): boolean {
    if (usuario.usuarioId === this.idUsuarioActual()) return false;
    
    if (this.esAdmin()) return true;
    
    return usuario.rol !== RolUsuario.Admin;
  }

  getRolBadgeClass(rol: RolUsuario): string {
    switch (rol) {
      case RolUsuario.Admin:
        return 'badge-error';
      case RolUsuario.Gerente:
        return 'badge-warning';
      case RolUsuario.Empleado:
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  }

  abrirModalCambiarRol(usuario: UsuarioLista): void {
    this.usuarioSeleccionado.set(usuario);
    this.nuevoRolSeleccionado.set(usuario.rol);
    this.errorCambiarRol.set(null);
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.usuarioSeleccionado.set(null);
    this.nuevoRolSeleccionado.set(null);
    this.errorCambiarRol.set(null);
    this.guardandoRol.set(false);
  }

  guardarCambioRol(): void {
    const usuario = this.usuarioSeleccionado();
    const nuevoRol = this.nuevoRolSeleccionado();
    
    if (!usuario || !nuevoRol) return;
    
    this.guardandoRol.set(true);
    this.onCambiarRol.emit({
      usuarioId: usuario.usuarioId,
      nuevoRol: nuevoRol
    });
  }

  finalizarCambioRol(exito: boolean, error?: string): void {
    this.guardandoRol.set(false);
    if (exito) {
      this.cerrarModal();
    } else {
      this.errorCambiarRol.set(error || 'Error al cambiar rol');
    }
  }

  recargar(): void {
    this.onRecargar.emit();
  }
}
