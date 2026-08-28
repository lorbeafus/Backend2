# Plataforma de Eventos - API Backend (Entrega Final / Capstone)

Bienvenido a la documentación del **Proyecto Final Integrador (Capstone)** de la carrera **Backend II: Diseño y Arquitectura Backend**.

Esta API REST profesional consolida todas las competencias desarrolladas a lo largo de los 9 módulos del curso: arquitectura profesional por capas (**DAO**, **Repository**, **DTO**), autenticación stateless con **Passport.js** y **JWT** en cookies `httpOnly`, control de acceso basado en roles (**RBAC**) y propiedad de recursos (*ownership*), gestión integral de **Eventos**, flujo robusto de **Tickets e Inscripciones** con control de cupos y prevención de sobreventa (*race conditions*), y notificaciones automáticas por correo electrónico con **Nodemailer**.

---

## 🏛️ Arquitectura Profesional por Capas

El proyecto aplica los principios **SOLID** (especialmente Responsabilidad Única e Inversión de Dependencias) aislando la lógica de negocio de la tecnología de persistencia:

```text
       ┌────────────────────────┐
       │   Cliente / Postman    │
       └───────────┬────────────┘
                   │  HTTP Request
                   ▼
       ┌────────────────────────┐
       │     Routes Layer       │  -> Middlewares de Auth, Roles y Ownership
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │   Controllers Layer    │  -> Extrae datos, invoca al Service, responde con DTOs
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │     Services Layer     │  -> Lógica de Negocio Pura (Cupos, Estados, Fechas, Mailer)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │   Repositories Layer   │  -> Métodos orientados al Dominio (findByEmail, countActiveTickets)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │       DAOs Layer       │  -> Acceso directo a Mongoose (únicos que importan modelos)
       └───────────┬────────────┘
                   ▼
       ┌────────────────────────┐
       │      Models Layer      │  -> Esquemas de MongoDB (User, Event, Category, Ticket)
       └────────────────────────┘
                   │
                   ▼  (Sanitización y Mapeo)
       ┌────────────────────────┐
       │       DTOs Layer       │  -> Filtra campos sensibles (nunca expone contraseñas ni hashes)
       └────────────────────────┘
```

---

## 📁 Estructura del Código

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
│   ├── dto/             # Data Transfer Objects (UserDTO, EventResponseDTO, TicketResponseDTO)
│   │   ├── user.dto.js
│   │   ├── event.dto.js
│   │   ├── ticket.dto.js
│   │   └── index.js
│   ├── services/        # Lógica de negocio (Services)
│   │   ├── users.services.js
│   │   ├── sessions.services.js
│   │   ├── events.services.js
│   │   └── tickets.services.js
│   ├── repositories/    # Repositorios del dominio
│   │   ├── users.repository.js
│   │   ├── events.repository.js
│   │   └── tickets.repository.js
│   ├── dao/             # Data Access Objects (Mongoose DAOs)
│   │   ├── users.dao.js
│   │   ├── events.dao.js
│   │   └── tickets.dao.js
│   ├── models/          # Esquemas Mongoose
│   │   ├── user.model.js
│   │   ├── event.model.js
│   │   ├── category.model.js
│   │   └── ticket.model.js
│   ├── middlewares/     # Middlewares de autenticación, autorización y errores
│   │   ├── auth.middleware.js
│   │   ├── passport.middleware.js
│   │   └── error.middleware.js
│   ├── utils/           # Utilidades auxiliares (hash.js, jwt.js)
│   ├── app.js           # Inicialización de Express y middlewares globales
│   └── server.js        # Arranque del servidor HTTP y conexión a base de datos
├── database.js          # Conexión a MongoDB
├── postman_collection.json # Colección oficial de Postman para pruebas
├── .env.example         # Plantilla de variables de entorno
├── package.json         # Dependencias y scripts
└── README.md            # Documentación completa de la API
```

---

## 🛠️ Instalación y Puesta en Marcha

### 1. Clonar el Repositorio e Instalar Dependencias
```bash
git clone https://github.com/lorbeafus/Backend2.git
cd TICKETS
npm install
```

### 2. Configuración del Archivo `.env`
Crea un archivo `.env` en el directorio raíz basándote en `.env.example`:
```env
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/tickets
JWT_SECRET=tu_super_clave_secreta_jwt_2026
JWT_EXPIRES_IN=1h
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=tu_usuario_email
MAIL_PASS=tu_password_email
MAIL_FROM="Plataforma de Eventos" <no-reply@eventos.com>
```

### 3. Ejecución del Servidor
```bash
# Modo Desarrollo (con recarga automática de Node)
npm run dev

# Modo Producción
npm start
```

El servidor quedará disponible en `http://localhost:3000` con el endpoint de comprobación en `GET http://localhost:3000/api/health`.

---

## 👥 Creación y Roles de Usuarios de Prueba

La plataforma maneja tres roles principales:
* **`user` (por defecto):** Asistente/estudiante. Puede consultar eventos, inscribirse a eventos publicados con cupo y gestionar sus propios tickets.
* **`organizer`:** Productor/docente. Puede crear nuevos eventos, editar sus propios eventos, cambiar su estado y consultar los inscriptos de sus eventos.
* **`admin`:** Administrador general. Permiso total sobre el sistema (gestionar todos los eventos, usuarios, categorías y cancelaciones globales).

### Cómo Crear Usuarios de Prueba:
1. **Usuario Común (`user`):**
   * Realizar `POST /api/sessions/register` con el body:
     ```json
     {
       "first_name": "Lucas",
       "last_name": "Gómez",
       "email": "lucas@test.com",
       "password": "password123"
     }
     ```
2. **Usuario Organizador (`organizer`) / Administrador (`admin`):**
   * Por razones de seguridad, el registro público asigna el rol `user` por defecto. Para asignar el rol `organizer` o `admin` a un usuario de prueba en desarrollo, puedes actualizar su campo `role` directamente en MongoDB o mediante una consulta inicial:
     ```javascript
     db.users.updateOne({ email: "organizer@test.com" }, { $set: { role: "organizer" } });
     db.users.updateOne({ email: "admin@test.com" }, { $set: { role: "admin" } });
     ```

---

## 🔌 Catálogo Completo de Endpoints

### 1. Sesiones y Autenticación (`/api/sessions`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/sessions/register` | Público | Registro de usuario (hashea contraseña con bcrypt, respuesta sanitizada con `UserDTO`) |
| **POST** | `/api/sessions/login` | Público | Autenticación de usuario (setea cookie `currentUser` con JWT firmado `httpOnly`) |
| **GET** | `/api/sessions/current` | 🔒 Autenticado | Obtiene datos del usuario activo (retorna `CurrentUserDTO` sin password) |
| **POST** | `/api/sessions/logout` | Público | Cierre de sesión (elimina la cookie `currentUser`) |

### 2. Eventos (`/api/events`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/events` | Público | Consulta de eventos con filtros (`status`, `category`, `location`, `fromDate`, `toDate`, `minPrice`, `maxPrice`, `search`), paginación (`page`, `limit`) y ordenamiento (`sort`) |
| **GET** | `/api/events/:id` | Público | Detalle de evento por ID (formateado con `EventResponseDTO`) |
| **POST** | `/api/events` | 🔒 `organizer`, `admin` | Crear evento (el organizador se asigna automáticamente de `req.user._id`) |
| **PUT** | `/api/events/:id` | 🔒 Dueño o `admin` | Modificar un evento existente propio |
| **PATCH** | `/api/events/:id/status` | 🔒 Dueño o `admin` | Cambiar estado del evento (`draft`, `published`, `cancelled`, `finished`) |
| **POST** | `/api/events/:eid/tickets` | 🔒 Autenticado | Inscribirse a un evento (valida cupo, estado `published`, sin duplicados, envía email) |
| **GET** | `/api/events/:eid/tickets` | 🔒 Organizador dueño o `admin` | Ver los inscriptos de un evento |

### 3. Tickets e Inscripciones (`/api/tickets`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tickets/my-tickets` | 🔒 Autenticado | Consultar tickets propios con `populate` del evento (formateado con `TicketResponseDTO`) |
| **PATCH** | `/api/tickets/:tid/cancel` | 🔒 Dueño del ticket o `admin` | Cancelar inscripción (libera cupo, registra `cancelledAt`, envía email) |

### 4. Usuarios (`/api/users`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/users` | 🔒 `admin` | Listado administrativo de usuarios (formateado con `UserDTO`) |

---

## 📋 Reglas de Negocio Clave

1. **Gestión de Cupos en Tiempo Real:**  
   $$\text{Cupos Disponibles} = \text{Capacidad Total} - \sum \text{quantity de tickets activos (no cancelados)}$$
   Si $\text{quantity} > \text{Cupos Disponibles}$, la inscripción se rechaza con código `400 Bad Request`.
2. **Control de Duplicados:** Un usuario no puede tener más de una inscripción activa para el mismo evento (`409 Conflict`).
3. **Cancelación Lógica (*Soft Delete*):** Al cancelar una reserva, se marca `status: 'cancelled'`, se registra `cancelledAt: new Date()` y el cupo se libera de forma inmediata para otros usuarios.
4. **Protección de Datos (DTOs):** Ninguna respuesta pública expone contraseñas, hashes, ni campos internos.

---

## 🧪 10 Casos de Prueba Verificados (Criterios de Aceptación)

1. **Flujo de Sesión:** `Registro` ➔ `Login` ➔ `GET /api/sessions/current` (devuelve usuario sin password) ➔ `Logout` ➔ `GET /api/sessions/current` devuelve **401 Unauthorized**.
2. **Creación denegada a usuario común:** `user` intenta crear evento en `POST /api/events` ➔ **403 Forbidden**.
3. **Inscripción exitosa:** `organizer` crea evento publicado ➔ `user` se inscribe en `POST /api/events/:eid/tickets` ➔ **201 Created**, email de confirmación despachado y cupo disponible descontado.
4. **Prevención de duplicados:** `user` intenta inscribirse por segunda vez al mismo evento ➔ **409 Conflict** ("Ya tenés una inscripción activa para este evento").
5. **Control de cupo agotado:** `user` intenta inscribirse a un evento sin cupos ➔ **400 Bad Request** ("No hay cupos suficientes disponibles").
6. **Cancelación y liberación de cupo:** `user` cancela su inscripción vía `PATCH /api/tickets/:tid/cancel` ➔ **200 OK** (`status: 'cancelled'`), liberando el cupo para que otro usuario pueda inscribirse exitosamente.
7. **Modificación denegada a organizador ajeno:** `organizer` intenta modificar un evento creado por otro organizador ➔ **403 Forbidden**.
8. **Modificación permitida a Administrador:** `admin` modifica cualquier evento ajeno ➔ **200 OK**.
9. **Seguridad y DTOs:** Verificado que todas las respuestas (`/current`, `/events`, `/tickets`) no incluyen campos de `password`.
10. **Paginación y Filtros:** `GET /api/events?status=published&page=1&limit=5&sort=date` devuelve el payload paginado con `data`, `page`, `limit`, `total`, `totalPages`.

---

## 📬 Colección de Postman

El proyecto incluye el archivo [`postman_collection.json`](file:///c:/Users/lorbe/Desktop/BACKEND%20II/TICKETS/postman_collection.json) listo para ser importado en Postman o Insomnia con todos los requests, carpetas, variables de entorno y ejemplos de uso configurados.
