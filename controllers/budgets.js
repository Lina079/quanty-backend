const Budget = require('../models/budget');

// Obtener todos los presupuestos del usuario
const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ owner: req.user._id });
    return res.status(200).json(budgets);
  } catch (error) {
    return next(error);
  }
};

// Crear un presupuesto
const createBudget = async (req, res, next) => {
  try {
    const { categoria, previsto, tipo } = req.body;

    const budget = await Budget.create({
      categoria,
      previsto,
      tipo,
      owner: req.user._id,
    });

    return res.status(201).json(budget);
  } catch (error) {
    // Error de duplicado (mismo usuario + categoría + tipo)
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Ya existe un presupuesto para esta categoría',
      });
    }
    return next(error);
  }
};

// Actualizar un presupuesto
const updateBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { previsto, activo } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { previsto, activo },
      { new: true, runValidators: true },
    );

    if (!budget) {
      return res.status(404).json({ message: 'Presupuesto no encontrado' });
    }

    return res.status(200).json(budget);
  } catch (error) {
    return next(error);
  }
};

// Eliminar un presupuesto
const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ message: 'Presupuesto no encontrado' });
    }

    return res.status(200).json({ message: 'Presupuesto eliminado' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};
