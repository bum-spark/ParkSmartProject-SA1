import { Component, computed, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { DashboardStateService } from '../../Services/dashboard-state.service';
import { AsignacionService } from '../../../../../Shared/Services/asignacion.service';
import { 
  Cajon, 
  TipoCajon,
  ModalEntrada,
  ModalSalida,
  ModalReserva,
  ModalCambiarTipo,
  ModalAsignacionAutomatica,
  ModalDetalleReserva,
  CostoTicket,
  CostoReserva
} from '../../Interfaces/dashboard.interfaces';
import { Reserva, DetallesPagoReserva } from '../../../../../Shared/Interfaces/asignacion.interface';
import { TipoCajon as TipoCajonEnum, EstadoReserva } from '../../../../../Shared/Interfaces/enums';
import { CajonesGridComponent } from './Components/CajonesGrid/CajonesGrid';
import { LucideAngularModule, Car, Zap, Accessibility } from 'lucide-angular';
import { ModalEntradaComponent } from './Components/Modals/ModalEntrada/ModalEntrada';
import { ModalSalidaComponent } from './Components/Modals/ModalSalida/ModalSalida';
import { ModalReservaComponent } from './Components/Modals/ModalReserva/ModalReserva';
import { ModalAsignacionAutomaticaComponent } from './Components/Modals/ModalAsignacionAutomatica/ModalAsignacionAutomatica';
import { ModalCambiarTipoComponent } from './Components/Modals/ModalCambiarTipo/ModalCambiarTipo';
import { ModalDetalleReservaComponent } from './Components/Modals/ModalDetalleReserva/ModalDetalleReserva';

@Component({
  selector: 'app-dashboard-mapa',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CajonesGridComponent, 
    LucideAngularModule,
    ModalEntradaComponent,
    ModalSalidaComponent,
    ModalReservaComponent,
    ModalCambiarTipoComponent,
    ModalAsignacionAutomaticaComponent,
    ModalDetalleReservaComponent
  ],
  templateUrl: './DashboardMapa.html'
})
export class DashboardMapa {
  private dashboardState = inject(DashboardStateService);
  private asignacionService = inject(AsignacionService);

  // Lucide icons (solo los necesarios para leyenda)
  readonly CarIcon = Car;
  readonly ZapIcon = Zap;
  readonly AccessibilityIcon = Accessibility;

  // Estado del servicio compartido
  niveles = this.dashboardState.niveles;
  sede = this.dashboardState.sede;
  esAdmin = this.dashboardState.esAdmin;

  // Estado local del componente
  nivelSeleccionado = signal<number | null>(null);

  // Effect para seleccionar automáticamente el primer nivel cuando se cargan los datos
  private seleccionarPrimerNivelEffect = effect(() => {
    const nivelesDisponibles = this.niveles();
    const nivelActual = this.nivelSeleccionado();
    
    // Si hay niveles y no hay nivel seleccionado o el nivel seleccionado no existe
    if (nivelesDisponibles.length > 0) {
      const nivelExiste = nivelesDisponibles.some(n => n.numeroPiso === nivelActual);
      
      if (nivelActual === null || !nivelExiste) {
        // Ordenar niveles por número de piso y seleccionar el primero
        const nivelesSorted = [...nivelesDisponibles].sort((a, b) => a.numeroPiso - b.numeroPiso);
        this.nivelSeleccionado.set(nivelesSorted[0].numeroPiso);
      }
    }
  });

  // Estados de modales locales
  modalEntrada = signal<ModalEntrada>({
    abierto: false,
    cajon: null,
    placaVehiculo: '',
    cargando: false,
    error: ''
  });
  
  modalSalida = signal<ModalSalida>({
    abierto: false,
    cajon: null,
    calculando: false,
    costoCalculado: null,
    cargando: false,
    error: ''
  });
  
  modalReserva = signal<ModalReserva>({
    abierto: false,
    cajon: null,
    placaVehiculo: '',
    duracionHoras: 1,
    cargando: false,
    error: ''
  });
  
  modalCambiarTipo = signal<ModalCambiarTipo>({
    abierto: false,
    cajon: null,
    nuevoTipo: 'normal',
    cargando: false,
    error: ''
  });
  
  modalAsignacionAutomatica = signal<ModalAsignacionAutomatica>({
    abierto: false,
    placaVehiculo: '',
    cargando: false,
    error: '',
    exito: null
  });

  // Modal para pago de reserva (cuando se hace clic en cajón reservado)
  modalDetalleReserva = signal<ModalDetalleReserva>({
    abierto: false,
    reserva: null,
    calculando: false,
    costoCalculado: null,
    cargando: false,
    error: ''
  });

  // Constantes
  tiposCajon: TipoCajon[] = ['normal', 'electrico', 'discapacitado'];

  // Computed
  tarifaPorHora = computed(() => this.sede()?.tarifaPorHora || 0);

  cajonesDelNivel = computed(() => {
    const nivel = this.niveles().find(n => n.numeroPiso === this.nivelSeleccionado());
    const cajones = nivel?.cajones || [];
    
    // Ordenar cajones por número de manera natural (N1-1, N1-2, ... N1-10, N1-11)
    return [...cajones].sort((a, b) => {
      // Extraer el número del cajón del formato "N{nivel}-{numero}"
      const extraerNumero = (numeroCajon: string): number => {
        const match = numeroCajon.match(/-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      };
      
      return extraerNumero(a.numeroCajon) - extraerNumero(b.numeroCajon);
    });
  });

  // Métodos de utilidad
  getTipoCajonLabel(tipo: TipoCajon): string {
    switch (tipo) {
      case 'normal': return 'Normal';
      case 'electrico': return 'Eléctrico';
      case 'discapacitado': return 'Discapacitado';
      default: return tipo;
    }
  }

  formatearFecha(fecha: string | Date): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  cambiarNivel(nivel: number): void {
    this.nivelSeleccionado.set(nivel);
  }

  // Handlers para clicks en cajones
  handleCajonClick(cajon: Cajon): void {
    switch (cajon.estadoActual) {
      case 'libre':
        this.abrirModalEntrada(cajon);
        break;
      case 'ocupado':
        this.abrirModalSalida(cajon);
        break;
      case 'reservado':
        this.abrirModalPagoReserva(cajon);
        break;
    }
  }

  // Modal de Entrada
  abrirModalEntrada(cajon: Cajon): void {
    this.modalEntrada.set({
      abierto: true,
      cajon,
      placaVehiculo: '',
      cargando: false,
      error: ''
    });
  }

  cerrarModalEntrada(): void {
    this.modalEntrada.set({
      abierto: false,
      cajon: null,
      placaVehiculo: '',
      cargando: false,
      error: ''
    });
  }

  actualizarPlacaEntrada(placa: string): void {
    this.modalEntrada.update(m => ({ ...m, placaVehiculo: placa }));
  }

  async registrarEntrada(): Promise<void> {
    const modal = this.modalEntrada();
    const sedeId = this.sede()?.sedeId;
    if (!modal.cajon || !sedeId) return;

    this.modalEntrada.update(m => ({ ...m, cargando: true, error: '' }));

    try {
      const response = await firstValueFrom(
        this.asignacionService.asignarCajonEspecifico({
          sedeId,
          cajonId: modal.cajon.cajonId,
          placaVehiculo: modal.placaVehiculo
        })
      );

      if (!response.error) {
        this.cerrarModalEntrada();
        // Recargar todos los datos para mantener sincronizado
        await this.dashboardState.recargarDatos();
      } else {
        this.modalEntrada.update(m => ({ ...m, error: response.msg || 'Error al registrar entrada' }));
      }
    } catch (err: any) {
      this.modalEntrada.update(m => ({ ...m, error: err.error?.msg || 'Error al registrar entrada' }));
    } finally {
      this.modalEntrada.update(m => ({ ...m, cargando: false }));
    }
  }

  // Modal de Salida
  abrirModalSalida(cajon: Cajon): void {
    this.modalSalida.set({
      abierto: true,
      cajon,
      calculando: true,
      costoCalculado: null,
      cargando: false,
      error: ''
    });
    this.calcularCostoSalida(cajon);
  }

  cerrarModalSalida(): void {
    this.modalSalida.set({
      abierto: false,
      cajon: null,
      calculando: false,
      costoCalculado: null,
      cargando: false,
      error: ''
    });
  }

  async calcularCostoSalida(cajon: Cajon): Promise<void> {
    if (!cajon.ticketActualId) {
      this.modalSalida.update(m => ({ ...m, calculando: false, error: 'No hay ticket activo para este cajón' }));
      return;
    }

    try {
      const response = await firstValueFrom(
        this.asignacionService.calcularPagoTicket(cajon.ticketActualId)
      );

      if (!response.error && response.data) {
        this.modalSalida.update(m => ({ 
          ...m, 
          calculando: false, 
          costoCalculado: response.data as unknown as CostoTicket 
        }));
      } else {
        this.modalSalida.update(m => ({ ...m, calculando: false, error: response.msg || 'Error al calcular costo' }));
      }
    } catch (err: any) {
      this.modalSalida.update(m => ({ ...m, calculando: false, error: err.error?.msg || 'Error al calcular costo' }));
    }
  }

  async procesarPago(): Promise<void> {
    const modal = this.modalSalida();
    if (!modal.cajon?.ticketActualId) return;

    this.modalSalida.update(m => ({ ...m, cargando: true, error: '' }));

    try {
      const response = await firstValueFrom(
        this.asignacionService.pagarTicket(modal.cajon.ticketActualId)
      );

      if (!response.error) {
        this.cerrarModalSalida();
        // Recargar todos los datos (incluyendo historial)
        await this.dashboardState.recargarDatos();
      } else {
        this.modalSalida.update(m => ({ ...m, error: response.msg || 'Error al procesar pago' }));
      }
    } catch (err: any) {
      this.modalSalida.update(m => ({ ...m, error: err.error?.msg || 'Error al procesar pago' }));
    } finally {
      this.modalSalida.update(m => ({ ...m, cargando: false }));
    }
  }

  // Modal de Reserva
  abrirModalReserva(cajon: Cajon, event: MouseEvent): void {
    event.stopPropagation();
    this.modalReserva.set({
      abierto: true,
      cajon,
      placaVehiculo: '',
      duracionHoras: 1,
      cargando: false,
      error: ''
    });
  }

  cerrarModalReserva(): void {
    this.modalReserva.set({
      abierto: false,
      cajon: null,
      placaVehiculo: '',
      duracionHoras: 1,
      cargando: false,
      error: ''
    });
  }

  actualizarPlacaReserva(placa: string): void {
    this.modalReserva.update(m => ({ ...m, placaVehiculo: placa }));
  }

  actualizarDuracionReserva(duracion: number): void {
    this.modalReserva.update(m => ({ ...m, duracionHoras: duracion }));
  }

  async crearReserva(): Promise<void> {
    const modal = this.modalReserva();
    const sedeId = this.sede()?.sedeId;
    if (!modal.cajon || !sedeId) return;

    this.modalReserva.update(m => ({ ...m, cargando: true, error: '' }));

    try {
      const response = await firstValueFrom(
        this.asignacionService.crearReserva({
          sedeId,
          cajonId: modal.cajon.cajonId,
          placaVehiculo: modal.placaVehiculo,
          duracionHoras: modal.duracionHoras
        })
      );

      if (!response.error) {
        this.cerrarModalReserva();
        // Recargar todos los datos (niveles + reservas) para actualizar badge y estado
        await this.dashboardState.recargarDatos();
      } else {
        this.modalReserva.update(m => ({ ...m, error: response.msg || 'Error al crear reserva' }));
      }
    } catch (err: any) {
      this.modalReserva.update(m => ({ ...m, error: err.error?.msg || 'Error al crear reserva' }));
    } finally {
      this.modalReserva.update(m => ({ ...m, cargando: false }));
    }
  }

  // Modal Cambiar Tipo
  abrirModalCambiarTipo(cajon: Cajon, event: MouseEvent): void {
    event.stopPropagation();
    this.modalCambiarTipo.set({
      abierto: true,
      cajon,
      nuevoTipo: cajon.tipo as TipoCajon,
      cargando: false,
      error: ''
    });
  }

  cerrarModalCambiarTipo(): void {
    this.modalCambiarTipo.set({
      abierto: false,
      cajon: null,
      nuevoTipo: 'normal',
      cargando: false,
      error: ''
    });
  }

  actualizarNuevoTipo(tipo: TipoCajon): void {
    this.modalCambiarTipo.update(m => ({ ...m, nuevoTipo: tipo }));
  }

  async cambiarTipoCajon(): Promise<void> {
    const modal = this.modalCambiarTipo();
    const sedeId = this.sede()?.sedeId;
    if (!modal.cajon || !sedeId) return;

    this.modalCambiarTipo.update(m => ({ ...m, cargando: true, error: '' }));

    try {
      const response = await firstValueFrom(
        this.asignacionService.cambiarTipoCajon({
          sedeId,
          cajonId: modal.cajon.cajonId,
          nuevoTipo: modal.nuevoTipo as TipoCajonEnum
        })
      );

      if (!response.error) {
        this.cerrarModalCambiarTipo();
        await this.dashboardState.recargarDatos();
      } else {
        this.modalCambiarTipo.update(m => ({ ...m, error: response.msg || 'Error al cambiar tipo' }));
      }
    } catch (err: any) {
      this.modalCambiarTipo.update(m => ({ ...m, error: err.error?.msg || 'Error al cambiar tipo' }));
    } finally {
      this.modalCambiarTipo.update(m => ({ ...m, cargando: false }));
    }
  }

  // Modal Asignación Automática
  abrirModalAsignacion(): void {
    this.modalAsignacionAutomatica.set({
      abierto: true,
      placaVehiculo: '',
      cargando: false,
      error: '',
      exito: null
    });
  }

  cerrarModalAsignacion(): void {
    this.modalAsignacionAutomatica.set({
      abierto: false,
      placaVehiculo: '',
      cargando: false,
      error: '',
      exito: null
    });
  }

  actualizarPlacaAutomatica(placa: string): void {
    this.modalAsignacionAutomatica.update(m => ({ ...m, placaVehiculo: placa }));
  }

  async asignarAutomaticamente(): Promise<void> {
    const modal = this.modalAsignacionAutomatica();
    const sedeId = this.sede()?.sedeId;
    if (!sedeId) return;

    this.modalAsignacionAutomatica.update(m => ({ ...m, cargando: true, error: '', exito: null }));

    try {
      const response = await firstValueFrom(
        this.asignacionService.asignarCajonAutomatico({
          sedeId,
          numeroPiso: this.nivelSeleccionado() ?? 1,
          placaVehiculo: modal.placaVehiculo
        })
      );

      if (!response.error && response.data) {
        this.modalAsignacionAutomatica.update(m => ({ 
          ...m, 
          exito: {
            numeroCajon: response.data!.numeroCajon,
            tipoCajon: response.data!.tipoCajon,
            numeroPiso: response.data!.numeroPiso,
            placaVehiculo: response.data!.placaVehiculo
          }
        }));
        await this.dashboardState.recargarDatos();
      } else {
        this.modalAsignacionAutomatica.update(m => ({ ...m, error: response.msg || 'Error en asignación automática' }));
      }
    } catch (err: any) {
      this.modalAsignacionAutomatica.update(m => ({ ...m, error: err.error?.msg || 'Error en asignación automática' }));
    } finally {
      this.modalAsignacionAutomatica.update(m => ({ ...m, cargando: false }));
    }
  }

  // ==================== Modal Pago de Reserva ====================
  
  async abrirModalPagoReserva(cajon: Cajon): Promise<void> {
    // Buscar la reserva en el estado compartido por cajonId
    const reservas = this.dashboardState.reservas();
    
    // Debug: mostrar información para diagnóstico
    console.log('Buscando reserva para cajón:', cajon.cajonId, cajon.numeroCajon);
    console.log('Reservas disponibles:', reservas.map(r => ({ 
      reservaId: r.reservaId, 
      cajonId: r.cajonId, 
      estado: r.estado,
      numeroCajon: r.numeroCajon 
    })));
    
    // Buscar reserva pendiente para este cajón (comparar por cajonId o por numeroCajon)
    const reserva = reservas.find(r => 
      (r.cajonId === cajon.cajonId || r.numeroCajon === cajon.numeroCajon) && 
      r.estado === EstadoReserva.Pendiente
    );

    if (!reserva) {
      // Mostrar error al usuario si no hay reserva activa
      this.modalDetalleReserva.set({
        abierto: true,
        reserva: null,
        calculando: false,
        costoCalculado: null,
        cargando: false,
        error: 'No se encontró una reserva activa para este cajón. Intenta recargar la página.'
      });
      // Intentar recargar datos
      await this.dashboardState.recargarDatos();
      return;
    }

    console.log('Reserva encontrada:', reserva);

    this.modalDetalleReserva.set({
      abierto: true,
      reserva,
      calculando: true,
      costoCalculado: null,
      cargando: false,
      error: ''
    });

    // Calcular costo de la reserva
    await this.calcularCostoReserva(reserva.reservaId);
  }

  async calcularCostoReserva(reservaId: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.asignacionService.calcularPagoReserva(reservaId)
      );

      if (!response.error && response.data) {
        const modal = this.modalDetalleReserva();
        const costoCalculado: DetallesPagoReserva = {
          ...response.data,
          reservaId,
          fechaReserva: modal.reserva?.fechaReserva || response.data.fechaReserva || '',
          fechaVencimiento: modal.reserva?.fechaVencimiento || response.data.fechaVencimiento || '',
          duracionReservadaHoras: modal.reserva?.duracionEstimadaHoras || response.data.duracionReservadaHoras || 0
        };

        this.modalDetalleReserva.update(m => ({
          ...m,
          calculando: false,
          costoCalculado
        }));
      } else {
        this.modalDetalleReserva.update(m => ({
          ...m,
          calculando: false,
          error: response.msg || 'Error al calcular costo'
        }));
      }
    } catch (error: any) {
      this.modalDetalleReserva.update(m => ({
        ...m,
        calculando: false,
        error: error.error?.msg || 'Error al conectar con el servidor'
      }));
    }
  }

  cerrarModalDetalleReserva(): void {
    this.modalDetalleReserva.set({
      abierto: false,
      reserva: null,
      calculando: false,
      costoCalculado: null,
      cargando: false,
      error: ''
    });
  }

  async pagarReservaDesdeModal(): Promise<void> {
    const modal = this.modalDetalleReserva();
    if (!modal.reserva) return;

    this.modalDetalleReserva.update(m => ({ ...m, cargando: true, error: '' }));

    try {
      const response = await firstValueFrom(
        this.asignacionService.pagarReserva(modal.reserva.reservaId)
      );

      if (!response.error) {
        this.cerrarModalDetalleReserva();
        await this.dashboardState.recargarDatos();
      } else {
        this.modalDetalleReserva.update(m => ({
          ...m,
          cargando: false,
          error: response.msg || 'Error al procesar pago'
        }));
      }
    } catch (error: any) {
      this.modalDetalleReserva.update(m => ({
        ...m,
        cargando: false,
        error: error.error?.msg || 'Error al conectar con el servidor'
      }));
    }
  }

  // Utilidades para el modal de reserva
  getTiempoRestanteReserva(reserva: Reserva | null): number {
    if (!reserva?.fechaVencimiento) return 0;
    const ahora = new Date().getTime();
    const vencimiento = new Date(reserva.fechaVencimiento).getTime();
    return Math.floor((vencimiento - ahora) / (1000 * 60)); // minutos
  }

  formatearTiempoRestante(minutos: number): string {
    if (minutos <= 0) return 'Vencida';
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins}m restantes`;
    }
    return `${mins}m restantes`;
  }
}
