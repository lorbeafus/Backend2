# Plataforma de Eventos - Tickets Backend (Pre-Entrega 8)

Este proyecto es una API REST profesional estructurada según una **arquitectura en capas formal y desacoplada** con Express, MongoDB y Mongoose para una plataforma de gestión de eventos, inscripciones y venta de tickets.

---

## 🏛️ Arquitectura Profesional por Capas (DAO, Repository, DTO)

La aplicación sigue el principio de **Separación de Responsabilidades (SoC)** y el principio de **Inversión de Dependencias (DIP)** dividiendo el flujo de ejecución en 7 capas especializadas:

```text
       [ Cliente / Frontend ]
                 │
                 ▼  (HTTP Request)
          ┌─────────────┐
          │   Routes    │  -> Define endpoints, métodos HTTP y middlewares de seguridad
          └──────┬──────┘
                 ▼
          ┌─────────────┐
          │ Controllers │  -> Extrae datos (body/params/query), invoca al Service y devuelve DTOs
          └──────┬──────┘
                 ▼
          ┌─────────────┐
          │  Services   │  -> Contiene toda la Lógica de Negocio (validaciones, cupos, reglas, emails)
          └──────┬──────┘
                 ▼
          ┌─────────────┐
          │Repositories │  -> Abstracción de datos orientada al Dominio de la aplicación
          └──────┬──────┘
                 ▼
          ┌─────────────┐
          │    DAOs     │  -> Acceso directo a la persistencia (Data Access Objects con Mongoose)
          └──────┬──────┘
                 ▼
          ┌─────────────┐
          │   Models    │  -> Esquemas y colecciones de base de datos
          └─────────────┘
                 │
                 ▼  (Mapeo de salida)
          ┌─────────────┐
          │    DTOs     │  -> Formatea y filtra datos sensibles (evita exponer passwords, hashes, etc.)
          └─────────────┘
```

### Responsabilidad de cada Capa

1. **Routes (`src/routes/`):** Define las rutas y asocia los middlewares de autenticación (`authMiddleware`), autorización (`authorizeRoles`, `authorizeEventOwnerOrAdmin`) y los controladores correspondientes. No contiene lógica de negocio.
2. **Controllers (`src/controllers/`):** Capa delgada (*thin controllers*) encargada únicamente del transporte HTTP: recibe la petición, extrae los parámetros/cuerpo, delega la operación al `Service`, mapea el resultado mediante **DTOs** y responde al cliente. **No interactúa con modelos ni con DAOs**.
3. **DTO - Data Transfer Objects (`src/dto/`):** Objetos de transferencia que definen qué información se expone hacia afuera y cuáles se ocultan. Protege contra la fuga accidental de datos sensibles (`password`, hashes internos, metadatos `__v`, etc.) y estandariza los contratos de la API para `User`, `Event` y `Ticket`.
4. **Services (`src/services/`):** El corazón de la aplicación. Concentra **toda la lógica y reglas del negocio** (validaciones temporales de eventos, cálculo de cupos en tiempo real, prevención de inscripciones duplicadas, control de estados, llamadas al servicio de emails con Nodemailer). **Solo interactúa con Repositories**.
5. **Repositories (`src/repositories/`):** Capa intermediaria de acceso a datos que ofrece métodos con semántica de dominio (`findPublishedEvents`, `countActiveTickets`, `cancelTicket`, `findActiveByUserAndEvent`). Aísla los servicios de la tecnología de persistencia utilizada.
6. **DAO - Data Access Objects (`src/dao/`):** Objetos dedicados exclusivamente al acceso técnico a la base de datos. **Son los únicos archivos que importan y consultan los modelos de Mongoose** (`find`, `findById`, `create`, `aggregate`, etc.).
7. **Models (`src/models/`):** Esquemas y modelos de Mongoose (`User`, `Event`, `Category`, `Ticket`) que representan la estructura de las colecciones en MongoDB.

---

## 📁 Estructura del Proyecto

```text
TICKETS/
├── src/
│   ├── config/          # Configuración de variables de entorno, Passport y Nodemailer
│   │   ├── env.js
│   │   ├── passport.config.js
│   │   └── mailer.config.js
│   ├── routes/          # Rutas de Express
│   │   ├── users.routes.js
│   │   ├── sessions.routes.js
│   │   ├── events.routes.js
│   │   └── tickets.routes.js
│   ├── controllers/     # Controladores HTTP
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

## 🔌 Endpoints de la API

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
| **GET** | `/api/events` | Público | Consulta con filtros dinámicos, ordenamiento y paginación (DTOs) |
| **GET** | `/api/events/:id` | Público | Consulta del detalle de un evento por ID (DTO) |
| **POST** | `/api/events` | 🔒 `organizer`, `admin` | Crear evento (el organizador se toma de `req.user._id`) |
| **PUT** | `/api/events/:id` | 🔒 Dueño o `admin` | Modificar un evento existente |
| **PATCH** | `/api/events/:id/status` | 🔒 Dueño o `admin` | Cambiar estado del evento (`draft`, `published`, `cancelled`, `finished`) |
| **POST** | `/api/events/:eid/tickets` | 🔒 Autenticado | Inscribirse a un evento (valida cupo, estado `published`, sin duplicados, envía email) |
| **GET** | `/api/events/:eid/tickets` | 🔒 Organizador dueño o `admin` | Ver los inscriptos de un evento |

### 3. Tickets (`/api/tickets`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tickets/my-tickets` | 🔒 Autenticado | Consultar tickets propios del usuario con `populate` (formateado con DTO) |
| **PATCH** | `/api/tickets/:tid/cancel` | 🔒 Dueño del ticket o `admin` | Cancelar inscripción (libera cupo, registra `cancelledAt`, envía email) |

### 4. Usuarios (`/api/users`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/users` | 🔒 `admin` | Listado administrativo de usuarios (formateado con `UserDTO`) |

---

## 🛡️ Manejo Centralizado de Errores

La API utiliza un middleware centralizado de errores ([`error.middleware.js`](file:///c:/Users/lorbe/Desktop/BACKEND%20II/TICKETS/src/middlewares/error.middleware.js)) que estandariza las respuestas ante cualquier fallo:

* **400 Bad Request:** Datos inválidos, parámetros faltantes, eventos no publicados, sobrecupo o reglas temporales violadas.
* **401 Unauthorized:** Solicitud sin token de sesión, cookie ausente o token JWT expirado/inválido.
* **403 Forbidden:** Usuario autenticado pero sin los permisos de rol u ownership necesarios.
* **404 Not Found:** Recurso inexistente (evento o ticket no encontrado).
* **409 Conflict:** Conflicto de estado (usuario ya registrado con ese email o inscripción duplicada activa).
* **500 Internal Server Error:** Fallos imprevistos del servidor.

Formato estándar de error:
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Descripción clara del error de negocio"
}
```

---

## 🧪 Casos de Prueba (Criterios de Aceptación Pre-Entrega 8)

1. **Flujo completo:** Registro ➔ Login ➔ Crear Evento ➔ Inscribirse ➔ Consultar mis tickets ➔ Cancelar ticket (verificado de punta a punta).
2. **Respuesta de `/current` sin `password`:** La respuesta procesada por `CurrentUserDTO` garantiza que ningún campo sensible sea expuesto.
3. **Respuesta de ticket con `populate` sin `password`:** Los datos asociados del usuario y del evento se filtran a través de `UserDTO` y `EventResponseDTO`.
4. **Respuestas de error con código HTTP correcto:** Los errores de validación de negocio devuelven códigos HTTP adecuados (`400`, `404`, `409`) y nunca `500`.
5. **Protección de rutas:** Acceso sin sesión retorna `401 Unauthorized`; acceso con sesión pero sin permisos de rol u ownership retorna `403 Forbidden`.
