const errorHandler = (err, req, res, next) => {
  if (err.joi) {
    return res.status(400).json({
      message: 'Error de validación',
      details: err.joi.details.map((detail) => detail.message).join(', '),
    });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID no válido' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Este email ya está registrado' });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Token inválido' });
  }
  if (err.name === 'TokenExpirerdError') {
    return res.status(401).json({ message: 'Token expirado' });
  }

  console.error('Error no manejado:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
};

module.exports = errorHandler;
