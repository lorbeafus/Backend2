# Plataforma de Eventos - Tickets Backend (Pre-Entrega 6)

Este proyecto es una API REST estructurada por capas con Express y Mongoose para una plataforma de gestión de eventos y venta de tickets. La arquitectura está diseñada en capas (Routes -> Controllers -> Services -> Repositories -> DAO -> Models) para aislar la persistencia de la lógica de negocio y permitir la máxima mantenibilidad y escalabilidad.

---

## 🚀 Temática Elegida
**Gestión de Eventos / Cursos Online y Venta de Entradas (Tickets):** Permite a los usuarios consultar eventos y cursos disponibles, registrarse (crear cuenta con roles), autenticarse con JWT en cookies HTTP Only y gestionar la publicación y modificación de eventos según rol y propiedad.

---

## 🛠️ Tecnologías Utilizadas

* **Node.js** (v24+)
* **Express** (Framework HTTP y servidor web)
* **MongoDB & Mongoose** (Base de datos NoSQL y ORM/ODM)
* **Passport.js** (Estrategias de autenticación centralizada: `register`, `login`, `current`)
* **Bcrypt** (Hashing seguro de contraseñas)
* **JSON Web Token (JWT)** (Manejo de sesiones stateless mediante cookies HTTP Only)
* **Dotenv** (Variables de entorno)
* **ES Modules (ESM)** (Sintaxis nativa `import` / `export`)

---

## 📁 Estructura de Carpetas por Capas

```text
TICKETS/
├── src/
│   ├── config/          # Configuración de variables de entorno y Passport (passport.config.js)
│   ├── routes/          # Rutas de Express (users, sessions, events, tickets)
│   ├── controllers/     # Controladores HTTP (request/response únicamente)
│   ├── services/        # Lógica de negocio pura (validaciones temporales, reglas de estado, filtros)
│   ├── repositories/    # Capa de abstracción de datos para el dominio
│   ├── dao/             # Acceso directo a base de datos (Data Access Objects)
│   ├── models/          # Esquemas Mongoose (User, Event, Category, Ticket)
│   ├── middlewares/     # Middlewares de autenticación, roles y ownership
│   ├── utils/           # Utilidades auxiliares (hash.js, jwt.js)
│   ├── app.js           # Configuración principal de la app Express
│   └── server.js        # Inicialización del servidor (puerto y base de datos)
├── database.js          # Conexión a MongoDB
├── .env.example         # Plantilla de variables de entorno
├── package.json         # Dependencias y scripts
└── README.md            # Documentación completa de la API
```

---

## 🛠️ Instalación y Configuración

### 1. Clonar e Instalar Dependencias
```bash
git clone https://github.com/lorbeafus/Backend2.git
cd TICKETS
npm install
```

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz basándote en `.env.example`:
```env
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/tickets
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=1h
```

### 3. Ejecutar el Servidor
```bash
# Modo Desarrollo
npm run dev

# Modo Producción
npm start
```

---

## 🔌 Endpoints de la API

### Eventos (`/api/events`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/events` | Público | Consulta de eventos con filtros dinámicos, ordenamiento y paginación |
| **GET** | `/api/events/:id` | Público | Consulta del detalle de un evento por ID |
| **POST** | `/api/events` | 🔒 `organizer`, `admin` | Crear evento (el organizador se asigna automáticamente de `req.user._id`) |
| **PUT** | `/api/events/:id` | 🔒 Dueño o `admin` | Modificar un evento propio existente (asociado a reglas de negocio) |
| **PATCH** | `/api/events/:id/status` | 🔒 Dueño o `admin` | Cambiar el estado del evento (ej: cancelar evento -> `status: 'cancelled'`) |

#### Filtros Disponibles en `GET /api/events` (vía Query Params)

- `status`: Estado del evento (`draft`, `published`, `cancelled`, `finished`).
- `category`: ObjectId o referencia de categoría.
- `location`: Ubicación o modalidad (ej. `Online`), búsqueda por coincidencia parcial case-insensitive (`$regex`).
- `level`: Nivel del curso (`beginner`, `intermediate`, `advanced`).
- `dateFrom` / `fromDate`: Fecha inicio para filtrar eventos (`$gte`).
- `dateTo` / `toDate`: Fecha fin para filtrar eventos (`$lte`).
- `minPrice` / `maxPrice`: Rango de precios (`$gte` / `$lte`).
- `search`: Búsqueda por texto en `title` o `description` (`$or` y `$regex`).
- `page`: Número de página (default: `1`).
- `limit`: Cantidad por página (default: `10`, máximo: `50`).
- `sort`: Campo por el cual ordenar (default: `'date'`, soporta `-date`, `price`, etc.).

#### Ejemplo de Petición Filtrada:
```http
GET /api/events?status=published&category=65f1a2b3c4d5e6f7a8b9c0d1&page=1&limit=5&sort=date
```

#### Estructura de Respuesta Paginada:
```json
{
  "status": "success",
  "data": [ ...listado_de_eventos... ],
  "page": 1,
  "limit": 5,
  "total": 12,
  "totalPages": 3,
  "payload": [ ...listado_de_eventos... ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 5,
    "totalPages": 3
  }
}
```

---

### Sesiones (`/api/sessions`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/sessions/register` | Público | Registro de usuario (asigna rol `user` por defecto) |
| **POST** | `/api/sessions/login` | Público | Autenticación de usuario (genera token JWT en cookie `currentUser` HTTP Only) |
| **GET** | `/api/sessions/current` | 🔒 Autenticado | Obtiene los datos del usuario logueado mediante token JWT |
| **POST** | `/api/sessions/logout` | Público | Cierre de sesión (borra cookie HTTP Only) |

### Usuarios (`/api/users`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/users` | 🔒 `admin` | Listado administrativo de usuarios |

---

## 📋 Reglas de Negocio (Capa Services)

1. **Fecha Futura**: No se permite crear eventos con fecha pasada (`date <= now`).
2. **Capacidad y Precio Validado**: `capacity` debe ser mayor a 0 (`> 0`) y `price` mayor o igual a 0 (`>= 0`).
3. **Asignación Automática de Organizador**: En la creación (`POST`), el campo `organizer` se obtiene directamente de `req.user._id` (ignora cualquier valor enviado en el body).
4. **Protección de Eventos Ocurridos**: No se permite modificar un evento cuya fecha ya pasó.
5. **Protección de Eventos Cancelados/Finalizados**:
   - Eventos en estado `cancelled` o `finished` no pueden modificarse.
   - No se permite cancelar un evento que ya finalizó.
6. **Cancelación Lógica (No Eliminación Física)**: La cancelación de un evento consiste en cambiar su `status` a `'cancelled'`, preservando el historial en la base de datos sin borrado físico.
7. **Control de Modificación (Ownership)**: Un organizador solo puede editar o cambiar el estado de sus propios eventos (`organizer._id === req.user._id`). Solo el rol `admin` puede modificar eventos de otros organizadores.

---

## 🔐 Matriz de Permisos por Rol

| Acción | `user` | `organizer` | `admin` |
| :--- | :---: | :---: | :---: |
| Consultar eventos publicados (`GET`) | ✅ | ✅ | ✅ |
| Consultar detalle de evento (`GET /:id`) | ✅ | ✅ | ✅ |
| Crear eventos (`POST /`) | ❌ | ✅ | ✅ |
| Modificar eventos propios (`PUT /:id`) | ❌ | ✅ | ✅ |
| Modificar eventos ajenos | ❌ | ❌ | ✅ |
| Cambiar estado de evento propio (`PATCH /:id/status`) | ❌ | ✅ | ✅ |
| Ver todos los usuarios (`GET /api/users`) | ❌ | ❌ | ✅ |

---

## 🧪 Casos a Probar

1. **Crear evento con rol `user`** → Responde **403 Forbidden**.
2. **Crear evento con fecha pasada** → Responde **400 Bad Request** ("La fecha del evento debe ser futura").
3. **Crear evento con `capacity: 0`** → Responde **400 Bad Request** ("La capacidad debe ser mayor a cero").
4. **Organizador modifica evento propio (`PUT /api/events/:id`)** → **200 OK** (Evento modificado correctamente).
5. **Organizador modifica evento ajeno** → Responde **403 Forbidden** ("No tenés permisos para modificar este evento").
6. **Admin modifica evento de otro organizador** → **200 OK**.
7. **Cambiar estado de evento cancelado/finalizado** → Responde **400 Bad Request**.
8. **Listar con filtros y paginación (`GET /api/events?status=published&category=workshop&page=2&limit=5`)** → **200 OK** con estructura paginada.
9. **Consultar evento inexistente (`GET /api/events/65f1a2b3c4d5e6f7a8b9c0d1`)** → Responde **404 Not Found**.
