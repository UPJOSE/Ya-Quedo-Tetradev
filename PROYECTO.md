# Resumen del Proyecto — YA QUEDÓ

Marketplace web que conecta clientes con técnicos verificados (electricistas, plomeros, cerrajeros, etc.) para contratar servicios del hogar, con recomendaciones asistidas por IA.

## Arquitectura

| Capa      | Tecnología                                                                 | Ubicación   |
|-----------|-----------------------------------------------------------------------------|-------------|
| Frontend  | Angular 21 (standalone components), Angular Material/CDK, Tailwind CSS      | `frontend/` |
| Backend   | Spring Boot 3.5 (Java 21), Spring Security + JWT, Spring Data JPA, Spring AI | `backend/`  |
| Base de datos | PostgreSQL (Liquibase para migraciones)                                | —           |

## Páginas del Frontend

| Ruta                    | Componente                | Acceso            | Descripción |
|--------------------------|----------------------------|-------------------|-------------|
| `/`                      | `LandingComponent`        | Público           | Página de aterrizaje: hero, estadísticas, beneficios para clientes y técnicos, cómo funciona, testimonios y FAQ. |
| `/login`                 | `LoginComponent`          | Solo invitados    | Inicio de sesión con email y contraseña. |
| `/register`              | `RegisterComponent`       | Solo invitados    | Registro de nuevos clientes. |
| `/catalog`               | `CatalogComponent`        | Público           | Catálogo de técnicos con filtros (categoría, distrito, calificación mínima, disponibilidad), ordenamiento y paginación. |
| `/technician/:id`        | `TechnicianDetailComponent` | Público (contratar requiere login) | Perfil detallado de un técnico y modal para crear una solicitud de contrato (descripción, dirección, precio acordado, fecha). |
| `/profile`               | `ProfileComponent`        | Autenticado       | Ver y editar datos del perfil del usuario (nombre, teléfono, dirección, biografía, distrito, método de pago preferido). |
| `/assistant`             | `AssistantComponent`      | Autenticado       | Chat con asistente de IA que recomienda técnicos según categoría, distrito y presupuesto descritos por el usuario. |
| `**`                     | Redirección a `/`         | —                 | Ruta comodín. |

Rutas protegidas mediante `authGuard` (requiere sesión) y `guestGuard` (solo si no hay sesión), definidas en `frontend/src/app/guards/auth.guard.ts`.

**Servicios del frontend** (`frontend/src/app/services`): auth, catalog, profile, contract, ai.

## Endpoints principales del Backend

| Controlador             | Base path                          | Descripción |
|--------------------------|-------------------------------------|-------------|
| `AuthController`         | `/api/v1/auth` (`/auth`)           | `register`, `login`, `refresh`, `logout`. |
| `CatalogController`      | `/api/v1/catalog`                  | Categorías, búsqueda de técnicos con filtros/paginación, detalle de técnico. |
| `ContractController`     | `/api/v1/contracts`                | Creación de contratos (requiere autenticación). |
| `ProfileController`      | `/api/v1/profile`                  | Obtener/actualizar perfil e imagen del usuario autenticado. |
| `DashboardController`    | `/api/v1/dashboard`                | Panel resumen del usuario autenticado. |
| `PublicController`       | `/` , `/api/v1/public`             | Health check, distritos y categorías (sin autenticación). |

Autenticación basada en JWT; documentación de API generada con springdoc-openapi (Swagger).

## Despliegue

| Componente | Proveedor | Configuración |
|------------|-----------|----------------|
| Backend    | [Render](https://render.com) | `render.yaml` — servicio Docker (`backend/Dockerfile`), variables `DATABASE_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `ALLOWED_ORIGINS`, más base de datos PostgreSQL gestionada (`yaquedo-db`). |
| Frontend   | [Vercel](https://vercel.com) | `frontend/vercel.json` — build `npm run build` (`ng build`), salida `dist/frontend/browser`, rewrites SPA. |

Orígenes permitidos por CORS en el backend (`ALLOWED_ORIGINS`):
- `https://ya-quedo.vercel.app`
- `https://ya-quedo-angular.vercel.app`
- `https://ya-quedo-tetradev.vercel.app`
- `https://ya-quedo-tetradev-26rv77l3w-up-joses-projects.vercel.app`
- `https://*.vercel.app`

## Notas

- La carpeta raíz del repositorio conserva restos de una plantilla previa en React + Vite (`src/`, `index.html`, `vite.config.ts`, `vercel.json` raíz) que **ya no se usa**; el frontend activo es `frontend/` (Angular).
- Ver `README.md` para instrucciones de instalación y ejecución local de frontend y backend.
