const router = require('express').Router();
const { getCurrentUser, updateUser } = require('../controllers/users');

// GET /users/me - Obtener perfil
router.get('/me', getCurrentUser);

// PATCH /users/me - Actualizar perfil
router.patch('/me', updateUser);

module.exports = router;
