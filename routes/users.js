const router = require('express').Router();
const { getCurrentUser, updateUser } = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validation');

// GET /users/me - Obtener perfil
router.get('/me', getCurrentUser);

// PATCH /users/me - Actualizar perfil
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
