const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Email no válido',
    },
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    select: false, // No devolver en consultas por defecto
    validate: {
      validator: (v) => {
        const tieneLetras = /[a-zA-Z]/.test(v);
        const tieneNumeros = /[0-9]/.test(v);
        return tieneLetras && tieneNumeros;
      },
      message: 'La contraseña debe contener letras y números',
    },
  },
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [30, 'El nombre no puede tener más de 30 caracteres'],
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark',
  },
  currency: {
    type: String,
    enum: ['EUR', 'USD', 'COP', 'MXN', 'GBP', 'JPY'],
    default: 'EUR',
  },
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
});

// Método para verificar contraseña (lo usaremos en login)
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
