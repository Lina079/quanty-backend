const router = require('express').Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
} = require('../controllers/transactions');

// GET /transactions - Obtener todas las transacciones del usuario
router.get('/', getTransactions);

// POST /transactions - Crear nueva transacción
router.post('/', createTransaction);

// DELETE /transactions/:id - Eliminar transacción
router.delete('/:id', deleteTransaction);

module.exports = router;
