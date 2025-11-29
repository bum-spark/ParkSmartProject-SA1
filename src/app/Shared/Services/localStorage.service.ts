import { Injectable, signal, computed, effect } from '@angular/core';
import { StorageItem } from '../Interfaces';
import { AccesoSedeCache, AccesosSedesCache } from '../Interfaces/sede.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorage {
  private readonly _token = signal<string | null>(this.obtenerItem<string>('auth_token'));
  private readonly _idUsuario = signal<string | null>(this.obtenerItem<string>('user_id'));
  private readonly _rolUsuario = signal<string | null>(this.obtenerItem<string>('user_role'));
  private readonly _nombreUsuario = signal<string | null>(this.obtenerItem<string>('user_name'));
  private readonly _idSede = signal<string | null>(this.obtenerItem<string>('current_sede_id'));
  private readonly _accesosSedes = signal<AccesosSedesCache>(this.obtenerItem<AccesosSedesCache>('sedes_access') || {});

  readonly token = this._token.asReadonly();
  readonly idUsuario = this._idUsuario.asReadonly();
  readonly rolUsuario = this._rolUsuario.asReadonly();
  readonly nombreUsuario = this._nombreUsuario.asReadonly();
  readonly idSede = this._idSede.asReadonly();
  readonly accesosSedes = this._accesosSedes.asReadonly();

  readonly estaAutenticado = computed(() => !!this._token());

  constructor() {
    effect(() => {
      const token = this._token();
      if (token) {
        this.guardarItem('auth_token', token);
      } else {
        this.eliminarItem('auth_token');
      }
    });

    // Effect para sincronizar cambios en el idUsuario
    effect(() => {
      const idUsuario = this._idUsuario();
      if (idUsuario) {
        this.guardarItem('user_id', idUsuario);
      } else {
        this.eliminarItem('user_id');
      }
    });

    // Effect para sincronizar cambios en el rolUsuario
    effect(() => {
      const rolUsuario = this._rolUsuario();
      if (rolUsuario) {
        this.guardarItem('user_role', rolUsuario);
      } else {
        this.eliminarItem('user_role');
      }
    });

    // Effect para sincronizar cambios en el nombreUsuario
    effect(() => {
      const nombreUsuario = this._nombreUsuario();
      if (nombreUsuario) {
        this.guardarItem('user_name', nombreUsuario);
      } else {
        this.eliminarItem('user_name');
      }
    });

    // Effect para sincronizar cambios en el idSede
    effect(() => {
      const idSede = this._idSede();
      if (idSede) {
        this.guardarItem('current_sede_id', idSede);
      } else {
        this.eliminarItem('current_sede_id');
      }
    });

    // Effect para sincronizar cambios en accesosSedes
    effect(() => {
      const accesosSedes = this._accesosSedes();
      if (accesosSedes && Object.keys(accesosSedes).length > 0) {
        this.guardarItem('sedes_access', accesosSedes);
      } else {
        this.eliminarItem('sedes_access');
      }
    });
  }

  /**
   * Establece el token de autenticación
   */
  establecerToken(token: string | null): void {
    this._token.set(token);
  }

  /**
   * Establece el ID del usuario
   */
  establecerIdUsuario(idUsuario: string | null): void {
    this._idUsuario.set(idUsuario);
  }

  /**
   * Establece el rol del usuario
   */
  establecerRolUsuario(rol: string | null): void {
    this._rolUsuario.set(rol);
  }

  /**
   * Establece el nombre del usuario
   */
  establecerNombreUsuario(nombre: string | null): void {
    this._nombreUsuario.set(nombre);
  }

  /**
   * Establece el ID de la sede actual
   */
  establecerIdSede(idSede: string | null): void {
    this._idSede.set(idSede);
  }

  /**
   * Guarda el acceso a una sede específica
   */
  guardarAccesoSede(acceso: AccesoSedeCache): void {
    this._accesosSedes.update(accesos => ({
      ...accesos,
      [acceso.sedeId]: acceso
    }));
  }

  /**
   * Obtiene el acceso a una sede específica
   */
  obtenerAccesoSede(sedeId: string): AccesoSedeCache | null {
    const accesos = this._accesosSedes();
    return accesos[sedeId] || null;
  }

  /**
   * Verifica si el usuario tiene acceso válido a una sede
   */
  tieneAccesoValidoSede(sedeId: string): boolean {
    const acceso = this.obtenerAccesoSede(sedeId);
    if (!acceso) return false;
    
    const validoHasta = new Date(acceso.validoHasta);
    return validoHasta > new Date();
  }

  /**
   * Obtiene el tiempo restante de acceso a una sede en milisegundos
   */
  tiempoRestanteAcceso(sedeId: string): number {
    const acceso = this.obtenerAccesoSede(sedeId);
    if (!acceso) return 0;
    
    const validoHasta = new Date(acceso.validoHasta);
    const ahora = new Date();
    const diferencia = validoHasta.getTime() - ahora.getTime();
    
    return diferencia > 0 ? diferencia : 0;
  }

  /**
   * Elimina el acceso a una sede específica
   */
  eliminarAccesoSede(sedeId: string): void {
    this._accesosSedes.update(accesos => {
      const nuevosAccesos = { ...accesos };
      delete nuevosAccesos[sedeId];
      return nuevosAccesos;
    });
  }

  /**
   * Limpia los accesos expirados
   */
  limpiarAccesosExpirados(): void {
    const accesos = this._accesosSedes();
    const ahora = new Date();
    const accesosValidos: AccesosSedesCache = {};
    
    for (const sedeId in accesos) {
      const validoHasta = new Date(accesos[sedeId].validoHasta);
      if (validoHasta > ahora) {
        accesosValidos[sedeId] = accesos[sedeId];
      }
    }
    
    this._accesosSedes.set(accesosValidos);
  }

  /**
   * Guarda todos los datos del usuario después del login
   */
  establecerDatosUsuario(datos: {
    token: string;
    idUsuario: string;
    rol: string;
    nombre: string;
  }): void {
    this.establecerToken(datos.token);
    this.establecerIdUsuario(datos.idUsuario);
    this.establecerRolUsuario(datos.rol);
    this.establecerNombreUsuario(datos.nombre);
  }

  /**
   * Limpia todos los datos del usuario (logout)
   */
  limpiarDatosUsuario(): void {
    this.establecerToken(null);
    this.establecerIdUsuario(null);
    this.establecerRolUsuario(null);
    this.establecerNombreUsuario(null);
    this.establecerIdSede(null);
    this._accesosSedes.set({});
  }

  guardarItem<T>(clave: string, valor: T, expiraEnMinutos?: number): void {
    try {
      const item: StorageItem<T> = {
        value: valor,
        timestamp: Date.now(),
        expiresAt: expiraEnMinutos ? Date.now() + expiraEnMinutos * 60 * 1000 : undefined
      };
      
      const serializado = JSON.stringify(item);
      localStorage.setItem(clave, serializado);
    } catch (error) {
      console.error(`Error al guardar en localStorage (${clave}):`, error);
    }
  }

  obtenerItem<T>(clave: string): T | null {
    try {
      const serializado = localStorage.getItem(clave);
      if (!serializado) return null;

      const item: StorageItem<T> = JSON.parse(serializado);

      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.eliminarItem(clave);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error(`Error al leer de localStorage (${clave}):`, error);
      return null;
    }
  }

  eliminarItem(clave: string): void {
    try {
      localStorage.removeItem(clave);
    } catch (error) {
      console.error(`Error al eliminar de localStorage (${clave}):`, error);
    }
  }

  tieneItem(clave: string): boolean {
    return this.obtenerItem(clave) !== null;
  }

  limpiar(): void {
    try {
      localStorage.clear();
      this._token.set(null);
      this._idUsuario.set(null);
      this._rolUsuario.set(null);
      this._nombreUsuario.set(null);
      this._idSede.set(null);
      this._accesosSedes.set({});
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  }

  crearSignal<T>(clave: string, valorInicial: T) {
    const valorAlmacenado = this.obtenerItem<T>(clave) ?? valorInicial;
    const instanciaSignal = signal<T>(valorAlmacenado);

    effect(() => {
      const valor = instanciaSignal();
      this.guardarItem(clave, valor);
    });

    return instanciaSignal;
  }
}
