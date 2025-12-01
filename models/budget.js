const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true,
    maxlength: [50, 'La categoría no puede tener más de 50 caracteres'],
  },
  previsto: {
    type: Number,
    required: [true, 'El monto previsto es obligatorio'],
    min: [0, 'El monto previsto debe ser mayor o igual a 0'],
  },
  tipo: {
    type: String,
    required: [true, 'El tipo es obligatorio'],
    enum: {
      values: ['ingreso', 'gasto'],
      message: 'Tipo debe ser: ingreso o gasto',
    },
    default: 'gasto',
  },
  activo: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: false,
  },
}, {
  timestamps: true,
});

// Índice único: un usuario no puede tener dos presupuestos para la misma categoría y tipo
budgetSchema.index({ owner: 1, categoria: 1, tipo: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
