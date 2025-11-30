const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
} = require('../controllers/transactions');
const { validateTransaction, validateId } = require('../middlewares/validation');

// Aplicar auth a TODAS las rutasa de transacciones
router.use(auth);

// GET /transactions - Obtener todas las transacciones del usuario
router.get('/', getTransactions);

// POST /transactions - Crear nueva transacción
router.post('/', validateTransaction, createTransaction);

// DELETE /transactions/:id - Eliminar transacción
router.delete('/:id', validateId, deleteTransaction);

module.exports = router;
