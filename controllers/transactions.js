const Transaction = require('../models/transaction');

// ============================================
// OBTENER TRANSACCIONES DEL USUARIO
// ============================================
const getTransactions = async (req, res, next) => {
  try {
    // Buscar todas las transacciones del usuario autenticado
    const transactions = await Transaction.find({ owner: req.user._id })
      .sort({ fecha: -1 }); // Ordenar por fecha descendente (más reciente primero)

    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

// ============================================
// CREAR TRANSACCIÓN
// ============================================
const createTransaction = async (req, res, next) => {
  try {
    const { tipo, monto, categoria, descripcion, fecha } = req.body;

    const transaction = await Transaction.create({
      tipo,
      monto,
      categoria,
      descripcion,
      fecha: fecha || Date.now(),
      owner: req.user._id, // Asignar al usuario autenticado
    });

    res.status(201).json(transaction);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

// ============================================
// ELIMINAR TRANSACCIÓN
// ============================================
const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar la transacción incluyendo el owner
    const transaction = await Transaction.findById(id).select('+owner');

    // ¿Existe?
    if (!transaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    // ¿Es del usuario autenticado?
    if (transaction.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta transacción' });
    }

    // Eliminar
    await Transaction.findByIdAndDelete(id);

    res.json({ message: 'Transacción eliminada' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
};
