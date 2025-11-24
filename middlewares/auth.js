const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'dev-secret-key' } = process.env;

const auth = (req, res, next) => {
  // Obtener el header Authorization
  const { authorization } = req.headers;

  // ¿Existe y empieza con "Bearer "?
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Autorización requerida' });
  }

  // Extraer el token (quitar "Bearer ")
  const token = authorization.replace('Bearer ', '');

  try {
    // Verificar y decodificar el token
    const payload = jwt.verify(token, JWT_SECRET);

    // Añadir datos del usuario a la request
    req.user = payload;

    // Continuar al siguiente middleware/controlador
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = auth;
