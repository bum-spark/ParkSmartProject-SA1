import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { LucideAngularModule, Lock, Eye, EyeOff } from 'lucide-angular';
import { SedeService } from '../../../Shared/Services/sede.service';
import { AsignacionService } from '../../../Shared/Services/asignacion.service';
import { AuthService } from '../../../Shared/Services/auth.service';
import { LocalStorage } from '../../../Shared/Services/localStorage.service';
import { Sede, NivelConCajones, EstadisticaSede, VerificarAccesoSedeBody, AccesoSedeCache } from '../../../Shared/Interfaces/sede.interface';
import { Reserva, TransaccionHistorial, AsignarCajonEspecificoBody, AsignarCajonAutomaticoBody, NuevaReservaBody, CambiarTipoCajonBody } from '../../../Shared/Interfaces/asignacion.interface';
import { DashboardStateService } from './Services/dashboard-state.service';
import {
  type TabActiva,
  type EntradaVehiculoEvent,
  type SalidaVehiculoEvent,
  type CrearReservaEvent,
  type PagarReservaEvent,
  type CambiarTipoCajonEvent,
  type AsignacionAutomaticaEvent
} from './Interfaces/dashboard.interfaces';
import { DashboardSidebarComponent } from './Components/DashboardSidebar/DashboardSidebar';
import { DashboardHeaderComponent } from './Components/DashboardHeader/DashboardHeader';

@Component({
  selector: 'app-dashboard-sede',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, DashboardSidebarComponent, DashboardHeaderComponent, LucideAngularModule],
  templateUrl: './DashboardSede.html'
})
export class DashboardSede implements OnInit, OnDestroy {
  // Iconos
  readonly LockIcon = Lock;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sedeService = inject(SedeService);
  private asignacionService = inject(AsignacionService);
  private authService = inject(AuthService);
  readonly localStorage = inject(LocalStorage);
  private dashboardState = inject(DashboardStateService);

  // Exponer signals del servicio de estado
  sede = this.dashboardState.sede;
  estadisticas = this.dashboardState.estadisticas;
  niveles = this.dashboardState.niveles;
  reservas = this.dashboardState.reservas;
  historial = this.dashboardState.historial;
  loading = this.dashboardState.loading;
  error = this.dashboardState.error;
  esAdmin = this.dashboardState.esAdmin;
  tabActiva = signal<TabActiva>('dashboard');
  resumenEstadisticas = this.dashboardState.resumenEstadisticas;
  cantidadReservasActivas = this.dashboardState.cantidadReservasActivas;

  // Modal de acceso (cuando no tiene permisos para la sede)
  modalAccesoAbierto = signal(false);
  sedeIdPendiente = signal<string | null>(null);
  nombreSedePendiente = signal<string>('');
  verificandoAcceso = signal(false);
  errorAcceso = signal<string | null>(null);
  passwordAcceso = signal('');
  mostrarPassword = signal(false);

  ngOnInit(): void {
    this.cargarUsuario();
    // Registrar callback para que los hijos puedan solicitar recarga de datos
    this.dashboardState.registrarRecargarCallback(() => this.recargarDatos());
    
    this.route.params.subscribe(params => {
      const sedeId = params['sedeId'];
      if (sedeId) this.cargarDatosSede(sedeId);
    });
    this.route.firstChild?.url.subscribe(segments => {
      if (segments && segments.length > 0) {
        this.tabActiva.set(segments[0].path as TabActiva);
      }
    });
  }

  ngOnDestroy(): void {
    this.dashboardState.reset();
  }

  private cargarUsuario(): void {
    const rol = this.localStorage.rolUsuario();
    this.dashboardState.setEsAdmin(
      rol?.toLowerCase() === 'admin' || 
      rol?.toLowerCase() === 'administrador' ||
      rol === 'Admin'
    );
  }

  private async cargarDatosSede(sedeId: string): Promise<void> {
    this.dashboardState.setLoading(true);
    this.dashboardState.setError(null);
    try {
      const sedeResponse = await firstValueFrom(this.sedeService.obtenerSedePorId(sedeId));
      if (sedeResponse.data) this.dashboardState.setSede(sedeResponse.data);

      const estadResponse = await firstValueFrom(this.sedeService.obtenerEstadisticasSede(sedeId));
      if (estadResponse.data) this.dashboardState.setEstadisticas(estadResponse.data);

      const nivelesResponse = await firstValueFrom(this.sedeService.obtenerNivelesDeSede(sedeId));
      if (nivelesResponse.data) this.dashboardState.setNiveles(nivelesResponse.data);

      const reservasResponse = await firstValueFrom(this.asignacionService.obtenerReservasDeSede(sedeId));
      if (reservasResponse.data) this.dashboardState.setReservas(reservasResponse.data);

      const historialResponse = await firstValueFrom(this.asignacionService.obtenerHistorialCompleto(sedeId));
      if (historialResponse.data) this.dashboardState.setHistorial(historialResponse.data);
    } catch (err: any) {
      // Se ddetecta si hay un error
      const statusCode = err.status;
      const errorMsg = err.error?.msg || err.message || '';
      
      const esErrorAcceso = 
        statusCode === 401 || 
        statusCode === 403 || 
        errorMsg.toLowerCase().includes('acceso') ||
        errorMsg.toLowerCase().includes('autorizado') ||
        errorMsg.toLowerCase().includes('permiso') ||
        errorMsg.toLowerCase().includes('verificar');

      if (esErrorAcceso) {
        // Abrir modal de verificación de acceso
        this.sedeIdPendiente.set(sedeId);
        // Intentar obtener el nombre de la sede del error o usar un genérico
        this.nombreSedePendiente.set(err.error?.nombreSede || 'esta sede');
        this.errorAcceso.set(null);
        this.passwordAcceso.set('');
        this.modalAccesoAbierto.set(true);
        this.dashboardState.setLoading(false);
      } else {
        this.dashboardState.setError(errorMsg || 'Error al cargar datos de la sede');
      }
    } finally {
      if (!this.modalAccesoAbierto()) {
        this.dashboardState.setLoading(false);
      }
    }
  }
  
  toggleMostrarPassword(): void {
    this.mostrarPassword.update(v => !v);
  }

  async verificarAccesoConPassword(): Promise<void> {
    const sedeId = this.sedeIdPendiente();
    const password = this.passwordAcceso();
    
    if (!sedeId || !password.trim()) {
      this.errorAcceso.set('Ingresa la contraseña de acceso');
      return;
    }

    this.verificandoAcceso.set(true);
    this.errorAcceso.set(null);

    try {
      const datos: VerificarAccesoSedeBody = {
        sedeId,
        passwordAcceso: password
      };

      const response = await firstValueFrom(this.sedeService.verificarAccesoSede(datos));

      if (!response.error) {
        // Guardar acceso en localStorage
        const accesoCache: AccesoSedeCache = {
          sedeId: response.sedeId,
          usuarioId: response.usuarioId,
          validoHasta: response.validoHasta,
          nombreSede: this.nombreSedePendiente()
        };
        this.localStorage.guardarAccesoSede(accesoCache);
        
        // Cerrar modal y cargar datos
        this.cerrarModalAcceso();
        await this.cargarDatosSede(sedeId);
      } else {
        this.errorAcceso.set(response.msg || 'Contraseña incorrecta');
      }
    } catch (err: any) {
      this.errorAcceso.set(err.error?.msg || 'Error al verificar acceso');
    } finally {
      this.verificandoAcceso.set(false);
    }
  }

  cerrarModalAcceso(): void {
    this.modalAccesoAbierto.set(false);
    this.sedeIdPendiente.set(null);
    this.nombreSedePendiente.set('');
    this.errorAcceso.set(null);
    this.passwordAcceso.set('');
    this.mostrarPassword.set(false);
  }

  cancelarYVolverHome(): void {
    this.cerrarModalAcceso();
    this.router.navigate(['/home']);
  }

  handleKeydownPassword(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.passwordAcceso().trim() && !this.verificandoAcceso()) {
      this.verificarAccesoConPassword();
    }
    if (event.key === 'Escape') {
      this.cancelarYVolverHome();
    }
  }

  navegarA(tab: TabActiva): void {
    const sedeId = this.sede()?.sedeId;
    if (sedeId) {
      this.router.navigate(['/dashboard', sedeId, tab]);
      this.tabActiva.set(tab);
    }
  }

  volverInicio(): void { this.router.navigate(['/home']); }
  
  cerrarSesion(): void { 
    this.authService.logout(); 
    this.router.navigate(['/signin']); 
  }

  async handleEntradaVehiculo(event: EntradaVehiculoEvent): Promise<void> {
    try {
      const sedeId = this.sede()?.sedeId;
      if (!sedeId) return;
      const body: AsignarCajonEspecificoBody = { sedeId, cajonId: event.cajonId, placaVehiculo: event.placaVehiculo };
      const response = await firstValueFrom(this.asignacionService.asignarCajonEspecifico(body));
      if (!response.error) await this.recargarDatos();
    } catch (err) { console.error('Error al registrar entrada:', err); }
  }

  async handleSalidaVehiculo(event: SalidaVehiculoEvent): Promise<void> {
    try {
      const response = await firstValueFrom(this.asignacionService.pagarTicket(event.cajonId));
      if (!response.error) await this.recargarDatos();
    } catch (err) { console.error('Error al registrar salida:', err); }
  }

  async handleCrearReserva(event: CrearReservaEvent): Promise<void> {
    try {
      const sedeId = this.sede()?.sedeId;
      if (!sedeId) return;
      const body: NuevaReservaBody = { sedeId, cajonId: event.cajonId, placaVehiculo: event.placaVehiculo, duracionHoras: event.duracionHoras };
      const response = await firstValueFrom(this.asignacionService.crearReserva(body));
      if (!response.error) await this.recargarDatos();
    } catch (err) { console.error('Error al crear reserva:', err); }
  }

  async handlePagarReserva(event: PagarReservaEvent): Promise<void> {
    try {
      const response = await firstValueFrom(this.asignacionService.pagarReserva(event.reservaId));
      if (!response.error) await this.recargarDatos();
    } catch (err) { console.error('Error al pagar reserva:', err); }
  }

  async handleCambiarTipoCajon(event: CambiarTipoCajonEvent): Promise<void> {
    try {
      const sedeId = this.sede()?.sedeId;
      if (!sedeId) return;
      const body: CambiarTipoCajonBody = { sedeId, cajonId: event.cajonId, nuevoTipo: event.nuevoTipo as any };
      const response = await firstValueFrom(this.asignacionService.cambiarTipoCajon(body));
      if (!response.error) await this.recargarDatos();
    } catch (err) { console.error('Error al cambiar tipo de cajon:', err); }
  }

  async handleAsignacionAutomatica(event: AsignacionAutomaticaEvent): Promise<void> {
    try {
      const sedeId = this.sede()?.sedeId;
      if (!sedeId) return;
      const body: AsignarCajonAutomaticoBody = { sedeId, numeroPiso: parseInt(event.nivelId), placaVehiculo: event.placaVehiculo };
      const response = await firstValueFrom(this.asignacionService.asignarCajonAutomatico(body));
      if (!response.error) await this.recargarDatos();
    } catch (err) { console.error('Error en asignacion automatica:', err); }
  }

  private async recargarDatos(): Promise<void> {
    const sedeId = this.sede()?.sedeId;
    if (sedeId) await this.cargarDatosSede(sedeId);
  }

  async recargar(): Promise<void> {
    await this.recargarDatos();
  }

  getIniciales(): string {
    const nombre = this.localStorage.nombreUsuario();
    if (!nombre) return 'U';
    const partes = nombre.split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }
}
