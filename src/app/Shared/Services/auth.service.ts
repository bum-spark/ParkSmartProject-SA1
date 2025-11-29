import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  RegistrarUsuarioBody,
  RegistrarUsuarioResponse,
  LoginBody,
  LoginResponse,
  ObtenerUsuarioResponse,
  ObtenerUsuariosResponse,
  ActualizarInfoBody,
  ActualizarInfoResponse,
  ActualizarContraseñaBody,
  ActualizarContraseñaResponse,
  ActualizarRolBody,
  ActualizarRolResponse
} from '../Interfaces';
import { LocalStorage } from './localStorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _localStorage = inject(LocalStorage);
  
  private readonly _URLBACK = "http://localhost:5144/api/auth/";

  /**
   * POST /api/auth/registro
   * registra un nuevo usuario en el sistema
   */
  registrarUsuario(datos: RegistrarUsuarioBody): Observable<RegistrarUsuarioResponse> {
    return this._http.post<RegistrarUsuarioResponse>(
      `${this._URLBACK}registro`, 
      datos
    );
  }

  /**
   * POST /api/auth/login
   * Inicia sesion y obtiene el token JWT
   * guarda automaticamente los datos en localStorage
   */
  login(credenciales: LoginBody): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(
      `${this._URLBACK}login`, 
      credenciales
    ).pipe(
      tap(response => {
        if (!response.error && response.token) {
          this._localStorage.establecerDatosUsuario({
            token: response.token,
            idUsuario: response.usuario.usuarioId,
            rol: response.usuario.rol,
            nombre: response.usuario.nombreCompleto
          });
        }
      })
    );
  }

  /**
   * GET /api/auth/usuarios
   * Obtiene la lista de todos los usuarios
   * Requiere autenticación (Admin o Gerente)
   */
  obtenerUsuarios(): Observable<ObtenerUsuariosResponse> {
    const headers = this.obtenerHeaders();
    return this._http.get<ObtenerUsuariosResponse>(
      `${this._URLBACK}usuarios`,
      { headers }
    );
  }

  /**
   * GET /api/auth/usuario/{id}
   * obtiene la informacion de un usuario por su ID
   * requiere autenticacion
   */
  obtenerUsuarioPorId(usuarioId: string): Observable<ObtenerUsuarioResponse> {
    const headers = this.obtenerHeaders();
    return this._http.get<ObtenerUsuarioResponse>(
      `${this._URLBACK}usuario/${usuarioId}`,
      { headers }
    );
  }

  /**
   * PUT /api/auth/usuario/{id}
   * Actualiza la informacion basica de un usuario
   * requiere autenticación
   */
  actualizarUsuario(usuarioId: string, datos: ActualizarInfoBody): Observable<ActualizarInfoResponse> {
    const headers = this.obtenerHeaders();
    return this._http.put<ActualizarInfoResponse>(
      `${this._URLBACK}usuario/${usuarioId}`,
      datos,
      { headers }
    ).pipe(
      tap(response => {
        if (!response.error && datos.nombreCompleto) {
          this._localStorage.establecerNombreUsuario(datos.nombreCompleto);
        }
      })
    );
  }

  /**
   * PATCH /api/auth/usuario/cambiar-password
   * Cambia la contraseña del usuario autenticado
   * Requiere autenticacion
   */
  cambiarPassword(datos: ActualizarContraseñaBody): Observable<ActualizarContraseñaResponse> {
    const headers = this.obtenerHeaders();
    return this._http.patch<ActualizarContraseñaResponse>(
      `${this._URLBACK}usuario/cambiar-password`,
      datos,
      { headers }
    );
  }

  /**
   * PATCH /api/auth/usuario/{usuarioId}/cambiar-rol
   * Cambia el rol de un usuario específico
   * Requiere autenticacion (Admin o Gerente según reglas)
   */
  cambiarRolUsuario(usuarioId: string, nuevoRol: string): Observable<ActualizarRolResponse> {
    const headers = this.obtenerHeaders();
    return this._http.patch<ActualizarRolResponse>(
      `${this._URLBACK}usuario/${usuarioId}/cambiar-rol`,
      { nuevoRol },
      { headers }
    );
  }

  /**
   * Cierra la sesion del usuario
   * limpia el localStorage
   */
  logout(): void {
    this._localStorage.limpiarDatosUsuario();
  }

  /**
   * Metodo para los header (JWT) y el formato de Body
   */
  private obtenerHeaders(): HttpHeaders {
    const token = this._localStorage.token();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
