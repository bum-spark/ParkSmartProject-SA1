import { Cajon, Nivel, NivelConCajones, Sede, EstadisticaSede } from '../../../../Shared/Interfaces/sede.interface';
import { Reserva, TransaccionHistorial, CostoCalculado, DetallesPagoTicket, DetallesPagoReserva } from '../../../../Shared/Interfaces/asignacion.interface';

// Re-alias para claridad
export type EstadisticasSede = EstadisticaSede;
export type Transaccion = TransaccionHistorial;
export type CostoTicket = DetallesPagoTicket;
export type CostoReserva = DetallesPagoReserva;

// Tipos base
export type TabActiva = 'dashboard' | 'mapa' | 'reservas' | 'historial';
export type TipoCajon = 'normal' | 'electrico' | 'discapacitado';

// Estados de modales
export interface ModalEntrada {
  abierto: boolean;
  cajon: Cajon | null;
  placaVehiculo: string;
  cargando: boolean;
  error: string;
}

export interface ModalSalida {
  abierto: boolean;
  cajon: Cajon | null;
  calculando: boolean;
  costoCalculado: CostoTicket | null;
  cargando: boolean;
  error: string;
}

export interface ModalReserva {
  abierto: boolean;
  cajon: Cajon | null;
  placaVehiculo: string;
  duracionHoras: number;
  cargando: boolean;
  error: string;
}

export interface ModalDetalleReserva {
  abierto: boolean;
  reserva: Reserva | null;
  calculando: boolean;
  costoCalculado: CostoReserva | null;
  cargando: boolean;
  error: string;
}

export interface ModalCambiarTipo {
  abierto: boolean;
  cajon: Cajon | null;
  nuevoTipo: TipoCajon;
  cargando: boolean;
  error: string;
}

export interface ModalAsignacionAutomatica {
  abierto: boolean;
  placaVehiculo: string;
  cargando: boolean;
  error: string;
  exito: {
    numeroCajon: string;
    tipoCajon: string;
    numeroPiso: number;
    placaVehiculo: string;
  } | null;
}

export interface ModalReautenticacion {
  abierto: boolean;
  password: string;
  mostrarPassword: boolean;
  cargando: boolean;
  error: string;
}

// Estado compartido del dashboard
export interface DashboardState {
  sede: Sede | null;
  estadisticas: EstadisticasSede | null;
  niveles: NivelConCajones[];
  reservas: Reserva[];
  historial: Transaccion[];
  cargando: boolean;
  error: string;
  nivelSeleccionado: number;
}

// Eventos emitidos por componentes hijos
export interface EntradaVehiculoEvent {
  cajonId: string;
  placaVehiculo: string;
}

export interface SalidaVehiculoEvent {
  cajonId: string;
}

export interface CrearReservaEvent {
  cajonId: string;
  placaVehiculo: string;
  duracionHoras: number;
}

export interface PagarReservaEvent {
  reservaId: string;
}

export interface CambiarTipoCajonEvent {
  cajonId: string;
  nuevoTipo: TipoCajon;
}

export interface AsignacionAutomaticaEvent {
  nivelId: string;
  placaVehiculo: string;
}

// Re-exportar interfaces necesarias
export type { Cajon, Nivel, NivelConCajones, Sede, Reserva };
