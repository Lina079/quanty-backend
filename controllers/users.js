const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET = 'dev-secret-key' } = process.env;

// ============================================
// REGISTRO DE USUARIO
// ============================================
const createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Hashear contraseña (10 rondas de salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en la BD
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    // Responder SIN la contraseña
    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      theme: user.theme,
      currency: user.currency,
    });
  } catch (err) {
    // Email duplicado
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Este email ya está registrado' });
    }
    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

// ============================================
// LOGIN DE USUARIO
// ============================================
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario CON contraseña (select: false por defecto)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Generar JWT (expira en 7 días)
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// ============================================
// OBTENER PERFIL DEL USUARIO ACTUAL
// ============================================
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// ============================================
// ACTUALIZAR PERFIL (nombre, theme, currency)
// ============================================
const updateUser = async (req, res, next) => {
  try {
    const { name, theme, currency } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, theme, currency },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
