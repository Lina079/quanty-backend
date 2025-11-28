const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, 'El tipo es obligatorio'],
    enum: {
      values: ['ingreso', 'gasto', 'ahorro', 'inversion'],
      message: 'Tipo debe ser: ingreso, gasto, ahorro o inversion',
    },
  },
  monto: {
    type: Number,
    required: [true, 'El monto es obligatorio'],
    min: [0.01, 'El monto debe ser mayor a 0'],
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true,
    maxlength: [50, 'La categoría no puede tener más de 50 caracteres'],
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [200, 'La descripción no puede tener más de 200 caracteres'],
    default: '',
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria'],
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: false,
  },
  // Campos específicos para inversiones (opcionales)
  activo: {
    type: String,
    trim: true,
    maxlength: [50, 'El activo no puede tener más de 50 caracteres'],
  },
  cantidad: {
    type: Number,
    min: [0, 'La cantidad debe ser mayor o igual a 0'],
  },
  precioCompra: {
    type: Number,
    min: [0, 'El precio de compra debe ser mayor o igual a 0'],
  },
}, {
  timestamps: true,
});

// Índice para búsquedas eficientes por usuario y fecha
transactionSchema.index({ owner: 1, fecha: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
