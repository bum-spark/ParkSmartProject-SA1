// Barrel file for HomePage components
export { NavbarComponent } from './Navbar/Navbar';
export { SedeCardComponent } from './SedeCard/SedeCard';
export type { AccesoSedeInfo } from './SedeCard/SedeCard';
export { SedesGridComponent } from './SedesGrid/SedesGrid';
export { ModalAccesoSedeComponent } from './ModalAccesoSede/ModalAccesoSede';

// Drawer de Configuración y sus tabs
export { DrawerConfiguracionComponent, type TabConfiguracion, type PerfilGuardarEvent, type CambiarRolEvent } from './DrawerConfiguracion/DrawerConfiguracion';
export { PerfilTabComponent } from './DrawerConfiguracion/Tabs/PerfilTab/PerfilTab';
export { PasswordTabComponent, type PasswordData } from './DrawerConfiguracion/Tabs/PasswordTab/PasswordTab';
export { UsuariosTabComponent } from './DrawerConfiguracion/Tabs/UsuariosTab/UsuariosTab';

// Modales de gestión de sedes
export { ModalCrearSedeComponent, type CrearSedeData, type NivelForm } from './ModalCrearSede/ModalCrearSede';
export { ModalEditarSedeComponent, type EditarSedeData, type CambiarEstadoData } from './ModalEditarSede/ModalEditarSede';
export { ModalAccesoEdicionComponent, type VerificarAccesoData } from './ModalAccesoEdicion/ModalAccesoEdicion';
