# Finca El Progreso — Sitio Web + Sistema de Gestión

Proyecto en dos fases para la finca ganadera "El Progreso":

- **Fase 1:** sitio web estático (HTML5 + CSS3 + JS) con las secciones Inicio, Nosotros, Servicios, Productos, Galería y Contacto.
- **Fase 2 (actual):** se agregó un backend con **Node.js + Express** y una base de datos **PostgreSQL** para gestionar el proceso de **Registro de Producción de Leche**, con las nuevas opciones de menú **Gestión** y **Reportes**. Todas las secciones y funcionalidades de la fase 1 se mantienen intactas.

## Estructura del proyecto

```
finca-el-progreso/
├── index.html            → Inicio, Nosotros, Servicios, Productos, Galería, Contacto
├── gestion.html           → Formulario para registrar/editar/eliminar producción de leche
├── reportes.html          → Informe generado desde PostgreSQL
├── css/styles.css
├── js/
│   ├── script.js          → Menú, animaciones (fase 1)
│   ├── gestion.js         → Lógica del formulario y la tabla CRUD
│   └── reportes.js        → Lógica del informe
├── img/                    → Fotografías del sitio
├── server/
│   ├── server.js           → Servidor Express (sirve el sitio + la API)
│   ├── db.js                → Conexión a PostgreSQL (pool)
│   ├── routes/
│   │   ├── produccion.js    → CRUD de producción de leche
│   │   └── empleados.js     → Catálogo de empleados (solo lectura)
│   └── sql/
│       ├── schema.sql        → Creación de tablas
│       └── seed.sql          → Datos de prueba
├── package.json
├── .env.example
└── .gitignore
```

## Modelo de datos

Dos tablas relacionadas en PostgreSQL:

**`empleados`** (catálogo)
| Campo | Tipo | Detalle |
|---|---|---|
| id | SERIAL | Llave primaria |
| nombre | VARCHAR(100) | Obligatorio |
| cargo | VARCHAR(80) | |

**`produccion_leche`** (proceso principal)
| Campo | Tipo | Detalle |
|---|---|---|
| id | SERIAL | Llave primaria |
| fecha | DATE | Obligatorio |
| turno | VARCHAR(20) | "Mañana" o "Tarde" |
| cantidad_litros | NUMERIC(8,2) | Mayor a 0 |
| empleado_id | INTEGER | Llave foránea → `empleados.id` |
| estado | VARCHAR(20) | "Registrado", "Verificado" o "Anulado" |
| creado_en | TIMESTAMP | Automático |

## Requisitos previos

- [Node.js](https://nodejs.org) 18 o superior
- [PostgreSQL](https://www.postgresql.org/download/) 14 o superior
- Git

## Instalación paso a paso

### 1. Clonar el proyecto e instalar dependencias

```bash
git clone https://github.com/TU-USUARIO/finca-el-progreso.git
cd finca-el-progreso
npm install
```

### 2. Crear la base de datos

Con PostgreSQL corriendo localmente:

```bash
psql -U postgres -c "CREATE DATABASE finca_el_progreso;"
psql -U postgres -d finca_el_progreso -f server/sql/schema.sql
psql -U postgres -d finca_el_progreso -f server/sql/seed.sql
```

Esto crea las tablas `empleados` y `produccion_leche`, y las llena con datos de prueba.

### 3. Configurar las variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con los datos de tu instalación de PostgreSQL:

```
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=finca_el_progreso
PORT=3000
```

### 4. Levantar el servidor

```bash
npm start
```

Abre `http://localhost:3000` en el navegador. El sitio completo (incluyendo Gestión y Reportes) se sirve desde ese mismo servidor.

## API REST

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/empleados` | Lista de empleados |
| GET | `/api/produccion` | Lista completa de producción (con nombre de empleado) |
| GET | `/api/produccion/:id` | Un registro puntual |
| POST | `/api/produccion` | Crear un registro |
| PUT | `/api/produccion/:id` | Actualizar un registro |
| DELETE | `/api/produccion/:id` | Eliminar un registro |

Todas las rutas de escritura (`POST`/`PUT`) validan en el servidor: campos obligatorios, tipos de dato, rangos y longitud. Las respuestas de error devuelven `{ "errores": [...] }` con estado HTTP 400.

## Publicar en GitHub

GitHub Pages **no sirve** para esta fase porque el sitio ahora depende de un servidor Node.js y una base de datos — GitHub Pages solo aloja archivos estáticos. Para este entregable basta con subir el código a GitHub:

```bash
git init
git add .
git commit -m "Fase 2: backend Node/Express + PostgreSQL"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/finca-el-progreso.git
git push -u origin main
```

Si más adelante quieres que el sitio esté disponible en Internet con base de datos incluida, necesitas un hosting que corra Node.js (por ejemplo Render, Railway o Fly.io) más una base PostgreSQL administrada; GitHub Pages no lo permite.

## Agregar fotografías

Igual que en la fase 1: coloca tus imágenes en `img/` con el nombre exacto que ya está escrito en cada `<img src="img/...">` de `index.html`. Mientras el archivo no exista, se ve el color de relleno; en cuanto lo agregas, aparece automáticamente.

## Requisitos técnicos cubiertos (fase 2)

- Node.js + Express como backend, sin frameworks de frontend (React/Angular/Vue).
- PostgreSQL con dos tablas relacionadas, llave primaria, llave foránea y datos de prueba.
- Conexión Frontend ↔ Backend ↔ Base de datos mediante fetch a una API REST en JSON.
- Nuevas opciones de menú "Gestión" y "Reportes" en todas las páginas.
- Formulario con validación de campos obligatorios, tipos de dato, longitud y mensajes de éxito/error, tanto en el cliente como en el servidor.
- Reporte en tabla que consulta PostgreSQL en tiempo real (sin datos escritos a mano en el código).
- Todas las secciones y funcionalidades de la fase 1 se mantienen sin cambios.
