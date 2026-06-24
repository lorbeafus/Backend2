# Plataforma de Eventos - Tickets Backend

Este proyecto es una API REST estructurada por capas con Express y Mongoose para una plataforma de gestión de eventos y venta de tickets. El diseño de la arquitectura inicial está preparado para ser escalable e integrar servicios en entregas posteriores.

## 🚀 Temática elegida
**Gestión de Eventos y Venta de Entradas (Tickets):** Permite a los usuarios visualizar eventos disponibles, registrarse (crear sesiones/cuenta) y adquirir tickets.

## 🛠️ Tecnologías utilizadas

* **Node.js** (v24+)
* **Express** (Framework de servidor web)
* **MongoDB & Mongoose** (Base de datos NoSQL y modelado de datos)
* **Dotenv** (Configuración a través de variables de entorno)
* **ES Modules (ESM)** (Uso de `import` / `export`)

## 📁 Estructura de carpetas por capas

El proyecto sigue una organización limpia por capas:

```text
TICKETS/
├── src/
│   ├── config/          # Configuración del entorno (env.js)
│   ├── routes/          # Enrutadores de Express (routers)
│   ├── controllers/     # Controladores encargados de la lógica de presentación/HTTP
│   ├── services/        # Capa de lógica de negocio (vacía inicialmente)
│   ├── repositories/    # Capa de repositorios para abstracción de datos (vacía inicialmente)
│   ├── dao/             # Acceso directo a base de datos (Data Access Objects) (vacío inicialmente)
│   ├── models/          # Modelos de Mongoose (User, Event, Ticket)
│   ├── middlewares/     # Middlewares intermedios de Express (vacío inicialmente)
│   ├── utils/           # Utilidades y funciones auxiliares (vacío inicialmente)
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
| **GET** | `/api/events` | Listar todos los eventos (devuelve lista vacía inicialmente) |
| **GET** | `/api/sessions` | Estructura base para autenticación y sesiones |
| **GET** | `/api/user` | Estructura inicial para usuarios |
| **GET** | `/api/ticket` | Estructura inicial para tickets |
