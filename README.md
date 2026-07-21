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

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/api/health` | Comprobación de estado y salud del servidor |
| **POST** | `/api/sessions/register` | Registro de usuario (valida datos, email único, y hashea contraseña) |
| **POST** | `/api/sessions/login` | Inicio de sesión (valida credenciales, genera JWT y guarda en cookie HTTP Only) |
| **GET** | `/api/sessions/current` | Obtener el perfil del usuario autenticado actual (Ruta protegida por JWT) |
| **POST** | `/api/sessions/logout` | Cerrar sesión (elimina la cookie del token) |
| **GET** | `/api/events` | Listar todos los eventos |
| **GET** | `/api/users` | Listado general de usuarios |
| **GET** | `/api/tickets` | Listado general de tickets |
