const router = require('express').Router();
const { createUser, loginUser } = require('../controllers/users');
const userRoutes = require('./users');
const transactionRoutes = require('./transactions');
const auth = require('../middlewares/auth');
const { validateSignup, validateSignin } = require('../middlewares/validation');

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================
router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, loginUser);

// ============================================
// RUTAS PROTEGIDAS (requieren JWT)
// ============================================
router.use('/users', auth, userRoutes);
router.use('/transactions', auth, transactionRoutes);

module.exports = router;
