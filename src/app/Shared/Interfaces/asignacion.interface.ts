
import { TipoCajon, EstadoTicket, EstadoReserva } from './enums';
import { ApiResponse } from './common.interface';

export interface Ticket {
  ticketId: string;
  cajonId: string;
  numeroCajon: string;
  tipoCajon: TipoCajon;
  numeroPiso: number;
  placaVehiculo: string;
  horaEntrada: string;
}

export interface AsignarCajonEspecificoBody {
  sedeId: string;
  cajonId: string;
  placaVehiculo: string;
}

export interface AsignarCajonResponse extends ApiResponse<Ticket> {}

export interface AsignarCajonAutomaticoBody {
  sedeId: string;
  numeroPiso: number;
  placaVehiculo: string;
}

export interface NuevaReservaBody {
  sedeId: string;
  cajonId: string;
  placaVehiculo: string;
  duracionHoras: number;
}

export interface Reserva {
  reservaId: string;
  placaVehiculo: string;
  fechaReserva: string;
  duracionEstimadaHoras: number;
  estado: EstadoReserva;
  cajonId: string;
  numeroCajon: string;
  tipoCajon: TipoCajon;
  numeroPiso: number;
  creadoPorUsuarioId: string;
  nombreCreador: string;
  fechaVencimiento: string;
}

export interface NuevaReservaResponse extends ApiResponse<Reserva> {}

export interface ObtenerReservaPorSedeResponse extends ApiResponse<Reserva[]> {}

export interface ObtenerReservaPorCajonResponse extends ApiResponse<Reserva> {}

export interface CostoCalculado {
  reservaId?: string;
  ticketId?: string;
  placaVehiculo: string;
  fechaReserva?: string;
  fechaVencimiento?: string;
  fechaPago: string;
  duracionReservadaHoras?: number;
  horasExcedidas?: number;
  tarifaPorHora: number;
  montoTarifa: number;
  multaPorHora?: number;
  montoMulta?: number;
  montoTotal: number;
  tieneMulta?: boolean;
  multaConTope?: boolean;
  montoMaximoMulta?: number;
}

export interface ObtenerCostoTotalResponse extends ApiResponse<CostoCalculado> {}

export interface DetallesPagoReserva extends CostoCalculado {
  reservaId: string;
  fechaReserva: string;
  fechaVencimiento: string;
  duracionReservadaHoras: number;
}

export interface DetallesPagoTicket {
  ticketId: string;
  placaVehiculo: string;
  horaEntrada: string;
  horaSalida: string;
  minutosTranscurridos: number;
  horasCobradas: number;
  tarifaPorHora: number;
  montoTotal: number;
  numeroCajon: string;
  numeroPiso: number;
}

export interface PagarResponse extends ApiResponse<never> {
  montoPagado: number;
  detalles: DetallesPagoReserva | DetallesPagoTicket;
}

export interface PagarReservaResponse extends ApiResponse<never> {
  montoPagado: number;
  detalles: DetallesPagoReserva;
}

export interface PagarTicketResponse extends ApiResponse<never> {
  montoPagado: number;
  detalles: DetallesPagoTicket;
}

// Tipo de transacción en el historial
export type TipoTransaccion = 'ticket' | 'reserva';

// Estado de la transacción en el historial
export type EstadoTransaccion = 'activo' | 'pagado' | 'completado' | 'cancelado' | 'pendiente';

// Interfaz unificada para el historial (tickets + reservas)
export interface TransaccionHistorial {
  transaccionId: string;
  tipo: TipoTransaccion;
  placaVehiculo: string;
  fechaInicio: string;
  fechaFin: string | null;
  duracionHoras: number;
  montoTotal: number | null;
  estado: EstadoTransaccion;
  cajonId: string;
  numeroCajon: string;
  tipoCajon: TipoCajon;
  numeroPiso: number;
  nombreCreador: string | null;
}

// Respuesta del historial completo
export interface ObtenerHistorialPorSedeResponse extends ApiResponse<TransaccionHistorial[]> {
  totalRegistros: number;
  totalTickets: number;
  totalReservas: number;
}

// Mantener la interfaz antigua por compatibilidad (deprecada)
export interface TicketHistorial {
  ticketId: string;
  placaVehiculo: string;
  horaEntrada: string;
  horaSalida: string | null;
  montoTotal: number | null;
  estado: EstadoTicket;
  cajonId: string;
  numeroCajon: string;
}

// ==================== CAMBIO DE TIPO DE CAJÓN ====================

// Body para cambiar el tipo de un cajón
export interface CambiarTipoCajonBody {
  sedeId: string;
  cajonId: string;
  nuevoTipo: TipoCajon;
}

// Respuesta al cambiar tipo de cajón
export interface CambiarTipoCajonData {
  cajonId: string;
  numeroCajon: string;
  tipo: TipoCajon;
  estadoActual: string;
  nivelId: string;
  numeroPiso: number;
  ticketActualId: string | null;
}

export interface CambiarTipoCajonResponse extends ApiResponse<CambiarTipoCajonData> {}