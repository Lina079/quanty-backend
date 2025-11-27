# Quanty Backend API 🚀

API RESTful para Quanty, aplicación de finanzas personales basada en el método japonés Kakeibo. Backend desarrollado con Node.js, Express y MongoDB.

---

## 🔗 Enlaces del Proyecto

| Recurso | URL |
|---------|-----|
| **API en Producción** | https://api.myquanty.com |
| **Frontend** | https://myquanty.com |
| **Repositorio Frontend** | https://github.com/Lina079/quanty-frontend |
| **Repositorio Backend** | https://github.com/Lina079/quanty-backend |

---

## 📋 Descripción

Backend que proporciona una API RESTful completa para la gestión de finanzas personales con el sistema de "4 cajas":

- 💰 **Ingresos** - Registro de entradas de dinero
- 💸 **Gastos** - Control de egresos por categoría
- 🏦 **Ahorro** - Reserva de tranquilidad y metas
- 📈 **Inversión** - Seguimiento de activos (Bitcoin, ETH, Oro)

### Características principales

✅ Autenticación segura con JWT
✅ Contraseñas encriptadas con bcrypt
✅ Validación de datos con Celebrate/Joi
✅ Manejo centralizado de errores
✅ Sistema de logging (request.log, error.log)
✅ Protección con Helmet y Rate Limiting
✅ CORS configurado para frontend

---

## 🛠️ Tecnologías Utilizadas

### Core
| Tecnología | Uso |
|------------|-----|
| **Node.js 18+** | Runtime de JavaScript |
| **Express.js** | Framework web |
| **MongoDB** | Base de datos NoSQL |
| **Mongoose** | ODM para MongoDB |

### Seguridad
| Tecnología | Uso |
|------------|-----|
| **JWT** | Autenticación stateless |
| **bcrypt** | Hash de contraseñas |
| **Helmet** | Headers HTTP seguros |
| **express-rate-limit** | Protección contra ataques |

### Validación y Logging
| Tecnología | Uso |
|------------|-----|
| **Celebrate/Joi** | Validación de requests |
| **Winston** | Sistema de logging |
| **express-winston** | Logging de HTTP requests |

### Deploy
| Servicio | Uso |
|----------|-----|
| **Google Cloud Run** | Hosting del servidor |
| **MongoDB Atlas** | Base de datos en la nube |
| **Cloudflare** | DNS y SSL |

---

## 📡 Rutas de la API

### Rutas Públicas (sin autenticación)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/signup` | Registrar nuevo usuario |
| `POST` | `/signin` | Iniciar sesión (devuelve JWT) |

### Rutas Protegidas (requieren JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/users/me` | Obtener perfil del usuario |
| `PATCH` | `/users/me` | Actualizar perfil |
| `GET` | `/transactions` | Obtener transacciones del usuario |
| `POST` | `/transactions` | Crear nueva transacción |
| `DELETE` | `/transactions/:id` | Eliminar transacción |

---

## 📊 Modelos de Datos

### Usuario (User)
```javascript
{
  email: String,      // Único, requerido, formato email
  password: String,   // Requerido, hasheado con bcrypt
  name: String,       // Requerido, 2-30 caracteres
  theme: String,      // 'dark' | 'light'
  currency: String,   // 'EUR' | 'USD' | 'COP' | 'MXN' | 'GBP' | 'JPY'
  createdAt: Date     // Automático
}
```

### Transacción (Transaction)
```javascript
{
  tipo: String,       // 'ingreso' | 'gasto' | 'ahorro' | 'inversion'
  monto: Number,      // Requerido, mínimo 0.01
  categoria: String,  // Requerido, máximo 50 caracteres
  descripcion: String,// Opcional, máximo 200 caracteres
  fecha: Date,        // Requerido
  owner: ObjectId,    // Referencia al usuario (no se devuelve)
  // Campos específicos para inversiones:
  activo: String,     // Ej: 'bitcoin', 'ethereum'
  cantidad: Number,   // Cantidad del activo
  precioCompra: Number// Precio de compra unitario
}
```

---

## 📂 Estructura del Proyecto
```
quanty-backend/
├── controllers/        # Lógica de negocio
│   ├── users.js        # Controladores de usuario
│   └── transactions.js # Controladores de transacciones
├── middlewares/        # Funciones intermedias
│   ├── auth.js         # Verificación de JWT
│   ├── validation.js   # Esquemas Celebrate/Joi
│   ├── errorHandler.js # Manejo centralizado de errores
│   └── logger.js       # Configuración de Winston
├── models/             # Esquemas de Mongoose
│   ├── user.js         # Modelo de usuario
│   └── transaction.js  # Modelo de transacción
├── routes/             # Definición de endpoints
│   ├── index.js        # Router principal
│   ├── users.js        # Rutas de usuario
│   └── transactions.js # Rutas de transacciones
├── logs/               # Archivos de registro (no en Git)
│   ├── request.log     # Log de peticiones HTTP
│   └── error.log       # Log de errores
├── app.js              # Configuración de Express
├── package.json        # Dependencias y scripts
└── Dockerfile          # Configuración para contenedor
```

---

## 🚀 Instalación y Ejecución Local

### Requisitos previos
- Node.js 18+
- MongoDB (local o Atlas)
- npm o yarn

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/Lina079/quanty-backend.git
cd quanty-backend

# Instalar dependencias
npm install
```

### Variables de entorno

Crear archivo `.env` en la raíz del proyecto:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/quanty
JWT_SECRET=tu_clave_secreta_muy_segura
NODE_ENV=development
```

> ⚠️ **Importante:** El archivo `.env` contiene secretos y NO debe subirse a Git.

### Ejecutar
```bash
# Modo desarrollo (con hot reload)
npm run dev

# Modo producción
npm run start
```

El servidor estará disponible en `http://localhost:3000`

---

## 🔐 Autenticación

### Registro de usuario
```bash
POST /signup
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "Password123",
  "name": "Usuario"
}
```

### Inicio de sesión
```bash
POST /signin
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "Password123"
}
```

**Respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usar el token

Incluir en el header de las peticiones protegidas:
```
Authorization: Bearer <token>
```

---

## 🛡️ Seguridad Implementada

| Medida | Descripción |
|--------|-------------|
| **JWT** | Tokens con expiración de 7 días |
| **bcrypt** | Hash de contraseñas (10 salt rounds) |
| **Helmet** | Headers HTTP de seguridad |
| **Rate Limit** | Máximo 100 requests/15 min por IP |
| **CORS** | Solo permite orígenes autorizados |
| **Validación** | Todos los inputs validados antes de procesar |

---

## 📝 Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| `200` | OK | Operación exitosa |
| `201` | Created | Recurso creado |
| `400` | Bad Request | Datos inválidos |
| `401` | Unauthorized | Token inválido o ausente |
| `403` | Forbidden | Sin permisos para esta acción |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Email ya registrado |
| `500` | Server Error | Error interno |

---

## 📋 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `npm run dev` | Inicia con nodemon (hot reload) |
| `start` | `npm run start` | Inicia en modo producción |
| `lint` | `npm run lint` | Ejecuta ESLint |

---

## 👩‍💻 Autora

**Lina Castro Rodriguez**
*Full Stack Developer Jr. - Bootcamp TripleTen*

- 🔗 [LinkedIn](https://linkedin.com/in/lina-castro079)
- 💻 [GitHub](https://github.com/Lina079)
- 📧 linacastror079@gmail.com

---

## 📝 Notas del Proyecto

Este backend fue desarrollado como **Etapa 2 del Proyecto Final** del Bootcamp de Desarrollo Web de TripleTen.

### Criterios Cumplidos

✅ API RESTful con Node.js + Express
✅ Base de datos MongoDB con Mongoose
✅ Autenticación JWT implementada
✅ Contraseñas hasheadas con bcrypt
✅ Validación con Celebrate/Joi
✅ Manejo centralizado de errores
✅ Sistema de logging (Winston)
✅ Seguridad con Helmet y Rate Limiting
✅ Deploy en servidor con HTTPS
✅ Dominio personalizado configurado

---

## 📄 Licencia

Este proyecto es parte de un bootcamp educativo. El código está disponible con fines de portafolio y aprendizaje.

---

**Versión:** 1.0.0
**Última actualización:** Noviembre 2025
