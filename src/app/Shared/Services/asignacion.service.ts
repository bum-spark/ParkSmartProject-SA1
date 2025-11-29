import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AsignarCajonEspecificoBody,
  AsignarCajonResponse,
  AsignarCajonAutomaticoBody,
  NuevaReservaBody,
  NuevaReservaResponse,
  ObtenerReservaPorSedeResponse,
  ObtenerReservaPorCajonResponse,
  ObtenerCostoTotalResponse,
  PagarReservaResponse,
  PagarTicketResponse,
  ObtenerHistorialPorSedeResponse,
  CambiarTipoCajonBody,
  CambiarTipoCajonResponse
} from '../Interfaces';
import { LocalStorage } from './localStorage.service';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private readonly _http = inject(HttpClient);
  private readonly _localStorage = inject(LocalStorage);
  
  private readonly _URLBACK = "http://localhost:5144/api/asignacion/";

  /**
   * POST /api/asignacion/cajon-especifico
   * Asigna un cajon especifico a un vehículo (crea un ticket)
   */
  asignarCajonEspecifico(datos: AsignarCajonEspecificoBody): Observable<AsignarCajonResponse> {
    const headers = this.obtenerHeaders();
    return this._http.post<AsignarCajonResponse>(
      `${this._URLBACK}cajon-especifico`,
      datos,
      { headers }
    );
  }

  /**
   * POST /api/asignacion/cajon-automatico
   * Asigna automaticamente un cajon disponible a un auto
   */
  asignarCajonAutomatico(datos: AsignarCajonAutomaticoBody): Observable<AsignarCajonResponse> {
    const headers = this.obtenerHeaders();
    return this._http.post<AsignarCajonResponse>(
      `${this._URLBACK}cajon-automatico`,
      datos,
      { headers }
    );
  }

  /**
   * POST /api/asignacion/reserva
   * Crear una nueva reserva de cajon
   */
  crearReserva(datos: NuevaReservaBody): Observable<NuevaReservaResponse> {
    const headers = this.obtenerHeaders();
    return this._http.post<NuevaReservaResponse>(
      `${this._URLBACK}reserva`,
      datos,
      { headers }
    );
  }

  /**
   * GET /api/asignacion/reservas/sede/{sedeId}
   * Obtiene todas las reservas de una sede especifica
   */
  obtenerReservasDeSede(sedeId: string): Observable<ObtenerReservaPorSedeResponse> {
    const headers = this.obtenerHeaders();
    return this._http.get<ObtenerReservaPorSedeResponse>(
      `${this._URLBACK}reservas/sede/${sedeId}`,
      { headers }
    );
  }

  /**
   * GET /api/asignacion/reserva/{reservaId}
   * Obtiene los detalles de una reserva especifica por ID
   */
  obtenerReservaPorId(reservaId: string): Observable<ObtenerReservaPorCajonResponse> {
    const headers = this.obtenerHeaders();
    return this._http.get<ObtenerReservaPorCajonResponse>(
      `${this._URLBACK}reserva/${reservaId}`,
      { headers }
    );
  }

  /**
   * GET /api/asignacion/reserva/{reservaId}/calcular-pago
   * Calcula el monto a pagar de una reserva (se incluye la multa)
   */
  calcularPagoReserva(reservaId: string): Observable<ObtenerCostoTotalResponse> {
    const headers = this.obtenerHeaders();
    return this._http.get<ObtenerCostoTotalResponse>(
      `${this._URLBACK}reserva/${reservaId}/calcular-pago`,
      { headers }
    );
  }

  /**
   * POST /api/asignacion/reserva/{reservaId}/pagar
   * Procesa el pago de una reserva y libera el cajon
   */
  pagarReserva(reservaId: string): Observable<PagarReservaResponse> {
    const headers = this.obtenerHeaders();
    return this._http.post<PagarReservaResponse>(
      `${this._URLBACK}reserva/${reservaId}/pagar`,
      null,
      { headers }
    );
  }

  /**
   * GET /api/asignacion/ticket/{ticketId}/calcular-pago
   * Calcula el monto a pagar de un ticket segum el tiempo estacionado
   */
  calcularPagoTicket(ticketId: string): Observable<ObtenerCostoTotalResponse> {
    const headers = this.obtenerHeaders();
    return this._http.get<ObtenerCostoTotalResponse>(
      `${this._URLBACK}ticket/${ticketId}/calcular-pago`,
      { headers }
    );
  }

  /**
   * POST /api/asignacion/ticket/{ticketId}/pagar
   * Procesa el pago de un ticket y libera el cajon
   */
  pagarTicket(ticketId: string): Observable<PagarTicketResponse> {
    const headers = this.obtenerHeaders();
    return this._http.post<PagarTicketResponse>(
      `${this._URLBACK}ticket/${ticketId}/pagar`,
      null,
      { headers }
    );
  }

  /**
   * GET /api/asignacion/historial/sede/{sedeId}
   * Obtiene el historial completo de tickets y reservas completadas de una sede
   */
  obtenerHistorialCompleto(sedeId: string): Observable<ObtenerHistorialPorSedeResponse> {
    const headers = this.obtenerHeaders();
    return this._http.get<ObtenerHistorialPorSedeResponse>(
      `${this._URLBACK}historial/sede/${sedeId}`,
      { headers }
    );
  }

  /**
   * PATCH /api/asignacion/cajon/cambiar-tipo
   * Cambia el tipo de un cajón (normal, electrico, discapacitado)
   * Solo disponible para administradores
   */
  cambiarTipoCajon(datos: CambiarTipoCajonBody): Observable<CambiarTipoCajonResponse> {
    const headers = this.obtenerHeaders();
    return this._http.patch<CambiarTipoCajonResponse>(
      `${this._URLBACK}cajon/cambiar-tipo`,
      datos,
      { headers }
    );
  }

  /**
   * Metodo para obtener los headers con el token
   */
  private obtenerHeaders(): HttpHeaders {
    const token = this._localStorage.token();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
