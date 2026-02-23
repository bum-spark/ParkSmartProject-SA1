# ParkSmart - Sistema de Gestión de Estacionamientos

<div align="center">

![Angular](https://img.shields.io/badge/Angular-19.2.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5.5.5-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)

**Sistema integral de administración de estacionamientos con gestión de múltiples sedes, reservas, tickets y control de acceso en tiempo real.**

</div>

---

## Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso del Sistema](#-uso-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Backend](#-api-backend)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## Descripción del Proyecto

**ParkSmart** es una aplicación web moderna desarrollada en Angular 19 para la gestión integral de estacionamientos. El sistema permite administrar múltiples sedes de estacionamiento, controlar la ocupación de cajones en tiempo real, gestionar reservas y tickets, y generar reportes de ingresos.

### ¿Qué problema resuelve?

- **Gestión centralizada**: Administra múltiples sedes desde una sola plataforma
- **Control en tiempo real**: Visualiza la ocupación de cajones por niveles
- **Automatización**: Asignación automática o manual de espacios de estacionamiento
- **Sistema de reservas**: Permite a los operadores crear reservas anticipadas
- **Cálculo de tarifas**: Cobro automático por tiempo de estancia con sistema de multas
- **Control de acceso**: Autenticación JWT y permisos basados en roles

---

## Características Principales

### Sistema de Autenticación
- Registro de usuarios con validación
- Inicio de sesión con JWT (JSON Web Tokens)
- Persistencia de sesión en localStorage
- Cierre de sesión seguro
- Roles de usuario: **Admin**, **Gerente**, **Empleado**

### Gestión de Sedes
- Crear, editar y gestionar múltiples sedes
- Configuración de tarifas por hora
- Sistema de multas con tope configurable
- Estados de sede: Activo, Mantenimiento, Inactivo
- Control de acceso por contraseña a cada sede

### Mapa de Estacionamiento
- Visualización de cajones por niveles/pisos
- Estados de cajones: Libre, Ocupado, Reservado, Inactivo
- Tipos de cajones: Normal, Eléctrico, Discapacitado
- Asignación automática y manual de espacios
- Interfaz visual intuitiva con colores diferenciados

### Sistema de Tickets
- Registro de entrada de vehículos con placa
- Cálculo automático del tiempo de estancia
- Cobro al momento de la salida
- Historial completo de transacciones

### Sistema de Reservas
- Creación de reservas anticipadas
- Duración configurable en horas
- Sistema de multas por exceso de tiempo
- Estados: Pendiente, Completado, Cancelado

### Dashboard y Estadísticas
- Panel de control con métricas en tiempo real
- Porcentaje de ocupación por sede
- Ingresos del día (tickets y reservas)
- Historial de transacciones filtrable

---

## Arquitectura del Sistema

El sistema sigue una arquitectura basada en componentes standalone de Angular 19, con separación clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Angular 19)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Pages     │  │  Components │  │       Services          │  │
│  │  (Vistas)   │──│  (UI/UX)    │──│ (Lógica de negocio)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│         │                │                      │                │
│         └────────────────┴──────────────────────┘                │
│                              │                                   │
│                    ┌─────────┴─────────┐                        │
│                    │    HTTP Client    │                        │
│                    │   (HttpClient)    │                        │
│                    └─────────┬─────────┘                        │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Backend API       │
                    │  (localhost:5144)   │
                    │     .NET Core       │
                    └─────────────────────┘
```

### Patrón de Estado

Se utiliza un servicio de estado centralizado (`DashboardStateService`) basado en **Signals** de Angular para:
- Compartir estado entre componentes padre-hijo
- Reactvidad eficiente con `computed()` y `effect()`
- Gestión de datos de sedes, niveles, cajones, reservas e historial

---

## Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Angular** | 19.2.0 | Framework principal de desarrollo |
| **TypeScript** | 5.7.2 | Lenguaje de programación tipado |
| **RxJS** | 7.8.0 | Programación reactiva |
| **TailwindCSS** | 4.1.17 | Framework CSS utility-first |
| **DaisyUI** | 5.5.5 | Componentes UI para Tailwind |
| **Lucide Angular** | 0.556.0 | Iconos SVG |
| **Zone.js** | 0.15.0 | Detección de cambios de Angular |

### Herramientas de Desarrollo

| Herramienta | Versión | Descripción |
|-------------|---------|-------------|
| **Angular CLI** | 19.2.5 | CLI para desarrollo Angular |
| **Karma** | 6.4.0 | Test runner |
| **Jasmine** | 5.6.0 | Framework de testing |
| **PostCSS** | 8.5.6 | Procesador CSS |

### Backend (Requerido)

| Tecnología | Puerto | Descripción |
|------------|--------|-------------|
| **API REST** | 5144 | Backend .NET Core (no incluido) |

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.x LTS ([Descargar](https://nodejs.org/))
- **npm** >= 9.x (incluido con Node.js)
- **Angular CLI** >= 19.x
- **Git** (opcional, para clonar el repositorio)
- **Backend API** corriendo en `localhost:5144`

### Verificar instalaciones

```bash
# Verificar Node.js
node --version
# Salida esperada: v18.x.x o superior

# Verificar npm
npm --version
# Salida esperada: 9.x.x o superior

# Verificar Angular CLI
ng version
# Si no está instalado, ejecutar: npm install -g @angular/cli
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd ParkSmart
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Verificar la instalación

```bash
ng version
```

Deberías ver algo como:
```
Angular CLI: 19.2.5
Node: 18.x.x
Package Manager: npm 9.x.x
OS: win32 x64

Angular: 19.2.0
... animations, common, compiler, compiler-cli, core, forms
... platform-browser, platform-browser-dynamic, router

Package                         Version
---------------------------------------------------------
@angular-devkit/architect       0.1902.5
@angular-devkit/build-angular   19.2.5
@angular-devkit/core            19.2.5
@angular-devkit/schematics      19.2.5
@angular/cli                    19.2.5
@schematics/angular             19.2.5
rxjs                            7.8.0
typescript                      5.7.2
zone.js                         0.15.0
```

---

## Configuración

### Variables de Entorno

Los servicios están configurados para conectarse al backend en:

```typescript
// Ubicación: src/app/Shared/Services/auth.service.ts
private readonly _URLBACK = "http://localhost:5144/api/auth/";

// Ubicación: src/app/Shared/Services/sede.service.ts
private readonly _URLBACK = "http://localhost:5144/api/sede/";

// Ubicación: src/app/Shared/Services/asignacion.service.ts
private readonly _URLBACK = "http://localhost:5144/api/asignacion/";
```

> **Nota**: Para cambiar la URL del backend, modifica las constantes `_URLBACK` en los archivos de servicios correspondientes.

### Configuración de TypeScript

El proyecto usa TypeScript en modo estricto con las siguientes opciones habilitadas:

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "target": "ES2022",
    "module": "ES2022"
  }
}
```

---

## Uso del Sistema

### Iniciar el servidor de desarrollo

```bash
npm start
# o alternativamente
ng serve
```

La aplicación estará disponible en: **http://localhost:4200**

### Compilar para producción

```bash
npm run build
# o
ng build --configuration production
```

Los archivos compilados se generarán en el directorio `dist/park-smart/`.

### Ejecutar en modo watch

```bash
npm run watch
```

---

## Estructura del Proyecto

```
ParkSmart/
├── 📂 public/                     # Archivos estáticos públicos
├── 📂 src/
│   ├── 📄 index.html              # HTML principal
│   ├── 📄 main.ts                 # Punto de entrada de la aplicación
│   ├── 📄 styles.css              # Estilos globales (Tailwind + DaisyUI)
│   │
│   └── 📂 app/
│       ├── 📄 app.component.*     # Componente raíz
│       ├── 📄 app.config.ts       # Configuración de la aplicación
│       ├── 📄 app.routes.ts       # Definición de rutas
│       │
│       ├── 📂 Pages/              # Páginas de la aplicación
│       │   ├── 📂 Private/        # Páginas protegidas (requieren auth)
│       │   │   ├── 📂 DashboardSede/
│       │   │   │   ├── 📄 DashboardSede.ts/.html
│       │   │   │   ├── 📂 Components/
│       │   │   │   │   ├── 📂 DashboardHeader/
│       │   │   │   │   └── 📂 DashboardSidebar/
│       │   │   │   ├── 📂 Interfaces/
│       │   │   │   │   └── 📄 dashboard.interfaces.ts
│       │   │   │   ├── 📂 Pages/
│       │   │   │   │   ├── 📂 DashboardOverview/
│       │   │   │   │   ├── 📂 DashboardMapa/
│       │   │   │   │   ├── 📂 DashboardReservas/
│       │   │   │   │   └── 📂 DashboardHistorial/
│       │   │   │   └── 📂 Services/
│       │   │   │       └── 📄 dashboard-state.service.ts
│       │   │   │
│       │   │   └── 📂 HomePage/
│       │   │       ├── 📄 HomePage.ts/.html
│       │   │       └── 📂 Components/
│       │   │           ├── 📂 DrawerConfiguracion/
│       │   │           ├── 📂 ModalAccesoEdicion/
│       │   │           ├── 📂 ModalAccesoSede/
│       │   │           ├── 📂 ModalCrearSede/
│       │   │           ├── 📂 ModalEditarSede/
│       │   │           ├── 📂 Navbar/
│       │   │           ├── 📂 SedeCard/
│       │   │           └── 📂 SedesGrid/
│       │   │
│       │   └── 📂 Public/         # Páginas públicas
│       │       └── 📂 Auth/
│       │           ├── 📂 SignIn/
│       │           └── 📂 SignUp/
│       │
│       └── 📂 Shared/             # Recursos compartidos
│           ├── 📂 Components/
│           │   └── 📂 alert-container/
│           ├── 📂 Guards/
│           │   └── 📄 auth-guard.ts
│           ├── 📂 Interfaces/
│           │   ├── 📄 asignacion.interface.ts
│           │   ├── 📄 auth.interface.ts
│           │   ├── 📄 common.interface.ts
│           │   ├── 📄 enums.ts
│           │   ├── 📄 index.ts
│           │   ├── 📄 sede.interface.ts
│           │   └── 📄 storage.interface.ts
│           └── 📂 Services/
│               ├── 📄 Alert.service.ts
│               ├── 📄 asignacion.service.ts
│               ├── 📄 auth.service.ts
│               ├── 📄 localStorage.service.ts
│               └── 📄 sede.service.ts
│
├── 📄 angular.json                # Configuración de Angular CLI
├── 📄 package.json                # Dependencias y scripts
├── 📄 tsconfig.json               # Configuración de TypeScript
├── 📄 tsconfig.app.json           # Config TS para la app
├── 📄 tsconfig.spec.json          # Config TS para tests
└── 📄 README.md                   # Este archivo
```

---

## API Backend

El sistema requiere un backend API REST corriendo en `http://localhost:5144`. A continuación se documentan los endpoints utilizados:

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/registro` | Registrar nuevo usuario |
| `POST` | `/login` | Iniciar sesión (devuelve JWT) |
| `GET` | `/usuarios` | Listar usuarios (Admin/Gerente) |
| `GET` | `/usuario/{id}` | Obtener usuario por ID |
| `PUT` | `/usuario/{id}` | Actualizar información de usuario |
| `PATCH` | `/usuario/cambiar-password` | Cambiar contraseña |
| `PATCH` | `/usuario/{id}/cambiar-rol` | Cambiar rol de usuario |

### Sedes (`/api/sede`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Obtener todas las sedes |
| `GET` | `/{id}` | Obtener sede por ID |
| `POST` | `/` | Crear nueva sede |
| `POST` | `/verificar-acceso` | Verificar contraseña de sede |
| `GET` | `/{id}/estadisticas` | Obtener estadísticas de sede |
| `PATCH` | `/{id}/estado` | Cambiar estado de sede |
| `GET` | `/{id}/niveles` | Obtener niveles con cajones |
| `GET` | `/{id}/niveles/{nivelId}/cajones` | Obtener cajones de un nivel |
| `PUT` | `/{id}/actualizar-completa` | Actualizar sede completa |

### Asignaciones (`/api/asignacion`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/cajon-especifico` | Asignar cajón específico (ticket) |
| `POST` | `/cajon-automatico` | Asignar cajón automáticamente |
| `POST` | `/reserva` | Crear nueva reserva |
| `GET` | `/reservas/sede/{sedeId}` | Obtener reservas de sede |
| `GET` | `/reserva/{id}` | Obtener reserva por ID |
| `GET` | `/reserva/{id}/calcular-pago` | Calcular costo de reserva |
| `POST` | `/reserva/{id}/pagar` | Pagar y completar reserva |
| `GET` | `/ticket/{id}/calcular-pago` | Calcular costo de ticket |
| `POST` | `/ticket/{id}/pagar` | Pagar y liberar ticket |
| `GET` | `/historial/sede/{sedeId}` | Obtener historial de sede |
| `PATCH` | `/cajon/cambiar-tipo` | Cambiar tipo de cajón |

---

## Despliegue

### Build de producción

```bash
ng build --configuration production
```

Los archivos optimizados se generan en `dist/park-smart/` e incluyen:
- Minificación de código
- Tree-shaking
- Hashing de archivos para cache busting
- Optimización de assets

### Servidor web

Los archivos compilados pueden servirse desde cualquier servidor web estático:

```bash
# Ejemplo con http-server
npx http-server dist/park-smart

# Ejemplo con serve
npx serve dist/park-smart
```

---

## Licencia

Este proyecto es parte del curso de **Sistemas Abiertos 1** - Proyecto Final.

---

## Autores

- **Desarrollador** - Jordan Cazares Elias

---

## Soporte

Si tienes preguntas o problemas:

1. Revisa la documentación en este README
2. Verifica que el backend esté corriendo en el puerto 5144
3. Asegúrate de tener las versiones correctas de Node.js y Angular CLI

---

<div align="center">

**Si este proyecto te fue útil, considera darle una estrella**

Desarrollado con <3 usando Angular 19

</div> 
