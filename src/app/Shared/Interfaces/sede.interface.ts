import { EstadoSede, TipoCajon, EstadoCajon } from './enums';
import { ApiResponse } from './common.interface';

export interface Nivel {
  numeroPiso: number;
  capacidad: number;
}

export interface Sede {
  sedeId: string;
  nombre: string;
  direccion: string;
  estado: EstadoSede;
  tarifaPorHora: number;
  multaPorHora: number;
  multaConTope: boolean;
  montoMaximoMulta: number;
  fechaCreacion: string;
  creadoPorUsuarioId: string;
  nombreCreador: string;
  totalNiveles: number;
  totalCajones: number;
  cajonesLibres: number;
  cajonesOcupados: number;
  cajonesReservados: number;
}

export interface CrearSedeBody {
  nombre: string;
  direccion: string;
  passwordAcceso: string;
  tarifaPorHora: number;
  multaPorHora: number;
  multaConTope: boolean;
  montoMaximoMulta: number;
  niveles: Nivel[];
}

export interface CrearSedeResponse extends ApiResponse<never> {
  sede: Sede;
}

export interface ObtenerSedeResponse extends ApiResponse<Sede[]> {}

export interface VerificarAccesoSedeBody {
  sedeId: string;
  passwordAcceso: string;
}

export interface VerificarAccesoResponse extends ApiResponse<never> {
  sedeId: string;
  usuarioId: string;
  validoHasta: string;
}

// Interface para almacenar accesos a sedes en localStorage
export interface AccesoSedeCache {
  sedeId: string;
  usuarioId: string;
  validoHasta: string;
  nombreSede: string;
}

// Mapa de accesos por sedeId
export interface AccesosSedesCache {
  [sedeId: string]: AccesoSedeCache;
}

export interface CambiarEstadoSedeBody {
  nuevoEstado: EstadoSede;
  contraseñaCreador: string;
}

export interface CambiarEstadoSedeResponse extends ApiResponse<never> {}

export interface EstadisticaSede {
  sedeId: string;
  nombreSede: string;
  totalCajones: number;
  cajonesOcupados: number;
  cajonesLibres: number;
  porcentajeOcupacion: number;
  ingresosDia: number;
  tarifaPorHora: number;
}

export interface CalcularEstadisticaPorSedeResponse extends ApiResponse<EstadisticaSede> {}

export interface Cajon {
  cajonId: string;
  numeroCajon: string;
  tipo: TipoCajon;
  estadoActual: EstadoCajon;
  nivelId: string;
  numeroPiso: number;
  // ID del ticket actual (viene del backend cuando está ocupado)
  ticketActualId: string | null;
  // Campos opcionales para reservas
  reservaActualId?: string | null;
  placaVehiculo?: string;
  horaEntrada?: string;
}

export interface NivelConCajones {
  nivelId: string;
  numeroPiso: number;
  capacidad: number;
  sedeId: string;
  nombreSede: string;
  totalCajones: number;
  cajonesLibres: number;
  cajonesOcupados: number;
  cajones: Cajon[];
}

export interface ObtenerCajonesError extends ApiResponse<never> {
  sedeId: string;
}

export interface ObtenerCajonesResponse extends ApiResponse<NivelConCajones[]> {}

export interface ObtenerCajonesPorNivelResponse extends ApiResponse<Cajon[]> {}

export interface ActualizarDatosSedeBody {
  contraseñaCreador: string;
  nombre?: string;
  direccion?: string;
  passwordAcceso?: string;
  tarifaPorHora?: number;
  multaPorHora?: number;
  multaConTope?: boolean;
  montoMaximoMulta?: number;
  niveles?: Nivel[];
}

export interface ActualizarDatosSedeResponse extends ApiResponse<Sede> {}