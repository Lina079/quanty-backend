# Quanty - Documentación de Arquitectura y Modelo de Datos

## 📌 Información General

**Proyecto:** Quanty - Aplicación de finanzas personales educativa  
**Desarrolladora:** Lina Castro.
**Bootcamp:** Proyecto Final Full-Stack (5 semanas)  
**Repositorios:**
- Frontend: https://github.com/Lina079/quanty-frontend
- Backend: https://github.com/Lina079/quanty-backend

---

## 💡 Filosofía y Propósito

**Quanty no es solo una app de finanzas. Es la materialización de un proyecto personal de educación financiera desarrollado.**

Este proyecto nació de la necesidad de crear una herramienta que combine:
- 📚 Educación financiera práctica
- 🧘 Bienestar emocional con el dinero
- 🌱 Transformación de hábitos financieros
- ✨ Conexión entre espiritualidad y prosperidad

**Nota importante:** El MVP presentado para el bootcamp es la **base técnica** de un proyecto con visión a largo plazo. Se implementa lo esencial para demostrar viabilidad técnica, pero la arquitectura está diseñada pensando en crecimiento futuro.

---

## 🎯 Concepto del Proyecto (MVP)

Quanty es una aplicación de finanzas personales basada en el sistema de "cajas/sobres". Incluye a **Quantum**, un asistente de educación financiera que acompaña al usuario en su viaje hacia la abundancia.

**Slogan:** "Lleva tus finanzas personales a un nivel cuántico"

**Sistema de 4 Cajas:** Flujo consciente del dinero
- 💰 **Ingresos** - De dónde viene la energía financiera
- 🛒 **Gastos** - Inversión en calidad de vida presente
- 🏦 **Ahorro** - Reserva de tranquilidad y libertad futura
- 📈 **Inversión** - Multiplicación y crecimiento patrimonial

**Principio fundamental:** *"Paga primero a ti mismo"* - Antes de gastar, asegura tu ahorro e inversión.

---

## 🛠️ Stack Técnico

### Frontend
- **Framework:** React 18 + Vite
- **Enrutamiento:** React Router v6
- **Gráficos:** Recharts
- **Estilos:** CSS Modules + CSS Variables (modo oscuro/claro)
- **Deploy:** Netlify o Vercel

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Base de datos:** MongoDB + Mongoose
- **Autenticación:** JWT (JSON Web Tokens)
- **Validación:** Joi o Celebrate
- **Seguridad:** bcrypt para contraseñas
- **Deploy:** Render o Railway

---

## 📊 Modelo de Datos

### 1. Colección: `users`

```javascript
{
  _id: ObjectId,
  name: String,           // Nombre del usuario (requerido, 2-30 caracteres)
  email: String,          // Email único (requerido, validación de formato email)
  password: String,       // Hash bcrypt (requerido, no devolver en respuestas)
  createdAt: Date         // Fecha de creación (automático)
}
```

**Validaciones:**
- `name`: requerido, longitud entre 2-30 caracteres
- `email`: requerido, único, formato email válido
- `password`: requerido, hash con bcrypt (salt rounds: 10)
- `createdAt`: generado automáticamente con `Date.now()`

**Índices:**
- `email`: único

---

### 2. Colección: `transactions`

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // Referencia a User (requerido)
  type: String,           // 'income' | 'expense' | 'saving' | 'investment' (requerido)
  category: String,       // Categoría de la transacción (requerido)
  amount: Number,         // Monto en euros (requerido, positivo)
  note: String,           // Nota opcional del usuario
  date: Date,             // Fecha de la transacción (requerido)
  createdAt: Date         // Fecha de creación del registro (automático)
}
```

**Validaciones:**
- `userId`: requerido, debe existir en colección `users`
- `type`: requerido, enum: ['income', 'expense', 'saving', 'investment']
- `category`: requerido, texto libre (permite categorías personalizadas)
- `amount`: requerido, número positivo
- `note`: opcional, máximo 200 caracteres
- `date`: requerido, formato Date
- `createdAt`: generado automáticamente

**Índices:**
- `userId`: para consultas rápidas por usuario
- Índice compuesto: `userId + date` para ordenamiento

---

## 📂 Categorías Predefinidas

### 💰 Ingresos (`type: 'income'`)
- Sueldo
- Intereses
- Rentabilidad
- Bonos
- Freelance
- Otros

### 🛒 Gastos (`type: 'expense'`)
- Alquiler
- Hipoteca
- Mercado
- Transporte
- Luz
- Agua
- Internet
- Teléfono
- Gimnasio
- Ocio
- Restaurantes
- Salud
- Educación
- Personalizado *(el usuario puede crear su propio nombre)*
- Otros

### 🏦 Ahorro (`type: 'saving'`)
- **Reserva de tranquilidad** 
- Meta específica
- Ahorro general

### 📈 Inversión (`type: 'investment'`)
- Bitcoin
- Oro
- S&P 500
- NVDA
- Otra

**Nota importante:** El campo `category` acepta **texto libre**, permitiendo al usuario crear categorías personalizadas sin necesidad de modificar la base de datos.

---

## 🔄 API Endpoints

### Autenticación

#### `POST /auth/signup`
Registra un nuevo usuario.

**Body:**
```json
{
  "name": "María García",
  "email": "maria@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "_id": "...",
    "name": "María García",
    "email": "maria@example.com"
  }
}
```

---

#### `POST /auth/login`
Inicia sesión y devuelve un JWT.

**Body:**
```json
{
  "email": "maria@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "María García",
    "email": "maria@example.com"
  }
}
```

---

### Usuario

#### `GET /users/me`
Obtiene información del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "_id": "...",
  "name": "María García",
  "email": "maria@example.com",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

---

### Transacciones

#### `GET /transactions`
Obtiene todas las transacciones del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Query params opcionales:**
- `type`: filtrar por tipo ('income', 'expense', 'saving', 'investment')
- `startDate`: fecha inicial (ISO format)
- `endDate`: fecha final (ISO format)

**Respuesta exitosa (200):**
```json
{
  "transactions": [
    {
      "_id": "...",
      "userId": "...",
      "type": "income",
      "category": "Sueldo",
      "amount": 2500,
      "note": "Pago mensual enero",
      "date": "2025-01-31T00:00:00.000Z",
      "createdAt": "2025-01-31T12:00:00.000Z"
    }
  ]
}
```

---

#### `POST /transactions`
Crea una nueva transacción.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "type": "expense",
  "category": "Mercado",
  "amount": 85.50,
  "note": "Compra semanal",
  "date": "2025-01-28"
}
```

**Respuesta exitosa (201):**
```json
{
  "transaction": {
    "_id": "...",
    "userId": "...",
    "type": "expense",
    "category": "Mercado",
    "amount": 85.50,
    "note": "Compra semanal",
    "date": "2025-01-28T00:00:00.000Z",
    "createdAt": "2025-01-28T15:30:00.000Z"
  }
}
```

---

#### `PATCH /transactions/:id`
Actualiza una transacción existente.

**Headers:**
```
Authorization: Bearer <token>
```

**Body (campos opcionales):**
```json
{
  "category": "Supermercado",
  "amount": 90,
  "note": "Compra actualizada"
}
```

**Respuesta exitosa (200):**
```json
{
  "transaction": {
    "_id": "...",
    "type": "expense",
    "category": "Supermercado",
    "amount": 90,
    "note": "Compra actualizada",
    "date": "2025-01-28T00:00:00.000Z"
  }
}
```

---

#### `DELETE /transactions/:id`
Elimina una transacción.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "message": "Transacción eliminada exitosamente"
}
```

---

## 🎨 Páginas y Vistas (Frontend)

### 1. **Landing / Login**
- Presentación de Quanty
- Introducción de Quantum (el bot)
- Formularios de login/registro

### 2. **Dashboard**
- 4 tarjetas resumen (Ingresos, Gastos, Ahorro, Inversión)
- Botón FAB "+" para nueva transacción
- Mensaje de bienvenida de Quantum

### 3. **Balance General**
- Gráfica de dona con distribución de las 4 cajas
- Porcentajes y montos totales
- Mensaje contextual de Quantum según equilibrio

### 4. **Detalle Gastos**
- Desglose por categorías
- Gráfica de barras o dona
- Lista de transacciones de gastos

### 5. **Detalle Ingresos**
- Desglose por categorías
- Total de ingresos
- Lista de transacciones de ingresos

### 6. **Detalle Ahorro**
- Total ahorrado
- Progreso hacia metas
- Separación: Reserva de tranquilidad / Metas / Ahorro general

### 7. **Inversiones**
- Balance total invertido
- Gráfica de barras con rendimiento simulado
- Tabla con activos: BTC, Oro, S&P 500, NVDA
- **Porcentajes hardcodeados** (no API real para MVP)

### 8. **Transacciones**
- Lista completa de todas las transacciones
- Filtros por tipo, categoría, fecha
- Paginación o scroll infinito

### 9. **Perfil**
- Información del usuario
- Selector de tema (oscuro/claro)
- Botón de logout

---

## 🤖 Quantum - Tu Guía de Educación Financiera

**Quantum no es un chatbot. Es tu mentor financiero digital.**

Inspirado en la sabiduría japonesa de **Kakeibo** y otros maestros de las finanzas personales, Quantum te acompaña en tu transformación financiera con mensajes contextuales basados en tu comportamiento real con el dinero.

### Implementación MVP (Fase 1)

Para el MVP, Quantum funciona con **lógica condicional inteligente** (if/else) que evalúa:
- Tu situación financiera actual (ingresos vs gastos vs ahorro)
- La página donde te encuentras
- Tus patrones de comportamiento
- Tu equilibrio entre las 4 cajas

**NO usa IA generativa** para mantener el control total sobre los mensajes educativos.

### Mensajes por Ubicación

Quantum adapta sus consejos según dónde estés en la app:

**Dashboard:**  
*"Bienvenido de vuelta, [nombre]. Quantum está aquí para guiarte hacia el equilibrio financiero. Recuerda: cada decisión con tu dinero es una semilla que plantas hoy para tu futuro."*

**Gastos:**  
*"¡Analicemos en qué áreas estás gastando más! Recuerda: gastar no es malo, gastar sin consciencia sí lo es. Cada euro es un voto por el tipo de vida que quieres."*

**Ahorro:**  
*"Tu Reserva de tranquilidad no es solo dinero guardado. Es libertad, es paz mental, es poder decir 'no' sin miedo. Estás construyendo tu independencia 🧘"*

**Inversiones:**  
*"Diversificar es multiplicar posibilidades 🌍✨ Tus activos trabajan para ti mientras duermes. Esa es la diferencia entre trabajar por dinero y hacer que el dinero trabaje por ti."*

**Ingresos:**  
*"Cada ingreso es una oportunidad. ¿Cómo distribuirás esta energía financiera entre tus 4 cajas?"*

### Mensajes según Equilibrio Financiero

Quantum evalúa tu **índice de equilibrio** (proporción ahorro+inversión / ingresos totales):

**Equilibrio > 70%:**  
*"Tu equilibrio financiero está al 78% 🌱 Vas por excelente camino. Estás construyendo verdadera riqueza: no solo tener más, sino necesitar menos."*

**Equilibrio 40-70%:**  
*"Vas por buen camino, pero puedes mejorar 💪 Intenta aumentar un 5% tu ahorro este mes. Pequeños cambios consistentes = grandes resultados."*

**Equilibrio < 40%:**  
*"Recuerda el principio de oro: paga primero a ti mismo 📚 Antes de pagar facturas, destina al menos un 10% de tus ingresos a tu Reserva de tranquilidad. Tu yo del futuro te lo agradecerá."*

### Mensajes según Comportamiento

**Si gastas más del 60% en ocio/restaurantes:**  
*"La vida es para disfrutarse, pero ¿estos gastos te acercan a tus metas o solo te dan placer momentáneo? Busca el equilibrio entre vivir hoy y construir mañana."*

**Si llevas 3 meses sin ahorrar:**  
*"Tu Reserva de tranquilidad no ha crecido. Recuerda: no se trata de cuánto ganas, sino de cuánto conservas. Empieza hoy, aunque sea con 10€."*

**Si tus inversiones crecen:**  
*"¡Tus activos están trabajando para ti! 📈 Esto es riqueza real: dinero que se multiplica sin tu esfuerzo activo."*

### Implementación Técnica (MVP)

```javascript
// Pseudocódigo - Ejemplo de lógica
const getQuantumMessage = (user, location, financialData) => {
  const balance = calculateBalance(financialData);
  const savings = financialData.savings / financialData.income;
  
  if (location === 'dashboard') {
    if (balance > 0.7) return messages.excellent;
    if (balance > 0.4) return messages.good;
    return messages.needsImprovement;
  }
  
  if (location === 'savings') {
    if (savings === 0) return messages.startSaving;
    return messages.savingEncouragement;
  }
  
  // ... más lógica condicional
};
```

**Ventajas de este enfoque:**
- ✅ Control total sobre mensajes educativos
- ✅ Respuestas instantáneas (sin latencia de APIs)
- ✅ Sin costos de APIs de IA
- ✅ Mensajes siempre relevantes y probados
- ✅ Fácil de expandir con más reglas

---

## 🚀 Visión a Largo Plazo

### Roadmap de Quantum (Post-MVP)

**Fase 2 - Lecciones Interactivas:**
- Sistema de módulos educativos desbloqueables
- 7 módulos basados en la "Guía Financiera Integral"
- Progreso gamificado con badges
- Cuestionarios y ejercicios prácticos

**Fase 3 - Personalización Avanzada:**
- Onboarding con preguntas sobre situación y metas
- Mensajes personalizados según perfil (conservador, equilibrado, agresivo)
- Recordatorios inteligentes
- Análisis de patrones de comportamiento

**Fase 4 - Quantum Pro (IA Real):**
- Integración con modelos de lenguaje (Claude API)
- Conversaciones naturales sobre finanzas
- Análisis predictivo de gastos
- Recomendaciones personalizadas de optimización

### Los 7 Módulos de Educación Financiera (Visión Completa)

Basados en la "Guía Financiera Integral: Desbloquea tu camino a la abundancia":

**Módulo 1: Fundamentos de Educación Financiera**
- Diferenciando Activos y Pasivos
- Creación de Flujo de Ingresos Pasivos
- Estrategias de Inversión para Creación de Activos

**Módulo 2: Psicología del Dinero**
- Comprendiendo las Emociones detrás de las Decisiones Financieras
- Superando Miedos y Creencias Limitantes sobre la Inversión
- Construyendo Hábitos Financieros Sostenibles

**Módulo 3: Presupuesto y Gastos Inteligentes**
- El Papel del Presupuesto en la Creación de Riqueza
- Priorizando Gastos: Necesidades vs. Deseos
- Ejercicios Prácticos para un Presupuesto Efectivo

**Módulo 4: Estrategias de Inversión a Largo Plazo**
- Construyendo una Cartera Diversificada
- Estrategias de Inversión: Lecciones de "Padre Rico, Padre Pobre"
- Integrando la Psicología del Dinero en Decisiones de Inversión

**Módulo 5: Planificación para el Futuro y Gestión de Riesgos**
- Estrategias de Planificación para la Jubilación
- Toma de Riesgos Calculados en Inversiones
- Adaptación Continua en un Mundo Financiero Cambiante

**Módulo 6: Transformando Hábitos Financieros**
- Diseñando la Arquitectura de Hábitos Financieros
- Desbloqueando Riqueza con los "Sobres de la Prosperidad"
- Transformando Hábitos Atómicos para la Prosperidad

**Módulo 7: Despertar Espiritual y Prosperidad**
- Comprendiendo la conexión entre espiritualidad y dinero
- Transformando vidas a través de decisiones financieras
- Abrazando la abundancia y la generosidad

### Arquitectura Futura de Base de Datos

```javascript
// Modelo para progreso educativo (Fase 2+)
{
  _id: ObjectId,
  userId: ObjectId,
  completedModules: [Number],      // [1, 2, 3]
  completedLessons: [String],      // ["1.1", "1.2", "2.1"]
  badges: [String],                // ["first_save", "investor", "disciplined"]
  currentStreak: Number,           // Días consecutivos usando la app
  educationScore: Number,          // 0-100, gamificación
  personalityProfile: String,      // "conservative" | "balanced" | "aggressive"
  onboardingAnswers: Object,       // Respuestas del cuestionario inicial
  createdAt: Date
}
```

**Nota:** Esta estructura NO se implementa en el MVP. Se documenta aquí para planificación futura.

---

## 🚨 Decisiones Técnicas Clave

### 1. Categorías personalizadas
- El campo `category` acepta **texto libre**
- No se necesita tabla separada de categorías
- El usuario puede escribir cualquier nombre de categoría

### 2. Inversiones simuladas
- Usar **porcentajes fijos hardcodeados** (no API real)
- Ejemplo: BTC +12%, Oro +5%, S&P 500 +3%, NVDA +15%
- Para MVP es suficiente; en v2 se puede integrar API real

### 3. Cálculos en frontend
- **NO crear endpoint `/balance`**
- Calcular totales usando `filter()` + `reduce()` sobre el array de transacciones
- Mejora el rendimiento al no hacer consultas adicionales

### 4. Quantum sin IA
- Solo mensajes estáticos con condicionales `if/else`
- Evaluar condiciones:
  - Página actual
  - Proporción ingresos/gastos/ahorro/inversión
  - Montos totales

### 5. Terminología específica
- **"Reserva de tranquilidad"** en lugar de "Fondo de emergencia"
- Vocabulario positivo y empoderador

---

## ⏱️ Cronograma de Desarrollo (5 semanas)

| Semana | Objetivo | Tareas principales |
|--------|----------|-------------------|
| **1** | Frontend completo | HTML/CSS de las 9 páginas + gráficos con datos hardcodeados |
| **2** | Lógica frontend | Calcular totales, modal funcional, Quantum básico |
| **3** | Backend completo | API + Auth + MongoDB + deploy |
| **4** | Integración | Conectar front-back + CRUD real + Login funcional |
| **5** | Pulido final | Bugs, README, testing, presentación |

---

## 🔒 Seguridad y Buenas Prácticas

### Backend
- Contraseñas encriptadas con `bcrypt` (10 salt rounds)
- JWT con expiración (7 días recomendado)
- Validación de datos con Joi/Celebrate antes de controladores
- Manejo centralizado de errores
- Variables de entorno con `dotenv` (JWT_SECRET, MONGO_URI)
- CORS configurado correctamente
- Rate limiting (opcional pero recomendado)

### Frontend
- JWT almacenado en `localStorage`
- Validación de formularios antes de enviar
- Rutas protegidas con `<ProtectedRoute>`
- Mensajes de error claros al usuario
- Loading states durante peticiones

---

## 📝 Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa (GET, PATCH, DELETE) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 400 | Bad Request | Datos de entrada inválidos |
| 401 | Unauthorized | Token inválido o ausente |
| 403 | Forbidden | Usuario autenticado pero sin permisos |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Email ya existe (signup) |
| 500 | Server Error | Error interno del servidor |

---

## 🎯 Criterios de Éxito - MVP

### Backend
- [x] 8 endpoints funcionando correctamente
- [x] Autenticación JWT implementada
- [x] Base de datos MongoDB conectada
- [x] Validación de datos
- [x] Manejo de errores centralizado
- [x] Deploy exitoso con HTTPS

### Frontend
- [x] 9 páginas responsive
- [x] Gráficos con Recharts funcionando
- [x] Modal de nueva transacción
- [x] Sistema de autenticación (login/registro/logout)
- [x] Cálculos correctos de totales
- [x] Quantum mostrando mensajes contextuales
- [x] Deploy exitoso

### Funcionalidad
- [x] Usuario puede registrarse e iniciar sesión
- [x] Usuario puede crear/editar/eliminar transacciones
- [x] Dashboard muestra resumen de las 4 cajas
- [x] Gráficos actualizan en tiempo real
- [x] Categorías personalizadas funcionan
- [x] Inversiones muestran % simulados

---

## 📚 Referencias y Recursos

### Inspiración Filosófica y Educativa
- El Kakeibo, metodo de ahorro japonés. 
- *El Hombre Más Rico de Babilonia* - George S. Clason
- *Padre Rico, Padre Pobre* - Robert Kiyosaki
- *Hábitos Atómicos* - James Clear
- *La Psicología del Dinero* - Morgan Housel
- Filosofía de abundancia y espiritualidad financiera

### Stack Técnico
- MERN (MongoDB, Express, React, Node.js)
- Documentación React: https://react.dev
- Documentación MongoDB: https://docs.mongodb.com
- Recharts: https://recharts.org

---

## 💭 Nota Final

**Este proyecto es más que código. Es la materialización de años de estudio, reflexión y transformación personal sobre la relación con el dinero.**

El MVP presentado para el bootcamp es intencionalmente simple en su implementación técnica, pero sólido en su arquitectura. Está diseñado para:
- ✅ Cumplir con todos los requisitos técnicos del bootcamp
- ✅ Demostrar dominio del stack MERN
- ✅ Ser escalable hacia la visión completa
- ✅ Mantener la esencia filosófica del proyecto

**Quanty seguirá creciendo después del bootcamp.** Esta base técnica permitirá implementar gradualmente:
- Los 7 módulos educativos completos
- Sistema de gamificación
- Quantum con IA conversacional
- Comunidad de usuarios
- Contenido educativo multimedia

**La abundancia es un viaje, no un destino. Y todo viaje comienza con un primer paso.**

---

**Versión:** 1.0.0  
**Estado:** Etapa 0 - Planificación completada  
**Autora:** Lina Castro.   
**Propósito:** Proyecto final de bootcamp + Base de proyecto personal a largo plazo
