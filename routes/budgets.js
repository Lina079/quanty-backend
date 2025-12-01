const router = require('express').Router();
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgets');

// GET /budgets - Obtener todos los presupuestos del usuario
router.get('/', getBudgets);

// POST /budgets - Crear un nuevo presupuesto
router.post('/', createBudget);

// PATCH /budgets/:id - Actualizar un presupuesto
router.patch('/:id', updateBudget);

// DELETE /budgets/:id - Eliminar un presupuesto
router.delete('/:id', deleteBudget);

module.exports = router;
