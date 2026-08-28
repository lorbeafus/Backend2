# Plataforma de Eventos - Tickets Backend (Pre-Entrega 7)

Este proyecto es una API REST profesional estructurada por capas con Express y Mongoose para una plataforma de gestión de eventos, inscripción y venta de entradas (tickets). La arquitectura está diseñada en capas desacopladas (`Routes` ➔ `Controllers` ➔ `Services` ➔ `Repositories` ➔ `DAO` ➔ `Models`) para aislar la persistencia de la lógica de negocio, asegurando máxima mantenibilidad, escalabilidad e integridad de datos.

---

## 🚀 Temática Elegida
**Plataforma de Eventos, Cursos y Venta de Tickets:** Permite a los usuarios consultar eventos, registrarse e iniciar sesión de forma segura (con JWT en cookies `httpOnly`), publicar y administrar eventos según rol y propiedad, inscribirse a eventos con validación de cupos en tiempo real, consultar sus entradas y cancelarlas cuando lo requieran, con notificaciones automáticas por correo electrónico vía **Nodemailer**.

---

## 🛠️ Tecnologías Utilizadas

* **Node.js** (v24+)
* **Express** (Framework HTTP y servidor web)
* **MongoDB & Mongoose** (Base de datos NoSQL y ODM)
* **Passport.js** (Estrategias de autenticación centralizada: `register`, `login`, `current`)
* **Bcrypt** (Hashing seguro de contraseñas)
* **JSON Web Token (JWT)** (Manejo de sesiones stateless mediante cookies HTTP Only)
* **Nodemailer** (Servicio de notificaciones por correo electrónico)
* **Dotenv** (Variables de entorno)
* **ES Modules (ESM)** (Sintaxis nativa `import` / `export`)

---

## 📁 Estructura de Carpetas por Capas

```text
TICKETS/
├── src/
│   ├── config/          # Configuración de variables de entorno, Passport y Nodemailer
│   │   ├── env.js
│   │   ├── passport.config.js
│   │   └── mailer.config.js
│   ├── routes/          # Rutas de Express (users, sessions, events, tickets)
│   │   ├── users.routes.js
│   │   ├── sessions.routes.js
│   │   ├── events.routes.js
│   │   └── tickets.routes.js
│   ├── controllers/     # Controladores HTTP (coordinación de request/response)
│   │   ├── users.controllers.js
│   │   ├── sessions.controllers.js
│   │   ├── events.controllers.js
│   │   └── tickets.controllers.js
│   ├── services/        # Lógica de negocio pura (validaciones temporales, cupos, duplicados, cancelaciones)
│   │   ├── users.services.js
│   │   ├── sessions.services.js
│   │   ├── events.services.js
│   │   └── tickets.services.js
│   ├── repositories/    # Capa de abstracción de datos para el dominio
│   │   ├── users.repository.js
│   │   ├── events.repository.js
│   │   └── tickets.repository.js
│   ├── dao/             # Acceso directo a base de datos (Data Access Objects con Mongoose)
│   │   ├── users.dao.js
│   │   ├── events.dao.js
│   │   └── tickets.dao.js
│   ├── models/          # Esquemas Mongoose (User, Event, Category, Ticket)
│   │   ├── user.model.js
│   │   ├── event.model.js
│   │   ├── category.model.js
│   │   └── ticket.model.js
│   ├── middlewares/     # Middlewares de autenticación, roles y ownership
│   │   ├── auth.middleware.js
│   │   └── passport.middleware.js
│   ├── utils/           # Utilidades auxiliares (hash.js, jwt.js)
│   ├── app.js           # Configuración principal de la aplicación Express
│   └── server.js        # Inicialización del servidor (puerto y base de datos)
├── database.js          # Conexión a MongoDB
├── .env.example         # Plantilla de variables de entorno requeridas
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
Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
```env
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/tickets
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=1h
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=tu_usuario_email
MAIL_PASS=tu_contraseña_email
MAIL_FROM="Plataforma de Eventos" <no-reply@eventos.com>
```

### 3. Ejecutar el Servidor
```bash
# Modo Desarrollo (con recarga automática)
npm run dev

# Modo Producción
npm start
```

---

## 🎟️ Modelo `Ticket` y Estados

El modelo `Ticket` relaciona de manera prolija y normalizada a un **Usuario** con un **Evento**:

* `user`: Referencia (`ObjectId`) al modelo `User`.
* `event`: Referencia (`ObjectId`) al modelo `Event`.
* `status`: Estado del ticket. Solo acepta los valores:
  * `confirmed`: Inscripción confirmada y activa (ocupa cupo).
  * `pending`: Inscripción pendiente de procesamiento o pago (ocupa cupo).
  * `cancelled`: Inscripción cancelada / anulada (libera el cupo inmediatamente).
* `quantity`: Cantidad de lugares reservados (`min: 1`, default: `1`).
* `reservationCode`: Código único de reserva (ej: `TCK-A1B2-C3D4`).
* `createdAt` / `updatedAt`: Marcas temporales automáticas.
* `cancelledAt`: Fecha en que fue cancelado (default: `null`).

---

## 🔌 Endpoints de la API

### 1. Tickets e Inscripciones

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/events/:eid/tickets` | 🔒 Autenticado | Inscribirse a un evento (valida cupo, estado `published`, sin duplicados, envía email) |
| **GET** | `/api/tickets/my-tickets` | 🔒 Autenticado | Consultar tickets propios del usuario (con `populate` de datos del evento) |
| **GET** | `/api/events/:eid/tickets` | 🔒 Organizador dueño o `admin` | Ver los inscriptos de un evento específico |
| **PATCH** | `/api/tickets/:tid/cancel` | 🔒 Dueño del ticket o `admin` | Cancelar un ticket activo (libera el cupo, registra `cancelledAt`, envía email) |

### 2. Eventos (`/api/events`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/events` | Público | Consulta de eventos con filtros dinámicos, ordenamiento y paginación |
| **GET** | `/api/events/:id` | Público | Consulta del detalle de un evento por ID |
| **POST** | `/api/events` | 🔒 `organizer`, `admin` | Crear evento (el organizador se asigna automáticamente de `req.user._id`) |
| **PUT** | `/api/events/:id` | 🔒 Dueño o `admin` | Modificar un evento existente |
| **PATCH** | `/api/events/:id/status` | 🔒 Dueño o `admin` | Cambiar el estado del evento (`draft`, `published`, `cancelled`, `finished`) |

### 3. Sesiones (`/api/sessions`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/sessions/register` | Público | Registro de usuario (asigna rol `user` por defecto) |
| **POST** | `/api/sessions/login` | Público | Autenticación de usuario (genera token JWT en cookie `currentUser` HTTP Only) |
| **GET** | `/api/sessions/current` | 🔒 Autenticado | Obtiene los datos del usuario logueado mediante token JWT |
| **POST** | `/api/sessions/logout` | Público | Cierre de sesión (borra cookie HTTP Only) |

### 4. Usuarios (`/api/users`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/users` | 🔒 `admin` | Listado administrativo de usuarios |

---

## 📋 Reglas de Negocio y Control de Cupos (Capa Services)

1. **Validación de Inscripción:**
   - El evento debe existir en la base de datos (de lo contrario retorna `404 Not Found`).
   - El evento debe estar en estado `published` (si está en `draft`, `cancelled` o `finished` retorna `400 Bad Request`).
   - El evento no debe haber finalizado (`event.date > now`).
   - `quantity` debe ser un número entero mayor a 0.
   - **Control de duplicados:** Un usuario no puede tener más de una inscripción activa para el mismo evento (si ya existe un ticket no cancelado, retorna `409 Conflict`).
   - **Cálculo de cupos disponibles:**
     $$\text{Cupos Disponibles} = \text{Capacidad Total} - \sum \text{quantity de tickets activos (no cancelados)}$$
     Si $\text{quantity} > \text{Cupos Disponibles}$, se rechaza la solicitud con error `400 Bad Request` indicando los cupos restantes.
2. **Generación de Código Único:** Se genera un `reservationCode` alfanumérico único para identificar la reserva.
3. **Notificación por Email (Nodemailer):** Tras crear el ticket, se envía un correo de confirmación de forma asíncrona con los detalles del evento y el código de reserva.
4. **Cancelación Lógica (Soft Delete):**
   - No se elimina físicamente el ticket; se actualiza `status: 'cancelled'` y se registra `cancelledAt: new Date()`.
   - Solo el usuario que realizó la reserva o un `admin` pueden cancelar el ticket (de lo contrario retorna `403 Forbidden`).
   - No se puede cancelar un ticket que ya está cancelado ni uno de un evento que ya finalizó.
   - Al cancelar, el cupo queda disponible automáticamente para nuevas inscripciones.

---

## 🔐 Matriz de Permisos por Rol

| Acción | Visitante | `user` | `organizer` (dueño) | `organizer` (otro) | `admin` |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Consultar eventos publicados (`GET /api/events`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Inscribirse a evento (`POST /api/events/:eid/tickets`) | ❌ (401) | ✅ | ✅ | ✅ | ✅ |
| Consultar mis tickets (`GET /api/tickets/my-tickets`) | ❌ (401) | ✅ (propios) | ✅ (propios) | ✅ (propios) | ✅ (propios) |
| Ver inscriptos de un evento (`GET /api/events/:eid/tickets`) | ❌ (401) | ❌ (403) | ✅ | ❌ (403) | ✅ |
| Cancelar ticket propio (`PATCH /api/tickets/:tid/cancel`) | ❌ (401) | ✅ | ✅ | ✅ | ✅ |
| Cancelar ticket ajeno (`PATCH /api/tickets/:tid/cancel`) | ❌ (401) | ❌ (403) | ❌ (403) | ❌ (403) | ✅ |
| Crear eventos (`POST /api/events`) | ❌ (401) | ❌ (403) | ✅ | ✅ | ✅ |
| Modificar evento propio (`PUT /api/events/:id`) | ❌ (401) | ❌ (403) | ✅ | ❌ (403) | ✅ |

---

## 🧪 Casos a Probar (Criterios de Aceptación)

1. **Inscripción exitosa:** Usuario autenticado hace `POST /api/events/:eid/tickets` con `quantity: 1` ➔ **201 Created**, ticket con estado `confirmed`, `reservationCode` y cupo descontado (email de confirmación despachado).
2. **Inscripción sin sesión:** Petición sin cookie de sesión ➔ **401 Unauthorized** ("No autenticado").
3. **Inscripción a evento inexistente:** `POST /api/events/65f1a2b3c4d5e6f7a8b9c0d1/tickets` ➔ **404 Not Found** ("Evento no encontrado").
4. **Inscripción a evento cancelado/finalizado:** Evento con `status: 'cancelled'` o fecha pasada ➔ **400 Bad Request**.
5. **Inscripción cuando no hay cupo suficiente:** Evento con capacidad llena ➔ **400 Bad Request** ("No hay cupos suficientes disponibles").
6. **Inscripción duplicada activa:** Mismo usuario intenta inscribirse dos veces al mismo evento ➔ **409 Conflict** ("Ya tenés una inscripción activa para este evento").
7. **Cancelación propia:** Usuario cancela su ticket con `PATCH /api/tickets/:tid/cancel` ➔ **200 OK**, `status: 'cancelled'`, `cancelledAt` registrado, y el cupo queda liberado para una nueva inscripción.
8. **Cancelación de ticket ajeno como `user`:** Usuario intenta cancelar el ticket de otra persona ➔ **403 Forbidden** ("No tenés permisos para cancelar este ticket").
9. **GET `/api/events/:eid/tickets` como `user` común:** Usuario sin rol de organizador del evento ni admin ➔ **403 Forbidden** ("No tenés permisos para ver los inscriptos de este evento").
10. **GET `/api/events/:eid/tickets` como `organizer` de otro evento:** Organizador que no es el creador de `:eid` ➔ **403 Forbidden**.
