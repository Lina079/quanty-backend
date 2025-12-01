const router = require('express').Router();
const { createUser, loginUser } = require('../controllers/users');
const userRoutes = require('./users');
const transactionRoutes = require('./transactions');
const budgetRoutes = require('./budgets');
const auth = require('../middlewares/auth');
const { validateSignup, validateSignin } = require('../middlewares/validation');

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, loginUser);

router.use('/users', auth, userRoutes);
router.use('/transactions', auth, transactionRoutes);
router.use('/budgets', auth, budgetRoutes);

module.exports = router;
