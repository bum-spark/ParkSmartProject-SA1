import { Injectable, signal, computed } from '@angular/core';
import { Sede, NivelConCajones, EstadisticaSede, Cajon } from '../../../../Shared/Interfaces/sede.interface';
import { Reserva, TransaccionHistorial } from '../../../../Shared/Interfaces/asignacion.interface';

/**
 * Servicio de estado compartido para el Dashboard de Sede.
 * Este servicio mantiene el estado que comparten el componente padre (DashboardSede)
 * y todos sus componentes hijos (Overview, Mapa, Reservas, Historial).
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  // Estado principal
  private _sede = signal<Sede | null>(null);
  private _estadisticas = signal<EstadisticaSede | null>(null);
  private _niveles = signal<NivelConCajones[]>([]);
  private _reservas = signal<Reserva[]>([]);
  private _historial = signal<TransaccionHistorial[]>([]);
  private _esAdmin = signal(false);
  private _loading = signal(true);
  private _error = signal<string | null>(null);

  // Callback para recargar datos desde el padre
  private _recargarDatosCallback: (() => Promise<void>) | null = null;

  // Exponer signals como readonly
  readonly sede = this._sede.asReadonly();
  readonly estadisticas = this._estadisticas.asReadonly();
  readonly niveles = this._niveles.asReadonly();
  readonly reservas = this._reservas.asReadonly();
  readonly historial = this._historial.asReadonly();
  readonly esAdmin = this._esAdmin.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed para contar solo reservas activas (pendientes)
  readonly reservasActivas = computed(() => 
    this._reservas().filter(r => r.estado === 'pendiente')
  );

  readonly cantidadReservasActivas = computed(() => 
    this.reservasActivas().length
  );

  // Computed para estadísticas resumidas
  readonly resumenEstadisticas = computed(() => {
    const nivelesData = this._niveles();
    let total = 0, ocupados = 0, libres = 0, reservados = 0;
    
    nivelesData.forEach(nivel => {
      nivel.cajones.forEach((cajon: Cajon) => {
        total++;
        if (cajon.estadoActual === 'ocupado') ocupados++;
        else if (cajon.estadoActual === 'libre') libres++;
        else if (cajon.estadoActual === 'reservado') reservados++;
      });
    });
    
    const sedeData = this._sede();
    const ingresos = this._historial()
      .filter(h => h.estado === 'completado' || h.estado === 'pagado')
      .reduce((sum, h) => sum + (h.montoTotal || 0), 0);
    
    return {
      total,
      ocupados,
      libres,
      reservados,
      ingresos,
      tarifaPorHora: sedeData?.tarifaPorHora || 0
    };
  });

  // Métodos para actualizar el estado
  setSede(sede: Sede | null): void {
    this._sede.set(sede);
  }

  setEstadisticas(estadisticas: EstadisticaSede | null): void {
    this._estadisticas.set(estadisticas);
  }

  setNiveles(niveles: NivelConCajones[]): void {
    this._niveles.set(niveles);
  }

  setReservas(reservas: Reserva[]): void {
    this._reservas.set(reservas);
  }

  setHistorial(historial: TransaccionHistorial[]): void {
    this._historial.set(historial);
  }

  setEsAdmin(esAdmin: boolean): void {
    this._esAdmin.set(esAdmin);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  // Registrar callback para recargar datos desde el padre
  registrarRecargarCallback(callback: () => Promise<void>): void {
    this._recargarDatosCallback = callback;
  }

  // Método para que los hijos soliciten recarga de datos
  async recargarDatos(): Promise<void> {
    if (this._recargarDatosCallback) {
      await this._recargarDatosCallback();
    }
  }

  // Método para limpiar todo el estado
  reset(): void {
    this._sede.set(null);
    this._estadisticas.set(null);
    this._niveles.set([]);
    this._reservas.set([]);
    this._historial.set([]);
    this._esAdmin.set(false);
    this._loading.set(true);
    this._error.set(null);
    this._recargarDatosCallback = null;
  }
}
