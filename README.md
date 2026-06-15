# AgroLink

## Trabajo de Fin de Grado — Desarrollo de Aplicaciones Multiplataforma

Sistema integral para la gestión agrícola, con arquitectura full-stack basada en **NestJS**, **React Native / Expo**, **React + Vite** y **MySQL** en contenedores Docker.

Este proyecto ha sido desarrollado como solución de software orientada a la digitalización de tareas agrícolas, facilitando la gestión de cultivos, tareas, usuarios y operaciones relacionadas con la producción agraria desde una aplicación móvil y una interfaz web.

---

## Índice

1. [Resumen del proyecto](#1-resumen-del-proyecto)
2. [Objetivos del TFG](#2-objetivos-del-tfg)
3. [Funcionalidades principales](#3-funcionalidades-principales)
4. [Arquitectura del sistema](#4-arquitectura-del-sistema)
5. [Tecnologías utilizadas](#5-tecnologías-utilizadas)
6. [Estructura del repositorio](#6-estructura-del-repositorio)
7. [Requisitos previos](#7-requisitos-previos)
8. [Puesta en marcha — guía paso a paso](#8-puesta-en-marcha--guía-paso-a-paso)
9. [Variables de entorno](#9-variables-de-entorno)
10. [Acceso a la documentación de la API (Swagger)](#10-acceso-a-la-documentación-de-la-api-swagger)
11. [Solución de problemas (Troubleshooting)](#11-solución-de-problemas-troubleshooting)
12. [Licencia](#12-licencia)
13. [Autores](#13-autores)

---

## 1. Resumen del proyecto

AgroLink pretende ofrecer una plataforma reutilizable y escalable para apoyar a agricultores y perfiles relacionados con la actividad agraria en la monitorización y coordinación de sus operaciones diarias. La solución combina:

- una API REST robusta y segura,
- una aplicación móvil para uso práctico en campo,
- una interfaz web para gestión y visualización,
- una base de datos relacional para el almacenamiento de información agrícola.

El objetivo principal es demostrar cómo el desarrollo de software puede aportar valor real en el sector agrícola mediante automatización, trazabilidad y una experiencia de uso clara.

---

## 2. Objetivos del TFG

### Objetivo general

Diseñar e implementar una plataforma digital para la gestión de actividades agrícolas, integrando backend, frontend y base de datos en un entorno funcional y documentado.

### Objetivos específicos

- Crear una API backend con autenticación JWT y gestión de las entidades principales del dominio.
- Desarrollar una aplicación móvil para consultar y gestionar información agraria desde el campo.
- Incorporar una interfaz web para visualización y administración.
- Definir una arquitectura modular y escalable que permita futuras ampliaciones.
- Preparar el proyecto para una ejecución local reproducible mediante Docker y herramientas modernas de desarrollo.

---

## 3. Funcionalidades principales

La solución actual incluye soporte para:

- autenticación y control de acceso basado en roles (JWT),
- gestión de usuarios y roles,
- administración de cultivos y parcelas,
- seguimiento y planificación de tareas agrícolas,
- gestión de productos y producciones,
- conversaciones y mensajería básica entre usuarios (Socket.IO),
- integración con servicios externos (información meteorológica vía OpenWeather) y visualización de datos mediante gráficas.

Esta base funcional permite ampliar el sistema con módulos avanzados como alertas, predicción de riego, generación de reportes, trazabilidad o análisis de rendimiento.

---

## 4. Arquitectura del sistema

El proyecto sigue una arquitectura multicapa desacoplada:

- **Frontend móvil:** React Native + Expo
- **Frontend web:** React + TypeScript + Vite
- **Backend:** NestJS + TypeORM + Passport/JWT
- **Base de datos:** MySQL 8
- **Contenedores:** Docker Compose (orquesta MySQL, backend y frontend web)

### Flujo general

1. El usuario interactúa con la aplicación móvil o con la interfaz web.
2. La interfaz consume la API REST del backend (puerto `3000`).
3. El backend valida la autenticación (JWT), aplica las reglas de negocio y los pipes de validación de datos.
4. TypeORM traduce las operaciones a consultas SQL y persiste los datos en MySQL.
5. Docker Compose facilita el levantamiento reproducible de todo el entorno (base de datos, API y frontend web) con un único comando.

---

## 5. Tecnologías utilizadas

### Backend

- TypeScript
- NestJS
- TypeORM
- Passport + JWT
- MySQL 8
- Socket.IO
- Swagger / OpenAPI
- Docker

### Frontend móvil

- React Native
- Expo
- React Navigation
- AsyncStorage
- Socket.IO client

### Frontend web

- React
- TypeScript
- Vite
- React Router
- Recharts
- Nginx (servidor de la build en producción/Docker)

---

## 6. Estructura del repositorio

```text
.
├── backend/                  # API REST con NestJS
│   ├── src/
│   │   ├── modules/          # auth, crops, tasks, products, productions, conversations, admin
│   │   ├── database/         # entidades TypeORM
│   │   └── common/           # guards, decorators, utilidades
│   └── Dockerfile
├── frontend/
│   ├── mobile/app-mobile/    # Aplicación móvil Expo / React Native (requiere .env)
│   └── web/app-web/          # Aplicación web React + Vite (con Dockerfile, nginx.conf y .env)
├── database/                 # Scripts SQL de inicialización (orden alfabético de ejecución)
│   ├── 01_schema.sql         # Esquema completo (tablas, claves, ENUMs)
│   ├── 02_seed.sql           # Datos de prueba
│   └── migrate.sql.bak       # Migración histórica, ya integrada en 01_schema.sql (no se ejecuta)
├── docker/
│   └── docker-compose.yml    # Orquestación de MySQL + backend + frontend web (requiere .env)
└── README.md
```

> **Nota sobre `database/`:** los scripts en esta carpeta se montan en `/docker-entrypoint-initdb.d/` del contenedor de MySQL y **se ejecutan en orden alfabético** la primera vez que se crea el volumen de datos. Por eso los nombres llevan prefijos numéricos (`01_`, `02_`). El archivo `migrate.sql.bak` se conserva como referencia histórica del desarrollo, pero no tiene extensión `.sql`, por lo que MySQL lo ignora.

---

## 7. Requisitos previos

Antes de arrancar el proyecto, asegúrate de tener instalado:

- **Docker Engine** y **Docker Compose** (se admite tanto el plugin `docker compose` v2 como el binario clásico `docker-compose`)
- **Node.js 20** o superior y **npm** (necesario si se va a ejecutar backend/frontend sin Docker, en modo desarrollo)
- **Expo CLI** (`npx expo`) para ejecutar la aplicación móvil
- Un editor de texto para crear los archivos de variables de entorno (`.env`)

Para comprobar las versiones instaladas:

```bash
docker --version
docker-compose --version
node --version
npm --version
```

---

## 8. Puesta en marcha — guía paso a paso

Existen dos formas de ejecutar el proyecto: **(A) todo con Docker** (recomendado para evaluación/demo, un solo comando) y **(B) modo desarrollo** (backend y frontend en local con hot-reload, MySQL en Docker).

### 8.1 Acceder a la carpeta del proyecto

```bash
cd ~/Trabajo_Final_De_Grado_Pablo_Ruiz_Carlos_Álvarez_15_Junio_2026_CoreNetworksSevilla/TFG_PabloRuiz_CarlosAlvarez_Proyecto_15_Junio_2026_CoreNetworksSevilla
cd TFG-PabloRuiz_Carlos-Alvarez-main
```

### 8.2 Comprobar permisos del proyecto

Si el proyecto se ha descomprimido desde un `.zip`, es habitual que algunas carpetas queden con permisos restrictivos (`700`), lo que impide que el contenedor de MySQL lea la carpeta `database/` al inicializarse (error `Permission denied` sobre `/docker-entrypoint-initdb.d/`). Para evitarlo, concede permisos de lectura/ejecución a todo el árbol del proyecto y a tu directorio personal:

```bash
chmod o+x ~
chmod -R a+rX ~/Trabajo_Final_De_Grado_Pablo_Ruiz_Carlos_Álvarez_15_Junio_2026_CoreNetworksSevilla
```

Este comando no afecta a los permisos de escritura, solo añade lectura/acceso a directorios para que Docker pueda montar y leer los archivos.

### 8.3 Crear los archivos de variables de entorno (`.env`)

> **Importante:** el proyecto necesita **tres archivos `.env` distintos**, cada uno en su carpeta correspondiente. Un nombre incorrecto (por ejemplo `.nev`) o una ubicación incorrecta provoca errores al construir o levantar los contenedores (ver apartado [11. Solución de problemas](#11-solución-de-problemas-troubleshooting)).

| #   | Archivo                           | Para qué sirve                                                                                    |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | `docker/.env`                     | Variables usadas por Docker Compose: MySQL, backend, JWT y _build args_ del frontend web.         |
| 2   | `frontend/web/app-web/.env`       | Variables que el `Dockerfile` del frontend web copia y exporta durante el `npm run build` (Vite). |
| 3   | `frontend/mobile/app-mobile/.env` | Variables que consume la app Expo/React Native (`EXPO_PUBLIC_*`).                                 |

#### 1) `docker/.env`

```bash
cd docker
nano .env
```

```env
# --- MySQL ---
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=tfg_agricola
MYSQL_USER=tfg_user
MYSQL_PASSWORD=tfg_password

# --- Backend (NestJS) ---
DB_HOST=mysql
DB_PORT=3306
DB_USER=tfg_user
DB_PASS=tfg_password
DB_NAME=tfg_agricola
JWT_SECRET=agro_link_secret_key_2024
JWT_EXPIRES=7d
NODE_ENV=production

# --- Frontend web (Vite, build args) ---
VITE_API_URL=http://localhost:3000
VITE_USE_MOCK_API=false

# --- Servicios externos ---
# Clave gratuita en https://openweathermap.org/api
# Si se deja vacío, la app funciona pero el módulo de clima no mostrará datos
OPENWEATHER_API_KEY=
```

Guarda el archivo (`Ctrl+O`, `Enter`, `Ctrl+X` en `nano`).

#### 2) `frontend/web/app-web/.env`

```bash
cd ../frontend/web/app-web
nano .env
```

```env
VITE_API_URL=http://localhost:3000
VITE_USE_MOCK_API=false
VITE_OPENWEATHER_API_KEY=
```

> Este archivo es **obligatorio**: el `Dockerfile` del frontend web ejecuta `COPY .env .env` durante el build. Si no existe, la construcción de la imagen falla con `COPY failed: file not found in build context` (ver [11.3](#113-error-copy-failed-file-not-found-in-build-context-stat-env)).

#### 3) `frontend/mobile/app-mobile/.env`

```bash
cd ../../mobile/app-mobile
nano .env
```

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_OWM_KEY=
```

> Expo solo expone al código de la app las variables que empiezan por `EXPO_PUBLIC_`. `EXPO_PUBLIC_API_URL` es la URL del backend que consume `authApi.ts` y el resto de servicios; `EXPO_PUBLIC_OWM_KEY` es la clave de OpenWeather usada por `weatherApi.ts` (puede dejarse vacía).
>
> Si vas a probar la app en un **dispositivo físico** o un **emulador**, `localhost` no apunta al backend (apunta al propio dispositivo). Sustituye `EXPO_PUBLIC_API_URL` por la IP local de la máquina que ejecuta el backend, por ejemplo:
>
> ```env
> EXPO_PUBLIC_API_URL=http://192.168.1.50:3000
> ```
>
> Puedes obtener tu IP local con `hostname -I` (Linux) o `ipconfig` (Windows).

### 8.4 Opción A — Arranque completo con Docker (recomendado)

Desde la carpeta `docker/`:

```bash
cd docker
docker-compose up -d --build
```

> Si tu sistema solo tiene instalado el plugin v2, el comando equivalente es `docker compose up -d --build` (sin guion). Ambos son válidos con el `docker-compose.yml` de este proyecto.

Este comando:

1. Descarga la imagen de **MySQL 8** y crea el contenedor `tfg_mysql`, inicializando automáticamente la base de datos `tfg_agricola` con los scripts de `database/` (`01_schema.sql` y `02_seed.sql`, montados en `/docker-entrypoint-initdb.d`).
2. Construye la imagen del **backend** (NestJS) a partir de `backend/Dockerfile` y levanta el contenedor `tfg_backend`, esperando a que MySQL esté saludable (`healthcheck`).
3. Construye la imagen del **frontend web** (build de producción con Vite, servida por Nginx) y levanta el contenedor `tfg_frontend`. Para este paso es imprescindible que exista `frontend/web/app-web/.env` (ver [8.3](#83-crear-los-archivos-de-variables-de-entorno-env)).

Comprobar el estado de los servicios:

```bash
docker-compose ps
```

Salida esperada (los tres servicios `Up`, MySQL en `healthy`):

```
    Name                  Command                  State                     Ports
------------------------------------------------------------------------------------------------
tfg_backend    docker-entrypoint.sh node  ...   Up             0.0.0.0:3000->3000/tcp
tfg_frontend   /docker-entrypoint.sh ngin ...   Up             0.0.0.0:5173->80/tcp
tfg_mysql      docker-entrypoint.sh mysqld      Up (healthy)   0.0.0.0:3310->3306/tcp, 33060/tcp
```

Consultar logs en caso de duda:

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

El backend, al arrancar correctamente, muestra en su log un resumen con todas las URLs disponibles:

```
┌─────────────────────────────────────────────────┐
│             🌱  AgroLink — TFG DAM              │
├─────────────────────────────────────────────────┤
│  Frontend    →  http://localhost:5173            │
│  Backend     →  http://localhost:3000            │
│  Swagger     →  http://localhost:3000/api/docs   │
│  MySQL       →  localhost:3310                   │
└─────────────────────────────────────────────────┘
```

#### Servicios disponibles

| Servicio | URL                            | Puerto interno | Descripción                                  |
| -------- | ------------------------------ | -------------- | -------------------------------------------- |
| Frontend | http://localhost:5173          | 80             | Interfaz web (build de producción vía Nginx) |
| Backend  | http://localhost:3000          | 3000           | API REST (NestJS)                            |
| Swagger  | http://localhost:3000/api/docs | 3000           | Documentación interactiva de la API          |
| MySQL    | `localhost:3310`               | 3306           | Base de datos `tfg_agricola`                 |

#### Detener / reiniciar el entorno

```bash
# Detener los contenedores (conserva los datos de MySQL)
docker-compose down

# Detener y eliminar también el volumen de datos (reinicio completo, vuelve a ejecutar los scripts SQL)
docker-compose down -v

# Reconstruir imágenes tras cambios en el código
docker-compose up -d --build
```

### 8.5 Opción B — Modo desarrollo (sin Docker para backend/frontend)

Recomendado durante el desarrollo, ya que permite hot-reload. Solo MySQL se ejecuta en Docker.

#### 8.5.1 Levantar únicamente la base de datos

```bash
cd docker
docker-compose up -d mysql
```

#### 8.5.2 Backend (NestJS)

```bash
cd ../backend
npm install --legacy-peer-deps
```

Crea el archivo `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3310
DB_USER=tfg_user
DB_PASS=tfg_password
DB_NAME=tfg_agricola
JWT_SECRET=agro_link_secret_key_2024
JWT_EXPIRES=7d
NODE_ENV=development
```

> Nótese que, fuera de Docker, `DB_HOST` debe ser `localhost` y `DB_PORT` el puerto **publicado** (`3310`), no el puerto interno del contenedor (`3306`).

Arrancar en modo desarrollo (con recarga en caliente):

```bash
npm run start:dev
```

El backend quedará disponible en `http://localhost:3000` y mostrará un resumen de URLs por consola al arrancar.

#### 8.5.3 Frontend web (React + Vite)

```bash
cd ../frontend/web/app-web
npm install --legacy-peer-deps
```

Usa el archivo `frontend/web/app-web/.env` creado en el paso [8.3](#83-crear-los-archivos-de-variables-de-entorno-env):

```env
VITE_API_URL=http://localhost:3000
VITE_USE_MOCK_API=false
VITE_OPENWEATHER_API_KEY=
```

Arrancar en modo desarrollo:

```bash
npm run dev
```

La interfaz web quedará disponible en `http://localhost:5173`.

#### 8.5.4 Aplicación móvil (Expo)

```bash
cd ../../mobile/app-mobile
npm install --legacy-peer-deps
```

Usa el archivo `frontend/mobile/app-mobile/.env` creado en el paso [8.3](#83-crear-los-archivos-de-variables-de-entorno-env):

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_OWM_KEY=
```

Arrancar:

```bash
npx expo start
```

Para probar en un dispositivo físico o emulador, consulta `frontend/mobile/app-mobile/BACKEND_INTEGRATION.md` y `QUICK_START.md`: normalmente es necesario sustituir `localhost` por la IP local del equipo que ejecuta el backend (por ejemplo, `http://192.168.1.50:3000`), ya que el dispositivo móvil no puede resolver `localhost` como el ordenador anfitrión. Recuerda actualizar `EXPO_PUBLIC_API_URL` en `frontend/mobile/app-mobile/.env` en consecuencia.

---

## 9. Variables de entorno

### 9.1 `docker/.env` (orquestación completa)

| Variable              | Descripción                                                        | Valor por defecto             |
| --------------------- | ------------------------------------------------------------------ | ----------------------------- |
| `MYSQL_ROOT_PASSWORD` | Contraseña del usuario root de MySQL                               | `root`                        |
| `MYSQL_DATABASE`      | Nombre de la base de datos                                         | `tfg_agricola`                |
| `MYSQL_USER`          | Usuario de la base de datos                                        | `tfg_user`                    |
| `MYSQL_PASSWORD`      | Contraseña del usuario de la base de datos                         | `tfg_password`                |
| `DB_HOST`             | Host de MySQL visto por el backend                                 | `mysql` (nombre del servicio) |
| `DB_PORT`             | Puerto de MySQL dentro de la red Docker                            | `3306`                        |
| `DB_USER` / `DB_PASS` | Credenciales que usa el backend para conectarse                    | `tfg_user` / `tfg_password`   |
| `DB_NAME`             | Base de datos usada por el backend                                 | `tfg_agricola`                |
| `JWT_SECRET`          | Clave secreta para firmar los tokens JWT                           | `agro_link_secret_key_2024`   |
| `JWT_EXPIRES`         | Tiempo de expiración de los tokens                                 | `7d`                          |
| `NODE_ENV`            | Entorno de ejecución del backend                                   | `production`                  |
| `VITE_API_URL`        | URL de la API consumida por el frontend web (build arg)            | `http://localhost:3000`       |
| `VITE_USE_MOCK_API`   | Si `true`, el frontend usa datos simulados en lugar de la API real | `false`                       |
| `OPENWEATHER_API_KEY` | Clave de la API de OpenWeather para el módulo de clima             | _(vacío)_                     |

### 9.2 `backend/.env` (modo desarrollo)

Mismas variables `DB_*`, `JWT_SECRET`, `JWT_EXPIRES` y `NODE_ENV`, ajustando `DB_HOST=localhost` y `DB_PORT=3310` (puerto publicado por Docker) cuando MySQL corre en contenedor pero el backend se ejecuta en local.

### 9.3 `frontend/web/app-web/.env`

| Variable                   | Descripción                                                        | Valor por defecto       |
| -------------------------- | ------------------------------------------------------------------ | ----------------------- |
| `VITE_API_URL`             | URL de la API consumida por el frontend web                        | `http://localhost:3000` |
| `VITE_USE_MOCK_API`        | Si `true`, el frontend usa datos simulados en lugar de la API real | `false`                 |
| `VITE_OPENWEATHER_API_KEY` | Clave de OpenWeather usada por la web                              | _(vacío)_               |

**Obligatorio para construir la imagen Docker del frontend web** (el `Dockerfile` hace `COPY .env .env`), y también necesario en modo desarrollo (`npm run dev`).

### 9.4 `frontend/mobile/app-mobile/.env`

| Variable              | Descripción                                                                                                        | Valor por defecto       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `EXPO_PUBLIC_API_URL` | URL base del backend consumida por todos los servicios de la app (`authApi.ts`, `cropsApi.ts`, `chatApi.ts`, etc.) | `http://localhost:3000` |
| `EXPO_PUBLIC_OWM_KEY` | Clave de la API de OpenWeather usada por `weatherApi.ts`                                                           | _(vacío)_               |

Solo las variables con prefijo `EXPO_PUBLIC_` quedan accesibles en el código de la app vía `process.env`. Si se cambia este archivo, reinicia `npx expo start` para que tome los nuevos valores.

---

## 10. Acceso a la documentación de la API (Swagger)

El backend expone documentación interactiva generada con Swagger/OpenAPI, incluyendo soporte para autenticación Bearer (JWT), en:

```
http://localhost:3000/api/docs
```

Desde esta interfaz se pueden probar todos los endpoints de los módulos `auth`, `crops`, `tasks`, `products`, `productions`, `conversations` y `admin`, incluyendo el flujo de login para obtener el token JWT necesario para las rutas protegidas.

---

## 11. Solución de problemas (Troubleshooting)

### 11.1 Error: `'env_file' does not match any of the regexes: '^x-'`

```
ERROR: The Compose file './docker-compose.yml' is invalid because:
'env_file' does not match any of the regexes: '^x-'
```

**Causa:** el binario clásico `docker-compose` (v1, Python) no admite la clave `env_file` declarada a nivel raíz del archivo (fuera de `services`); solo la admite **dentro de cada servicio**.

**Solución:** en este proyecto `env_file: - .env` ya está declarado **dentro de cada servicio** (`mysql`, `backend`, `frontend`) del `docker-compose.yml`, por lo que es compatible tanto con `docker-compose` (v1) como con `docker compose` (v2). Si editas el archivo, asegúrate de mantener `env_file` dentro de cada servicio y no en la raíz.

### 11.2 Error: `ls: cannot open directory '/docker-entrypoint-initdb.d/': Permission denied`

El contenedor `tfg_mysql` entra en bucle de reinicio (`Restarting`) y los logs muestran repetidamente este error.

**Causa:** la carpeta `database/` (montada como volumen en `/docker-entrypoint-initdb.d/`) tiene permisos demasiado restrictivos tras descomprimir el proyecto (típicamente `700`), y el usuario `mysql` dentro del contenedor no puede leerla.

**Solución:** dar permisos de lectura/ejecución a todo el árbol del proyecto, como se indica en [8.2](#82-comprobar-permisos-del-proyecto):

```bash
chmod o+x ~
chmod -R a+rX ~/Trabajo_Final_De_Grado_Pablo_Ruiz_Carlos_Álvarez_15_Junio_2026_CoreNetworksSevilla
```

A continuación, reiniciar limpio (ver [11.5](#115-reiniciar-la-base-de-datos-desde-cero)).

### 11.3 Error: `COPY failed: file not found in build context (stat .env: file does not exist)`

```
Step 6/12 : COPY .env .env
COPY failed: file not found in build context or excluded by .dockerignore: stat .env: file does not exist
ERROR: Service 'frontend' failed to build : Build failed
```

**Causa:** el `Dockerfile` de `frontend/web/app-web/` ejecuta `COPY .env .env` durante el build. El contexto de construcción de ese servicio es `frontend/web/app-web/` (definido en `docker/docker-compose.yml` como `context: ../frontend/web/app-web`), por lo que **el archivo `.env` debe existir dentro de `frontend/web/app-web/`**, no en `docker/`.

**Solución:** crear `frontend/web/app-web/.env` con el contenido indicado en [8.3](#83-crear-los-archivos-de-variables-de-entorno-env), apartado 2, y volver a ejecutar:

```bash
cd docker
docker-compose up -d --build
```

### 11.4 Error en la inicialización de la base de datos: `ERROR 1146 Table 'tfg_agricola.parcelas' doesn't exist` / `ERROR 1265 Data truncated for column 'tipo'` / `ERROR 1060 Duplicate column name 'tamano'`

Estos tres errores aparecen encadenados al inicializar `tfg_mysql` por primera vez (contenedor `Up (health: starting)` que nunca pasa a `healthy`, y `tfg_backend` queda en `unhealthy`/timeout esperando a MySQL):

```
ERROR 1146 (42S02) at line 5: Table 'tfg_agricola.parcelas' doesn't exist
ERROR 1265 (01000) at line 96: Data truncated for column 'tipo' at row 6
ERROR 1060 (42S21) at line 5: Duplicate column name 'tamano'
```

**Causa:** los scripts de `database/` se ejecutan **en orden alfabético** al crear el volumen de MySQL. El script `migrate.sql` (pensado como migración incremental _posterior_ a `schema.sql`) se ejecutaba antes que `schema.sql` por orden alfabético, intentando alterar tablas que aún no existían. Además, `seed.sql` insertaba tareas con el valor `'plaguicida'`, que no estaba incluido en el `ENUM` original de la columna `tipo` (esa ampliación la hacía precisamente `migrate.sql`).

**Solución aplicada** (ya integrada en este repositorio):

1. Los scripts se renombraron con prefijos numéricos para forzar el orden de ejecución:
   - `schema.sql` → `01_schema.sql`
   - `seed.sql` → `02_seed.sql`
2. El `ENUM` de la columna `tipo` en la tabla `tareas` de `01_schema.sql` se amplió para incluir `'plaguicida'` desde el origen:
   ```sql
   tipo ENUM ('siembra', 'riego', 'fertilizacion', 'cosecha', 'plaguicida'),
   ```
3. El antiguo `migrate.sql` (cuyos cambios ya están integrados en `01_schema.sql`) se renombró a `migrate.sql.bak` para que MySQL no lo ejecute, conservándolo solo como referencia histórica.

Si se parte de una copia del proyecto **anterior** a este ajuste, aplicar manualmente los tres cambios anteriores sobre la carpeta `database/` y reiniciar limpio (ver siguiente apartado).

### 11.5 Reiniciar la base de datos desde cero

Necesario tras cualquier cambio en los scripts de `database/`, o si MySQL quedó en un estado inconsistente por un fallo de inicialización anterior:

```bash
cd docker
docker-compose down -v
docker-compose up -d --build
```

> `down -v` elimina el volumen `mysql_data`, por lo que se perderán los datos existentes y se volverán a ejecutar `01_schema.sql` y `02_seed.sql` desde cero.

Comprobar el resultado:

```bash
docker-compose ps
docker logs tfg_mysql --tail 10
docker logs tfg_backend --tail 10
```

### 11.6 Aviso: `The OPENWEATHER_API_KEY variable is not set. Defaulting to a blank string.`

No es un error bloqueante: el proyecto arranca igualmente, pero el módulo de previsión meteorológica no mostrará datos. Para resolverlo, obtener una clave gratuita en https://openweathermap.org/api e indicarla en `OPENWEATHER_API_KEY` dentro de `docker/.env` (y, si aplica, en `frontend/web/app-web/.env` / `frontend/mobile/app-mobile/.env`).

### 11.7 El backend no puede conectar con MySQL

- Si **backend y MySQL corren ambos en Docker**: usar `DB_HOST=mysql` y `DB_PORT=3306` (nombre de servicio y puerto interno de la red de Compose).
- Si **el backend corre en local** y MySQL en Docker: usar `DB_HOST=localhost` y `DB_PORT=3310` (puerto publicado al host).
- Comprobar que el contenedor de MySQL está en estado `healthy` antes de que arranque el backend:

```bash
docker-compose ps
```

### 11.8 La app móvil no conecta con el backend (dispositivo físico/emulador)

Si `EXPO_PUBLIC_API_URL=http://localhost:3000` y la app no carga datos al probar en un teléfono o emulador, es porque `localhost` se resuelve dentro del propio dispositivo, no en el ordenador donde corre el backend. Cambia `EXPO_PUBLIC_API_URL` en `frontend/mobile/app-mobile/.env` por la IP local del ordenador (por ejemplo `http://192.168.1.50:3000`) y reinicia `npx expo start`.

### 11.9 Errores al ejecutar `npm install`

El proyecto incluye `node_modules` ya instalado dentro de `backend/`. Si surgen conflictos de dependencias o errores de compilación al reinstalar, eliminar e instalar de nuevo forzando la resolución de dependencias entre pares:

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 11.10 Puertos ya en uso

Si los puertos `3000`, `3310` o `5173` están ocupados por otro proceso, detener dicho proceso o modificar el mapeo de puertos en `docker/docker-compose.yml` (por ejemplo, `"3001:3000"`) y actualizar en consecuencia `VITE_API_URL` / `EXPO_PUBLIC_API_URL`.

---

## 12. Licencia

Este proyecto se distribuye bajo licencia **Apache License 2.0**. Consultar el archivo `LICENSE` para más detalles.

---

## 13. Autores

- **Pablo Ruiz**
- **Carlos Álvarez**

Trabajo de Fin de Grado — Desarrollo de Aplicaciones Multiplataforma
