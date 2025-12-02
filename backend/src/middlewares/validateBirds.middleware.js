/* 
✅ EXPRESS VALIDATOR → validateBird.middlewares.js
    * Validación con mensajes de ayuda claros en castellano
*/

const { body, param, validationResult } = require('express-validator');

// Niveles de amenaza permitidos (códigos UICN)
const ALLOWED_THREAT_LEVELS = ['EX', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'];

// =============================================================================================================================
// 1. VALIDACIÓN PARA CREAR AVES
// =============================================================================================================================

// Middleware de validación para crear aves
const validateBird = [

  // 1. common_name: Nombre común en español
  body('common_name')
    .notEmpty().withMessage('El nombre común es obligatorio')
    .isLength({ min: 2, max: 150 }).withMessage('El nombre común debe tener entre 2 y 150 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\-]+$/)
    .withMessage('Solo letras, espacios y guiones. Ejemplo: "Carbonero común", "Águila real"')
    .trim()
    .escape(),
    
  // 2. scientific_name: Nombre científico en latín
  body('scientific_name')
    .notEmpty().withMessage('El nombre científico es obligatorio')
    .isLength({ min: 3, max: 150 }).withMessage('Debe tener entre 3 y 150 caracteres')
    .matches(/^[A-Z][a-z]+(?:\s+[a-z\-]+)+$/)
    .withMessage('Formato: Género (mayúscula) y especie (minúscula). Ejemplo: "Parus major", "Aquila chrysaetos"')
    .trim()
    .escape(),
    
  // 3. order: Orden taxonómico
  body('order')
    .notEmpty().withMessage('El orden taxonómico es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('Debe tener entre 3 y 100 caracteres')
    .matches(/^[A-Za-z\s\-]+$/)
    .withMessage('Solo letras, espacios y guiones. Ejemplo: "Passeriformes", "Falconiformes"')
    .trim()
    .escape(),
    
  // 4. family: Familia taxonómica  
  body('family')
    .notEmpty().withMessage('La familia taxonómica es obligatoria')
    .isLength({ min: 3, max: 100 }).withMessage('Debe tener entre 3 y 100 caracteres')
    .matches(/^[A-Za-z\s\-]+$/)
    .withMessage('Solo letras, espacios y guiones. Ejemplo: "Paridae", "Accipitridae"')
    .trim()
    .escape(),
    
  // 5. description: Descripción detallada
  body('description')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 20, max: 500 }).withMessage('La descripción debe tener entre 20 y 500 caracteres')
    .trim()
    .escape(),
    
  // 6. image: URL de imagen
  body('image')
    .notEmpty().withMessage('La URL de la imagen es obligatoria')
    .isURL().withMessage('Debe ser una URL válida. Ejemplo: https://ejemplo.com/imagen.jpg')
    .matches(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
    .withMessage('La URL debe terminar en: .jpg, .jpeg, .png, .gif, .webp o .svg')
    .isLength({ max: 500 }).withMessage('Máximo 500 caracteres')
    .trim(),
    
  // 7. threat_level: Nivel de amenaza UICN
  body('threat_level')
    .notEmpty().withMessage('El nivel de amenaza es obligatorio')
    .isIn(ALLOWED_THREAT_LEVELS)
    .withMessage(`Código UICN inválido. Valores permitidos: EX, CR, EN, VU, NT, LC, DD, NE`),
    
  // 8. Middleware para procesar errores
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const groupedErrors = {};
      errors.array().forEach(err => {
        if (!groupedErrors[err.path]) {
          groupedErrors[err.path] = [];
        }
        groupedErrors[err.path].push(err.msg);
      });
      
      return res.status(400).json({
        success: false,
        error: 'Error de validación',
        message: 'Por favor corrige los siguientes errores:',
        errors: groupedErrors,
        examples: {
          common_name: 'Carbonero común, Águila imperial ibérica',
          scientific_name: 'Parus major, Aquila adalberti',
          order: 'Passeriformes, Accipitriformes',
          family: 'Paridae, Accipitridae',
          description: 'Descripción detallada del ave (mínimo 20 caracteres)',
          image: 'https://ejemplo.com/imagen-ave.jpg',
          threat_level: 'LC (Preocupación menor), VU (Vulnerable), EN (En peligro)'
        },
        help: 'Todos los campos son obligatorios. Consulta los ejemplos para cada campo.'
      });
    }
    
    next();
  }
];

// =============================================================================================================================
// 2. VALIDACIÓN DE PARÁMETRO ID PARA RUTAS
// =============================================================================================================================

// Middleware para validar ID en parámetros de ruta
const validateIdParam = [
  // Validar que el ID sea un número entero positivo
  param('id')
    .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
    .toInt(),
    
  // Procesar resultados de validación
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro inválido',
        message: 'El ID proporcionado no es válido',
        errors: errors.array(),
        help: 'El ID debe ser un número entero positivo (ej: 1, 2, 3...)'
      });
    }
    
    next();
  }
];

// =============================================================================================================================
// 3. EXPORTAR MIDDLEWARES
// =============================================================================================================================

module.exports = {
  validateBird,
  validateIdParam,
  ALLOWED_THREAT_LEVELS
};