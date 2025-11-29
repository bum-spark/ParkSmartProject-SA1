import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  CrearSedeBody,
  CrearSedeResponse,
  ObtenerSedeResponse,
  VerificarAccesoSedeBody,
  VerificarAccesoResponse,
  CambiarEstadoSedeBody,
  CambiarEstadoSedeResponse,
  CalcularEstadisticaPorSedeResponse,
  ObtenerCajonesResponse,
  ObtenerCajonesPorNivelResponse,
  ActualizarDatosSedeBody,
  ActualizarDatosSedeResponse
} from '../Interfaces';
import { LocalStorage } from './localStorage.service';

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private readonly _http = inject(HttpClient);
  private readonly _localStorage = inject(LocalStorage);
  
  private readonly _URLBACK = "http://localhost:5144/api/sede/";

  /**
   * GET /api/sede
   * Obtiene todas las sedes disponibles
   * Requiere autenticacion
   */
  obtenerTodasLasSedes(): Observable<ObtenerSedeResponse> {
    const headers = this.obtenerHeaders();
    return this._http.get<ObtenerSedeResponse>(
      this._URLBACK,
      { headers }
    );
  }

  /**
   * GET /api/sede/{id}
   * Obtiene los detalles de una sede especifica por ID
   * Requiere autenticación
   */
  obtenerSedePorId(sedeId: string): Observable<any> {
    const headers = this.obtenerHeaders();
    return this._http.get<any>(
      `${this._URLBACK}${sedeId}`,
      { headers }
    );
  }

  /**
   * POST /api/sede
   * Crea una nueva sede
   * Requiere autenticacion
   */
  crearSede(datos: CrearSedeBody): Observable<CrearSedeResponse> {
    const headers = this.obtenerHeaders();
    return this._http.post<CrearSedeResponse>(
      this._URLBACK,
      datos,
      { headers }
    );
  }

  /**
   * POST /api/sede/verificar-acceso
   * Verifica la contraseña de acceso a una sede
   * Guarda el acceso en localStorage (por 8 horas)
   * Requiere autenticacion
   */
  verificarAccesoSede(datos: VerificarAccesoSedeBody): Observable<VerificarAccesoResponse> {
    const headers = this.obtenerHeaders();
    return this._http.post<VerificarAccesoResponse>(
      `${this._URLBACK}verificar-acceso`,
      datos,
      { headers }
    ).pipe(
      tap(response => {
        if (!response.error) {
          this._localStorage.establecerIdSede(response.sedeId);
          // El acceso a la sede se guarda en el componente con el nombre de la sede
        }
      })
    );
  }

  /**
   * GET /api/sede/{id}/estadisticas
   * Obtiene las estadisticas de ocupacion de una sede
   * Requiere autenticacion y acceso a la sede
   */
  obtenerEstadisticasSede(sedeId: string): Observable<CalcularEstadisticaPorSedeResponse> {
    const headers = this.obtenerHeaders();
    return this._http.get<CalcularEstadisticaPorSedeResponse>(
      `${this._URLBACK}${sedeId}/estadisticas`,
      { headers }
    );
  }

  /**
   * PATCH /api/sede/{id}/estado
   * Actualiza el estado de una sede
   * Requiere autenticacion
   */
  cambiarEstadoSede(sedeId: string, datos: CambiarEstadoSedeBody): Observable<CambiarEstadoSedeResponse> {
    const headers = this.obtenerHeaders();
    return this._http.patch<CambiarEstadoSedeResponse>(
      `${this._URLBACK}${sedeId}/estado`,
      datos,
      { headers }
    );
  }

  /**
   * GET /api/sede/{id}/niveles
   * Obtiene todos los niveles de una sede con sus cajones
   * Requiere autenticacion y acceso a la sede
   */
  obtenerNivelesDeSede(sedeId: string): Observable<ObtenerCajonesResponse> {
    const headers = this.obtenerHeaders();
    return this._http.get<ObtenerCajonesResponse>(
      `${this._URLBACK}${sedeId}/niveles`,
      { headers }
    );
  }

  /**
   * GET /api/sede/{id}/niveles/{nivelId}/cajones
   * Obtiene todos los cajones de un nivel especifico
   * Requiere autenticacion y acceso a la sede
   */
  obtenerCajonesPorNivel(sedeId: string, nivelId: string): Observable<ObtenerCajonesPorNivelResponse> {
    const headers = this.obtenerHeaders();
    return this._http.get<ObtenerCajonesPorNivelResponse>(
      `${this._URLBACK}${sedeId}/niveles/${nivelId}/cajones`,
      { headers }
    );
  }

  /**
   * PUT /api/sede/{id}/actualizar-completa
   * Actualiza completamente una sede
   * Requiere autenticacion
   */
  actualizarSedeCompleta(sedeId: string, datos: ActualizarDatosSedeBody): Observable<ActualizarDatosSedeResponse> {
    const headers = this.obtenerHeaders();
    return this._http.put<ActualizarDatosSedeResponse>(
      `${this._URLBACK}${sedeId}/actualizar-completa`,
      datos,
      { headers }
    );
  }

  /**
   * Método para obtener los headers con el token
   */
  private obtenerHeaders(): HttpHeaders {
    const token = this._localStorage.token();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
