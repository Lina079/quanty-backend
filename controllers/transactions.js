const Transaction = require('../models/transaction');


const getTransactions = async (req, res, next) => {
  try {
    // Buscar todas las transacciones del usuario autenticado
    const transactions = await Transaction.find({ owner: req.user._id })
      .sort({ fecha: -1 }); // Ordenar por fecha descendente (más reciente primero)

    return res.json(transactions);
  } catch (err) {
    return next(err);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const {
      tipo, monto, categoria, descripcion, fecha, activo, cantidad, precioCompra,
    } = req.body;

    const transactionData = {
      tipo,
      monto,
      categoria,
      descripcion,
      fecha: fecha || Date.now(),
      owner: req.user._id, // Asignar al usuario autenticado
    };

    // Agregar campos de inversión solo si existen
    if (activo) transactionData.activo = activo;
    if (cantidad !== undefined) transactionData.cantidad = cantidad;
    if (precioCompra !== undefined) transactionData.precioCompra = precioCompra;

    const transaction = await Transaction.create(transactionData);

    return res.status(201).json(transaction);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
};

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

    return res.json({ message: 'Transacción eliminada' });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
};
