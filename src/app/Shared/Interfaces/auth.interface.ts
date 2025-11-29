
import { RolUsuario } from './enums';
import { ApiResponse } from './common.interface';

export interface Usuario {
  usuarioId: string;
  nombreCompleto: string;
  email: string;
  rol: RolUsuario;
  fechaCreacion: string;
}

export interface UsuarioIncompleto {
  usuarioId: string;
  nombreCompleto: string;
  email: string;
  rol: RolUsuario;
  fechaCreacion: string;
}

export interface UsuarioLista {
  usuarioId: string;
  nombreCompleto: string;
  email: string;
  rol: RolUsuario;
}

export interface RegistrarUsuarioBody {
  nombreCompleto: string;
  email: string;
  password: string;
}

export interface RegistrarUsuarioResponse extends ApiResponse<Usuario> {}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse extends ApiResponse<never> {
  token: string;
  usuario: UsuarioIncompleto;
  expiracion: string;
}

export interface ObtenerUsuarioResponse extends ApiResponse<UsuarioIncompleto> {}

export interface ObtenerUsuariosResponse extends ApiResponse<UsuarioLista[]> {
  total: number;
}

export interface ActualizarInfoBody {
  nombreCompleto?: string;
  email?: string;
}

export interface ActualizarInfoResponse extends ApiResponse<UsuarioIncompleto> {}

export interface ActualizarContraseñaBody {
  passwordActual: string;
  passwordNueva: string;
}

export interface ActualizarContraseñaResponse extends ApiResponse<never> {}

export interface ActualizarRolBody {
  nuevoRol: RolUsuario;
  usuarioId: string;
}

export interface ActualizarRolResponse extends ApiResponse<never> {}
