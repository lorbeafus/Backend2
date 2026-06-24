# Tickets Backend

Este proyecto es una API REST desarrollada con **Node.js**, **Express** y **Mongoose (MongoDB)** para gestionar la reserva y administración de tickets para eventos.

## 🚀 Tecnologías utilizadas

* **Node.js** (v24+)
* **Express** (Framework web)
* **MongoDB & Mongoose** (Base de datos y modelado de datos)
* **Dotenv** (Gestión de variables de entorno)

## 📁 Estructura del proyecto

```text
TICKETS/
├── src/
│   ├── config/
│   │   └── env.js             # Configuración de variables de entorno
│   ├── controllers/
│   │   ├── event.controllers.js
│   │   ├── ticket.controllers.js
│   │   └── user.controllers.js
│   ├── models/
│   │   ├── event.model.js
│   │   ├── ticket.model.js
│   │   └── user.model.js
│   ├── routers/
│   │   ├── event.routes.js
│   │   ├── ticket.routes.js
│   │   └── user.routes.js
│   └── app.js                 # Punto de entrada de la aplicación
├── database.js                # Conexión a la base de datos MongoDB
├── .env                       # Variables de entorno (no subir a Git)
├── .gitignore                 # Archivos ignorados por Git
├── package.json               # Configuración y dependencias del proyecto
└── README.md                  # Documentación
```

## 🛠️ Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/lorbeafus/Backend2.git
cd TICKETS
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/tickets
```

## ⚡ Ejecución

* **Modo Producción:**
  ```bash
  npm run start
  ```

* **Modo Desarrollo (con auto-recarga al guardar cambios):**
  ```bash
  npm run dev
  ```

## 🔌 Rutas del Endpoints de la API

* **Usuarios:** `/api/user`
* **Tickets:** `/api/ticket`
* **Eventos:** `/api/event`
