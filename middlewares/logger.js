const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');

// Formato JSON para los logs
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

// Logger para requests (todas las peticiones)
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/request.log'),
    }),
  ],
  format: jsonFormat,
});

// Logger para errores
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
    }),
  ],
  format: jsonFormat,
});

module.exports = {
  requestLogger,
  errorLogger,
};
