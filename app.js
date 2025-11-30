// Cargar variables de entorno PRIMERO (antes de todo)
require('dotenv').config();

// Framework y utilidades
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

// Rutas
const routes = require('./routes');

// Usar variables de entorno o valores por defecto
const { PORT = 3000, MONGODB_URI = 'mongodb://localhost:27017/quanty' } = process.env;

// Crear aplicación Express
const app = express();

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

// Parsear JSON en el body de las requests
app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a Quanty API!',
    version: '1.0.0',
    status: 'OK',
  });
});

// Rutas de la API
app.use(routes);

// Manejo de errores
app.use(errorLogger);
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});
app.use(errors());
app.use(errorHandler);

// Conectar a MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err.message);
  });

// Iniciar servidor SIEMPRE (independiente de MongoDB)
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
