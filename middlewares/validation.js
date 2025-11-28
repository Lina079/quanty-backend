const { celebrate, Joi } = require('celebrate');

// Validación para registro
const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'string.email': 'Email no válido',
        'any.required': 'El email es obligatorio',
      }),
    password: Joi.string().required().min(8)
      .pattern(/[a-zA-Z]/)
      .pattern(/[0-9]/)
      .messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.pattern.base': 'La contraseña debe contener letras y números',
        'any.required': 'La contraseña es obligatoria',
      }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 30 caracteres',
        'any.required': 'El nombre es obligatorio',
      }),
  }),
});

// Validación para login
const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Validación para actualizar perfil
const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    theme: Joi.string().valid('dark', 'light'),
    currency: Joi.string().valid('EUR', 'USD', 'COP', 'MXN', 'GBP', 'JPY'),
  }),
});

// Validación para crear transacción
const validateTransaction = celebrate({
  body: Joi.object().keys({
    tipo: Joi.string().required().valid('ingreso', 'gasto', 'ahorro', 'inversion'),
    monto: Joi.number().required().min(0.01),
    categoria: Joi.string().required().max(50),
    descripcion: Joi.string().max(200).allow(''),
    fecha: Joi.date(),
    // Campos para inversiones (opcionales)
    activo: Joi.string().max(50),
    cantidad: Joi.number().min(0),
    precioCompra: Joi.number().min(0),
  }),
});

// Validación para ID de MongoDB
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24)
      .messages({
        'string.hex': 'ID no válido',
        'string.length': 'ID no válido',
      }),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateUpdateUser,
  validateTransaction,
  validateId,
};
