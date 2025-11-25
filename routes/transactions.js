const router = require('express').Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
} = require('../controllers/transactions');
const { validateTransaction, validateId } = require('../middlewares/validation');

// GET /transactions - Obtener todas las transacciones del usuario
router.get('/', getTransactions);

// POST /transactions - Crear nueva transacción
router.post('/', validateTransaction, createTransaction);

// DELETE /transactions/:id - Eliminar transacción
router.delete('/:id', validateId, deleteTransaction);

module.exports = router;
