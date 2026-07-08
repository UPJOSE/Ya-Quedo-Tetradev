# YA QUEDÓ

Marketplace web para contratar servicios técnicos del hogar. Compuesto por un frontend en **Angular** y un backend en **Spring Boot (Java)**.

## Estructura del proyecto

```
Ya-Quedo-Tetradev-main/
├── frontend/     # Aplicación Angular (Angular CLI 21, standalone components, Tailwind CSS)
├── backend/      # API REST en Spring Boot (Java 21, Maven)
└── render.yaml   # Configuración de despliegue del backend en Render
```

> Nota: la carpeta raíz también contiene restos de una plantilla de Vite/React (`src/`, `index.html`, `vite.config.ts`, etc.) que ya **no se utiliza**. El frontend oficial del proyecto vive en `frontend/`.

## Frontend (Angular)

Ubicado en [`frontend/`](./frontend).

**Stack:** Angular 21 (standalone components), Angular Material, Angular CDK, RxJS, Tailwind CSS, `lucide-angular`.

**Páginas principales** (`frontend/src/app/pages`): `landing`, `login`, `register`, `catalog`, `technician-detail`, `profile`, `assistant`.

**Estructura interna** (`frontend/src/app`): `components/`, `guards/`, `interceptors/`, `models/`, `services/`, `pages/`, junto con `app.routes.ts` y `app.config.ts`.

### Requisitos
- Node.js LTS y npm
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`, opcional ya que se puede usar `npx ng`)

### Comandos

```bash
cd frontend
npm install

# Servidor de desarrollo (http://localhost:4200)
npm start        # equivalente a: ng serve

# Build de producción (salida en dist/frontend/browser)
npm run build    # equivalente a: ng build

# Tests unitarios (Vitest)
npm test         # equivalente a: ng test
```

Más detalles en [`frontend/README.md`](./frontend/README.md).

## Backend (Spring Boot)

Ubicado en [`backend/`](./backend).

**Stack:** Java 21, Spring Boot 3.5, Spring Web, Spring Data JPA, Spring Security, Spring WebFlux, Spring AI (integración con modelos compatibles con OpenAI, p. ej. Groq), PostgreSQL, Liquibase, JWT (`jjwt`), MapStruct, Lombok, springdoc-openapi.

**Paquetes principales** (`backend/src/main/java/com/yaquedo`): `controller`, `service`, `repository`, `entity`, `dto`, `mapper`, `security`, `ai`, `config`, `exception`.

### Requisitos
- JDK 21
- Maven (o usar el wrapper si está disponible)
- PostgreSQL

### Comandos

```bash
cd backend
mvn clean install

# Ejecutar en local
mvn spring-boot:run
```

Configura las variables de entorno necesarias (`DATABASE_URL`/`SPRING_DATASOURCE_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `ALLOWED_ORIGINS`, etc.) antes de ejecutar. Consulta `backend/entrypoint.sh` y `backend/src/main/resources` para más detalle.

También se incluye un `Dockerfile` para construir la imagen del backend:

```bash
docker build -t yaquedo-backend ./backend
docker run -p 8080:8080 yaquedo-backend
```

## Despliegue

- **Backend**: configurado para Render vía [`render.yaml`](./render.yaml) (servicio Docker + base de datos PostgreSQL).
- **Frontend**: configurado para Vercel vía [`frontend/vercel.json`](./frontend/vercel.json) (build con `ng build`, salida en `dist/frontend/browser`).
