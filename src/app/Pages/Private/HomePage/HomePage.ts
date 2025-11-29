import { ChangeDetectionStrategy, Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SedeService } from '../../../Shared/Services/sede.service';
import { AuthService } from '../../../Shared/Services/auth.service';
import { LocalStorage } from '../../../Shared/Services/localStorage.service';
import { Sede, VerificarAccesoSedeBody, UsuarioLista, CrearSedeBody, ActualizarDatosSedeBody, CambiarEstadoSedeBody, AccesoSedeCache } from '../../../Shared/Interfaces';
import { EstadoSede, RolUsuario } from '../../../Shared/Interfaces/enums';
// Import child components
import { 
  NavbarComponent, 
  SedesGridComponent, 
  ModalAccesoSedeComponent,
  DrawerConfiguracionComponent,
  PerfilGuardarEvent,
  CambiarRolEvent,
  ModalCrearSedeComponent,
  ModalEditarSedeComponent,
  ModalAccesoEdicionComponent,
  CrearSedeData,
  EditarSedeData,
  CambiarEstadoData,
  VerificarAccesoData
} from './Components';
import { PasswordData } from './Components/DrawerConfiguracion/Tabs/PasswordTab/PasswordTab';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NavbarComponent, 
    SedesGridComponent, 
    ModalAccesoSedeComponent, 
    DrawerConfiguracionComponent,
    ModalCrearSedeComponent,
    ModalEditarSedeComponent,
    ModalAccesoEdicionComponent
  ],
  templateUrl: './HomePage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  private readonly _sedeService = inject(SedeService);
  private readonly _authService = inject(AuthService);
  private readonly _localStorage = inject(LocalStorage);
  private readonly _router = inject(Router);

  // Estado general
  sedes = signal<Sede[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  
  // Usuario
  nombreUsuario = this._localStorage.nombreUsuario;
  idUsuario = this._localStorage.idUsuario;
  rolUsuario = this._localStorage.rolUsuario;
  
  // Modal de acceso a sede
  modalAccesoAbierto = signal(false);
  sedeSeleccionada = signal<Sede | null>(null);
  verificandoAcceso = signal(false);
  errorAcceso = signal<string | null>(null);

  // Drawer de configuración
  drawerAbierto = signal(false);
  perfilNombre = signal('');
  perfilEmail = signal('');
  guardandoPerfil = signal(false);
  errorPerfil = signal<string | null>(null);
  exitoPerfil = signal(false);
  guardandoPassword = signal(false);
  errorPassword = signal<string | null>(null);
  exitoPassword = signal(false);
  usuarios = signal<UsuarioLista[]>([]);
  cargandoUsuarios = signal(false);
  errorUsuarios = signal<string | null>(null);

  // Modal crear sede
  modalCrearSedeAbierto = signal(false);
  creandoSede = signal(false);
  errorCrearSede = signal<string | null>(null);

  // Modal editar sede
  modalEditarSedeAbierto = signal(false);
  sedeEditando = signal<Sede | null>(null);
  editandoSede = signal(false);
  errorEditarSede = signal<string | null>(null);
  exitoEditarSede = signal(false);
  cambiandoEstado = signal(false);
  errorCambiarEstado = signal<string | null>(null);
  
  // Modal de verificación de acceso para edición
  modalAccesoEdicionAbierto = signal(false);
  sedePendienteEdicion = signal<Sede | null>(null);
  verificandoAccesoEdicion = signal(false);
  errorAccesoEdicion = signal<string | null>(null);

  // Computed para permisos
  esAdminOGerente = computed(() => {
    const rol = this.rolUsuario();
    return rol === RolUsuario.Admin || rol === RolUsuario.Gerente;
  });

  esAdmin = computed(() => this.rolUsuario() === RolUsuario.Admin);

  // Computed para obtener mapa de accesos validos para SedesGridComponent
  accesosValidosMap = computed(() => {
    const map = new Map<string, { fechaExpiracion: Date; tiempoRestante: string }>();
    for (const sede of this.sedes()) {
      if (this._localStorage.tieneAccesoValidoSede(sede.sedeId)) {
        const acceso = this._localStorage.obtenerAccesoSede(sede.sedeId);
        if (acceso) {
          map.set(sede.sedeId, {
            fechaExpiracion: new Date(acceso.validoHasta),
            tiempoRestante: this.obtenerTiempoRestanteAcceso(sede.sedeId)
          });
        }
      }
    }
    return map;
  });

  ngOnInit(): void {
    this.cargarSedes();
    this.cargarDatosUsuario();
  }

  // CARGA DE DATOS
  cargarDatosUsuario(): void {
    const id = this.idUsuario();
    if (id) {
      this._authService.obtenerUsuarioPorId(id).subscribe({
        next: (response) => {
          if (!response.error && response.data) {
            this.perfilNombre.set(response.data.nombreCompleto);
            this.perfilEmail.set(response.data.email);
          }
        }
      });
    }
  }

  cargarSedes(): void {
    this.cargando.set(true);
    this.error.set(null);
    
    this._sedeService.obtenerTodasLasSedes().subscribe({
      next: (response) => {
        this.cargando.set(false);
        if (!response.error && response.data) {
          this.sedes.set(response.data);
        } else {
          this.error.set(response.msg || 'Error al cargar las sedes');
        }
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.msg || 'Error de conexión');
      }
    });
  }

  // DRAWER DE CONFIGURACION
  abrirDrawer(): void {
    this.drawerAbierto.set(true);
    this.cargarDatosUsuario();
  }

  cerrarDrawer(): void {
    this.drawerAbierto.set(false);
    this.limpiarFormularios();
    this.cargarDatosUsuario();
  }

  limpiarFormularios(): void {
    this.errorPerfil.set(null);
    this.exitoPerfil.set(false);
    this.errorPassword.set(null);
    this.exitoPassword.set(false);
  }

  handleGuardarPerfil(event: PerfilGuardarEvent): void {
    if (!event.nombre || !event.email) {
      this.errorPerfil.set('Todos los campos son obligatorios');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(event.email)) {
      this.errorPerfil.set('El correo electrónico no es válido');
      return;
    }

    this.guardandoPerfil.set(true);
    this.errorPerfil.set(null);
    this.exitoPerfil.set(false);

    const id = this.idUsuario();
    if (!id) return;

    this._authService.actualizarUsuario(id, {
      nombreCompleto: event.nombre,
      email: event.email
    }).subscribe({
      next: (response) => {
        this.guardandoPerfil.set(false);
        if (!response.error) {
          this.perfilNombre.set(event.nombre);
          this.perfilEmail.set(event.email);
          this.exitoPerfil.set(true);
          setTimeout(() => this.exitoPerfil.set(false), 3000);
        } else {
          this.errorPerfil.set(response.msg || 'Error al actualizar perfil');
        }
      },
      error: (err) => {
        this.guardandoPerfil.set(false);
        this.errorPerfil.set(err.error?.msg || 'Error de conexión');
      }
    });
  }

  handleGuardarPassword(event: PasswordData): void {
    if (!event.passwordActual || !event.passwordNueva || !event.passwordConfirmar) {
      this.errorPassword.set('Todos los campos son obligatorios');
      return;
    }

    if (event.passwordNueva.length < 6) {
      this.errorPassword.set('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (event.passwordNueva !== event.passwordConfirmar) {
      this.errorPassword.set('Las contraseñas no coinciden');
      return;
    }

    this.guardandoPassword.set(true);
    this.errorPassword.set(null);
    this.exitoPassword.set(false);

    this._authService.cambiarPassword({
      passwordActual: event.passwordActual,
      passwordNueva: event.passwordNueva
    }).subscribe({
      next: (response) => {
        this.guardandoPassword.set(false);
        if (!response.error) {
          this.exitoPassword.set(true);
          setTimeout(() => this.exitoPassword.set(false), 3000);
        } else {
          this.errorPassword.set(response.msg || 'Error al cambiar contraseña');
        }
      },
      error: (err) => {
        this.guardandoPassword.set(false);
        this.errorPassword.set(err.error?.msg || 'Error de conexión');
      }
    });
  }

  handleCambiarRol(event: CambiarRolEvent): void {
    if (this.rolUsuario() === RolUsuario.Gerente && event.nuevoRol === RolUsuario.Admin) {
      return;
    }

    this._authService.cambiarRolUsuario(event.usuarioId, event.nuevoRol).subscribe({
      next: (response) => {
        if (!response.error) {
          this.cargarUsuarios();
        }
      },
      error: (err) => {
        console.error('Error al cambiar rol:', err);
      }
    });
  }

  cargarUsuarios(): void {
    this.cargandoUsuarios.set(true);
    this.errorUsuarios.set(null);

    this._authService.obtenerUsuarios().subscribe({
      next: (response) => {
        this.cargandoUsuarios.set(false);
        if (!response.error && response.data) {
          this.usuarios.set(response.data);
        } else {
          this.errorUsuarios.set(response.msg || 'Error al cargar usuarios');
        }
      },
      error: (err) => {
        this.cargandoUsuarios.set(false);
        this.errorUsuarios.set(err.error?.msg || 'Error de conexión');
      }
    });
  }

  cerrarSesion(): void {
    this._authService.logout();
    this._router.navigate(['/auth/signin']);
  }

  // MODAL ACCESO SEDE
  abrirModalAcceso(sede: Sede): void {
    if (this._localStorage.tieneAccesoValidoSede(sede.sedeId)) {
      this._router.navigate(['/dashboard', sede.sedeId]);
      return;
    }
    
    this.sedeSeleccionada.set(sede);
    this.errorAcceso.set(null);
    this.modalAccesoAbierto.set(true);
  }

  cerrarModalAcceso(): void {
    this.modalAccesoAbierto.set(false);
    this.sedeSeleccionada.set(null);
    this.errorAcceso.set(null);
  }

  verificarAccesoConPassword(password: string): void {
    const sede = this.sedeSeleccionada();
    if (!sede) {
      this.errorAcceso.set('No hay sede seleccionada');
      return;
    }

    this.verificandoAcceso.set(true);
    this.errorAcceso.set(null);

    const datos: VerificarAccesoSedeBody = {
      sedeId: sede.sedeId,
      passwordAcceso: password
    };

    this._sedeService.verificarAccesoSede(datos).subscribe({
      next: (response) => {
        this.verificandoAcceso.set(false);
        if (!response.error) {
          const accesoCache: AccesoSedeCache = {
            sedeId: response.sedeId,
            usuarioId: response.usuarioId,
            validoHasta: response.validoHasta,
            nombreSede: sede.nombre
          };
          this._localStorage.guardarAccesoSede(accesoCache);
          
          this.cerrarModalAcceso();
          this._router.navigate(['/dashboard', sede.sedeId]);
        } else {
          this.errorAcceso.set(response.msg || 'Contraseña incorrecta');
        }
      },
      error: (err) => {
        this.verificandoAcceso.set(false);
        this.errorAcceso.set(err.error?.msg || 'Error al verificar acceso');
      }
    });
  }

  obtenerTiempoRestanteAcceso(sedeId: string): string {
    const tiempoMs = this._localStorage.tiempoRestanteAcceso(sedeId);
    if (tiempoMs <= 0) return '';
    
    const minutos = Math.floor(tiempoMs / 60000);
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    
    if (horas > 0) {
      return `${horas}h ${minutosRestantes}m`;
    }
    return `${minutos}m`;
  }

  // MODAL CREAR SEDE
  abrirModalCrearSede(): void {
    if (!this.esAdmin()) return;
    this.errorCrearSede.set(null);
    this.modalCrearSedeAbierto.set(true);
  }

  cerrarModalCrearSede(): void {
    this.modalCrearSedeAbierto.set(false);
    this.errorCrearSede.set(null);
  }

  handleCrearSede(data: CrearSedeData): void {
    this.creandoSede.set(true);
    this.errorCrearSede.set(null);

    const datos: CrearSedeBody = {
      nombre: data.nombre.trim(),
      direccion: data.direccion.trim(),
      passwordAcceso: data.passwordAcceso,
      tarifaPorHora: data.tarifaPorHora,
      multaPorHora: data.multaPorHora,
      multaConTope: data.multaConTope,
      montoMaximoMulta: data.multaConTope ? data.montoMaximoMulta : 0,
      niveles: data.niveles.map(n => ({
        numeroPiso: n.numeroPiso,
        capacidad: n.capacidad
      }))
    };

    this._sedeService.crearSede(datos).subscribe({
      next: (response) => {
        this.creandoSede.set(false);
        if (!response.error) {
          this.cerrarModalCrearSede();
          this.cargarSedes();
        } else {
          this.errorCrearSede.set(response.msg || 'Error al crear la sede');
        }
      },
      error: (err) => {
        this.creandoSede.set(false);
        this.errorCrearSede.set(err.error?.msg || 'Error de conexión');
      }
    });
  }

  // MODAL EDITAR SEDE
  abrirModalEditarSede(sede: Sede, event: Event): void {
    event.stopPropagation();
    
    if (this._localStorage.tieneAccesoValidoSede(sede.sedeId)) {
      this.abrirModalEdicionDirecta(sede);
    } else {
      this.sedePendienteEdicion.set(sede);
      this.errorAccesoEdicion.set(null);
      this.modalAccesoEdicionAbierto.set(true);
    }
  }

  abrirModalEdicionDirecta(sede: Sede): void {
    this.sedeEditando.set(sede);
    this.errorEditarSede.set(null);
    this.exitoEditarSede.set(false);
    this.errorCambiarEstado.set(null);
    this.modalEditarSedeAbierto.set(true);
  }

  cerrarModalEditarSede(): void {
    this.modalEditarSedeAbierto.set(false);
    this.sedeEditando.set(null);
    this.errorEditarSede.set(null);
    this.exitoEditarSede.set(false);
    this.errorCambiarEstado.set(null);
  }

  handleGuardarEdicion(data: EditarSedeData): void {
    const sede = this.sedeEditando();
    if (!sede) return;

    this.editandoSede.set(true);
    this.errorEditarSede.set(null);

    const body: ActualizarDatosSedeBody = {
      contraseñaCreador: data.contrasenaCreador,
      nombre: data.nombre.trim(),
      direccion: data.direccion.trim(),
      tarifaPorHora: data.tarifaPorHora,
      multaPorHora: data.multaPorHora,
      multaConTope: data.multaConTope,
      montoMaximoMulta: data.montoMaximoMulta,
      niveles: data.niveles.map(n => ({
        numeroPiso: n.numeroPiso,
        capacidad: n.capacidad
      }))
    };

    // Solo incluir passwordAcceso si se proporciono
    if (data.passwordAcceso && data.passwordAcceso.trim()) {
      body.passwordAcceso = data.passwordAcceso.trim();
    }

    this._sedeService.actualizarSedeCompleta(sede.sedeId, body).subscribe({
      next: (response) => {
        this.editandoSede.set(false);
        if (!response.error) {
          this.exitoEditarSede.set(true);
          this.cargarSedes();
          setTimeout(() => {
            this.cerrarModalEditarSede();
          }, 1500);
        } else {
          this.errorEditarSede.set(response.msg || 'Error al actualizar la sede');
        }
      },
      error: (err) => {
        this.editandoSede.set(false);
        this.errorEditarSede.set(err.error?.msg || 'Error de conexión');
      }
    });
  }

  handleCambiarEstado(data: CambiarEstadoData): void {
    const sede = this.sedeEditando();
    if (!sede || sede.estado === data.nuevoEstado) return;

    this.cambiandoEstado.set(true);
    this.errorCambiarEstado.set(null);

    const body: CambiarEstadoSedeBody = {
      nuevoEstado: data.nuevoEstado,
      contraseñaCreador: data.contrasenaCreador
    };

    this._sedeService.cambiarEstadoSede(sede.sedeId, body).subscribe({
      next: (response) => {
        this.cambiandoEstado.set(false);
        if (!response.error) {
          this.sedeEditando.update(s => s ? { ...s, estado: data.nuevoEstado } : null);
          this.cargarSedes();
        } else {
          this.errorCambiarEstado.set(response.msg || 'Error al cambiar el estado');
        }
      },
      error: (err) => {
        this.cambiandoEstado.set(false);
        this.errorCambiarEstado.set(err.error?.msg || 'Error de conexión');
      }
    });
  }

  // MODAL ACCESO EDICION
  cerrarModalAccesoEdicion(): void {
    this.modalAccesoEdicionAbierto.set(false);
    this.sedePendienteEdicion.set(null);
    this.errorAccesoEdicion.set(null);
  }

  handleVerificarAccesoEdicion(data: VerificarAccesoData): void {
    const sede = this.sedePendienteEdicion();
    if (!sede) {
      this.errorAccesoEdicion.set('No hay sede seleccionada');
      return;
    }

    this.verificandoAccesoEdicion.set(true);
    this.errorAccesoEdicion.set(null);

    const datos: VerificarAccesoSedeBody = {
      sedeId: data.sedeId,
      passwordAcceso: data.passwordAcceso
    };

    this._sedeService.verificarAccesoSede(datos).subscribe({
      next: (response) => {
        this.verificandoAccesoEdicion.set(false);
        if (!response.error) {
          const accesoCache: AccesoSedeCache = {
            sedeId: response.sedeId,
            usuarioId: response.usuarioId,
            validoHasta: response.validoHasta,
            nombreSede: sede.nombre
          };
          this._localStorage.guardarAccesoSede(accesoCache);
          
          this.cerrarModalAccesoEdicion();
          this.abrirModalEdicionDirecta(sede);
        } else {
          this.errorAccesoEdicion.set(response.msg || 'Contraseña incorrecta');
        }
      },
      error: (err) => {
        this.verificandoAccesoEdicion.set(false);
        this.errorAccesoEdicion.set(err.error?.msg || 'Error al verificar acceso');
      }
    });
  }
}
