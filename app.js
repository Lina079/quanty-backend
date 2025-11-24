// ============================================
// IMPORTACIONES
// ============================================

// Cargar variables de entorno PRIMERO (antes de todo)
require('dotenv').config();

// Framework y utilidades
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');

//Rutas
const routes = require('./routes');

// ============================================
// CONFIGURACIÓN
// ============================================

// Usar variables de entorno o valores por defecto
const { PORT = 3000, MONGODB_URI = 'mongodb://localhost:27017/quanty' } = process.env;

// Crear aplicación Express
const app = express();

// ============================================
// MIDDLEWARES DE SEGURIDAD
// ============================================

// Helmet: añade headers de seguridad HTTP
app.use(helmet());

// CORS: permite requests desde el frontend
app.use(cors());

// Rate Limiter: máximo 100 requests por IP cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: { message: 'Demasiadas solicitudes, intenta más tarde' },
});
app.use(limiter);

// ============================================
// MIDDLEWARES DE PARSING
// ============================================

// Parsear JSON en el body de las requests
app.use(express.json());
app.use(requestLogger);

// ============================================
// RUTA DE PRUEBA
// ============================================

app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a Quanty API!',
    version: '1.0.0',
    status: 'OK',
  });
});

//Rutas de la API
app.use(routes);

//Manejo de errores
app.use(errorLogger);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ============================================
// CONEXIÓN A MONGODB Y ARRANQUE DEL SERVIDOR
// ============================================

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err.message);
  });
