import { Component, input, output, signal, computed, OnChanges, SimpleChanges, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioLista, RolUsuario } from '../../../../../Shared/Interfaces';
import { PerfilTabComponent } from './Tabs/PerfilTab/PerfilTab';
import { PasswordTabComponent, PasswordData } from './Tabs/PasswordTab/PasswordTab';
import { UsuariosTabComponent, CambiarRolData } from './Tabs/UsuariosTab/UsuariosTab';

export type TabConfiguracion = 'perfil' | 'password' | 'usuarios';

export interface PerfilGuardarEvent {
  nombre: string;
  email: string;
}

export type CambiarRolEvent = CambiarRolData;

@Component({
  selector: 'app-drawer-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PerfilTabComponent,
    PasswordTabComponent,
    UsuariosTabComponent
  ],
  templateUrl: './DrawerConfiguracion.html'
})
export class DrawerConfiguracionComponent {
  isOpen = input.required<boolean>();
  nombreUsuario = input.required<string>();
  emailUsuario = input.required<string>();
  rolUsuario = input<RolUsuario | null>(null);
  idUsuario = input<string | null>(null);
  
  guardandoPerfil = input<boolean>(false);
  errorPerfil = input<string>('');
  exitoPerfil = input<boolean>(false);
  
  guardandoPassword = input<boolean>(false);
  errorPassword = input<string>('');
  exitoPassword = input<boolean>(false);
  
  usuarios = input<UsuarioLista[]>([]);
  cargandoUsuarios = input<boolean>(false);
  errorUsuarios = input<string>('');
  
  onCerrar = output<void>();
  onGuardarPerfil = output<PerfilGuardarEvent>();
  onGuardarPassword = output<PasswordData>();
  onCambiarRol = output<CambiarRolEvent>();
  onCargarUsuarios = output<void>();
  
  tabActual = signal<TabConfiguracion>('perfil');
  
  perfilNombreLocal = signal<string>('');
  perfilEmailLocal = signal<string>('');
  
  esAdmin = computed(() => this.rolUsuario() === 'Admin');
  esGerente = computed(() => this.rolUsuario() === 'Gerente');
  esAdminOGerente = computed(() => this.esAdmin() || this.esGerente());
  
  rolesDisponibles = computed(() => {
    if (this.esAdmin()) {
      return ['Admin', 'Gerente', 'Empleado'] as RolUsuario[];
    } else if (this.esGerente()) {
      return ['Gerente', 'Empleado'] as RolUsuario[];
    }
    return [] as RolUsuario[];
  });
  
  constructor() {
    effect(() => {
      const nombre = this.nombreUsuario();
      if (nombre && !this.perfilNombreLocal()) {
        this.perfilNombreLocal.set(nombre);
      }
    });
    
    effect(() => {
      const email = this.emailUsuario();
      if (email && !this.perfilEmailLocal()) {
        this.perfilEmailLocal.set(email);
      }
    });
  }
  
  cambiarTab(tab: TabConfiguracion): void {
    this.tabActual.set(tab);
    
    if (tab === 'usuarios' && this.usuarios().length === 0 && !this.cargandoUsuarios()) {
      this.onCargarUsuarios.emit();
    }
  }
  
  cerrar(): void {
    this.onCerrar.emit();
  }
  
  handleGuardarPerfil(event: { nombre: string; email: string }): void {
    this.onGuardarPerfil.emit(event);
  }
  
  handleGuardarPassword(event: PasswordData): void {
    this.onGuardarPassword.emit(event);
  }
  
  handleCambiarRol(event: CambiarRolData): void {
    this.onCambiarRol.emit(event);
  }
  
  handleReintentarUsuarios(): void {
    this.onCargarUsuarios.emit();
  }
  
  getIniciales(): string {
    const nombre = this.nombreUsuario();
    if (!nombre) return '?';
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
  
  getRolBadgeClass(rol: RolUsuario): string {
    switch (rol) {
      case 'Admin':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Gerente':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Empleado':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  }
  
  getTituloTab(): string {
    switch (this.tabActual()) {
      case 'perfil':
        return 'Mi Perfil';
      case 'password':
        return 'Cambiar Contraseña';
      case 'usuarios':
        return 'Gestión de Usuarios';
      default:
        return '';
    }
  }
}
