const router = require('express').Router();
const { createUser, loginUser } = require('../controllers/users');
const userRoutes = require('./users');
const transactionRoutes = require('./transactions');
const auth = require('../middlewares/auth');

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================
router.post('/signup', createUser);
router.post('/signin', loginUser);

// ============================================
// RUTAS PROTEGIDAS (requieren JWT)
// ============================================
router.use('/users', auth, userRoutes);
router.use('/transactions', auth, transactionRoutes);

module.exports = router;
