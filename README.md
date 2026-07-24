# Plataforma de Eventos - Tickets Backend

Este proyecto es una API REST estructurada por capas con Express y Mongoose para una plataforma de gestión de eventos y venta de tickets. El diseño de la arquitectura inicial está preparado para ser escalable e integrar servicios en entregas posteriores.

## 🚀 Temática elegida
**Gestión de Eventos y Venta de Entradas (Tickets):** Permite a los usuarios visualizar eventos disponibles, registrarse (crear sesiones/cuenta) y adquirir tickets.

## 🛠️ Tecnologías utilizadas

* **Node.js** (v24+)
* **Express** (Framework de servidor web)
* **MongoDB & Mongoose** (Base de datos NoSQL y modelado de datos)
* **Passport.js** (Estrategias de autenticación centralizada)
* **Bcrypt** (Hashing seguro de contraseñas)
* **JSON Web Token (JWT)** (Tokens de sesión seguros)
* **Dotenv** (Configuración a través de variables de entorno)
* **ES Modules (ESM)** (Uso de `import` / `export`)

## 📁 Estructura de carpetas por capas

El proyecto sigue una organización limpia por capas:

```text
TICKETS/
├── src/
│   ├── config/          # Configuración del entorno (env.js) y Passport (passport.config.js)
│   ├── routes/          # Enrutadores de Express (users, sessions, events, tickets)
│   ├── controllers/     # Controladores encargados de la lógica de presentación/HTTP
│   ├── services/        # Capa de lógica de negocio (sessions, users, events, tickets)
│   ├── repositories/    # Capa de repositorios para abstracción de datos
│   ├── dao/             # Acceso directo a base de datos (Data Access Objects)
│   ├── models/          # Modelos de Mongoose (User, Event, Ticket)
│   ├── middlewares/     # Middlewares de Express (auth.middleware.js, passport.middleware.js)
│   ├── utils/           # Utilidades y funciones auxiliares (hash.js, jwt.js)
│   ├── app.js           # Configuración base de Express (middlewares y enrutamiento)
│   └── server.js        # Punto de arranque del servidor (app.listen y connectDB)
├── database.js          # Función de conexión a la base de datos MongoDB
├── .env                 # Variables de entorno locales (ignoradas por Git)
├── .env.example         # Plantilla base para variables de entorno
├── .gitignore           # Archivo para excluir node_modules y .env de Git
├── package.json         # Configuración del proyecto y dependencias
└── README.md            # Documentación del proyecto
```

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/lorbeafus/Backend2.git
cd TICKETS
```

### 2. Instalar las dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
```env
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/tickets
JWT_SECRET=tu_secreto_para_jwt
JWT_EXPIRES_IN=1h
```

## ⚡ Ejecución del Servidor

* **Modo Producción:**
  ```bash
  npm run start
  ```

* **Modo Desarrollo (con auto-recarga al guardar archivos):**
  ```bash
  npm run dev
  ```

## 🔌 Rutas Disponibles (Endpoints)

### Sesiones
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/sessions/register` | Público | Registro de usuario (Passport strategy `register`) |
| **POST** | `/api/sessions/login` | Público | Login (Passport strategy `login`, genera JWT en cookie HTTP Only) |
| **GET** | `/api/sessions/current` | 🔒 Autenticado | Perfil del usuario autenticado (Passport strategy `current`) |
| **POST** | `/api/sessions/logout` | Público | Cerrar sesión (elimina la cookie del token) |

### Eventos
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/events` | Público | Listar todos los eventos |
| **POST** | `/api/events` | 🔒 `organizer` / `admin` | Crear un evento (asigna automáticamente el organizador) |
| **PUT** | `/api/events/:id` | 🔒 Dueño del evento / `admin` | Modificar un evento existente |

### Usuarios
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/users` | 🔒 `admin` | Listado de todos los usuarios (ruta administrativa) |

### Tickets
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tickets` | Público | Listado general de tickets |

### Otros
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Público | Comprobación de estado del servidor |

## 🔐 Roles y Autorización

El sistema implementa tres roles con permisos diferenciados. El rol se asigna automáticamente como `user` al registrarse; no es posible elegir `organizer` ni `admin` desde el body de registro.

| Acción | `user` | `organizer` | `admin` |
| :--- | :---: | :---: | :---: |
| Consultar eventos publicados | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar/cancelar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |

### Middlewares de seguridad

Los middlewares se encuentran en `src/middlewares/` y son reutilizables en cualquier ruta:

* **`authMiddleware`** (`auth.middleware.js`): Lee el JWT desde la cookie `currentUser`, valida el token mediante la estrategia `current` de Passport, y puebla `req.user` con los datos del usuario. Responde **401** si no hay sesión válida.
* **`authorizeRoles(...roles)`** (`auth.middleware.js`): Recibe los roles permitidos como parámetro, compara contra `req.user.role` y responde **403** si el rol no coincide.
* **`authorizeEventOwnerOrAdmin`** (`auth.middleware.js`): Verifica que el organizador autenticado sea el dueño del evento que intenta modificar. Los administradores pueden modificar cualquier evento. Responde **403** si no es dueño ni admin, o **404** si el evento no existe.

## ⚠️ Códigos de error: 401 vs 403

| Código | Significado | Cuándo ocurre |
| :---: | :--- | :--- |
| **401** | **No autenticado** | No se envió la cookie `currentUser`, o el token JWT es inválido/expirado. El usuario no tiene sesión activa. |
| **403** | **No autorizado (sin permisos)** | El usuario tiene una sesión válida pero su rol no tiene permisos para realizar la acción solicitada. |

## 🧪 Casos a probar antes de entregar (Pre-entrega 5)

1. `POST /api/events` con rol `user` → Responde **403 Forbidden**.
2. `POST /api/events` con rol `organizer` → **Éxito** (asigna automáticamente al creador como organizador).
3. Ruta administrativa `GET /api/users` con rol `organizer` → Responde **403 Forbidden**.
4. Ruta administrativa `GET /api/users` con rol `admin` → **Éxito**.
5. Cualquier ruta privada (`/current`, `/events` POST, etc.) sin cookie `currentUser` → Responde **401 Unauthorized**.
6. Usuario `organizer` intentando modificar (`PUT /api/events/:id`) un evento ajeno → Responde **403 Forbidden**.

## 🧩 Arquitectura y Buenas Prácticas

* **Estructura Modular de Passport:** La configuración de autenticación está centralizada exclusivamente en `src/config/passport.config.js`. Esta estructura permite registrar nuevas estrategias de autenticación (como proveedores externos: Google, GitHub, OAuth2, etc.) agregando definiciones en este archivo sin necesidad de modificar `app.js`.
* **Seguridad y Utilidades:** La lógica de hash con bcrypt reside en `src/utils/hash.js` y la de generación/verificación de tokens en `src/utils/jwt.js`, manteniendo limpias las rutas y estrategias.


