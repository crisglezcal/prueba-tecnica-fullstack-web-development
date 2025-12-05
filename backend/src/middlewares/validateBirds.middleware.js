/* 
✅ EXPRESS VALIDATOR → validateBirds.middlewares.js
    * Validación con mensajes de ayuda claros en castellano
    * Versiones para CREAR y ACTUALIZAR

VALIDACIONES DETALLADAS:
1. common_name (Nombre común):
  - Obligatorio en creación
  - 2-150 caracteres
  - Regex: /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s0-9.'-]+$/u
  - Permite: Letras, números, espacios, apóstrofes, puntos, guiones
  - Ejemplos que pasan: "Pardillo común", "Gaviota tridáctila", "Dr. Bird's"
  - Escapado: .trim().escape() para seguridad

2. scientific_name (Nombre científico):
  - Formato: Género especie (primera letra mayúscula)
  - Permite subespecies: Parus major major
  - Permite híbridos: × y abreviaturas: &
  - 3-200 caracteres

3. Taxonomía::
  - Solo letras, espacios y guiones
  - 3-100 caracteres
  - Caracteres Unicode para acentos internacionales

4. description (Descripción):
  - 20-2000 caracteres (buen rango)
  - Sanitización de espacios múltiples
  - Escapado HTML para seguridad

5. image (URL de imagen):
  - URL válida con protocolo http/https
  - Extensión válida: .jpg, .jpeg, .png, .gif, .webp, .svg
  - Ignora query params y fragments: image.jpg?width=300#section
  Máximo 500 caracteres

6. threat_level (Nivel de amenaza UICN):
  - Solo valores permitidos: EX, CR, EN, VU, NT, LC, DD, NE
  - Validación estricta con mensaje claro

7. validateBirdUpdate (Actualización):
  - Todos los campos opcionales con .optional({ checkFalsy: true })
  - Mismas validaciones que creación si se envían

8. validateIdParam (ID):
  - Número entero positivo
  - Convierte a número con .toInt()
*/

const { body, param, validationResult } = require('express-validator');

// Niveles de amenaza permitidos (códigos UICN)
const ALLOWED_THREAT_LEVELS = ['EX', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'];

// =============================================================================================================================
// 1. VALIDACIÓN PARA CREAR AVES (TODOS LOS CAMPOS OBLIGATORIOS)
// =============================================================================================================================

const validateBird = [
  // 1. common_name
  body('common_name')
    .notEmpty().withMessage('El nombre común es obligatorio')
    .isLength({ min: 2, max: 150 }).withMessage('El nombre común debe tener entre 2 y 150 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s0-9.'-]+$/u)
    .withMessage('Solo letras, números, espacios, guiones, apóstrofes y puntos')
    .trim()
    .escape(),
    
  // 2. scientific_name
  body('scientific_name')
    .notEmpty().withMessage('El nombre científico es obligatorio')
    .isLength({ min: 3, max: 200 }).withMessage('Debe tener entre 3 y 200 caracteres')
    .matches(/^[A-ZÀ-ÿ][a-zà-ÿ]*(?:\s+[a-zà-ÿ.\-×&]+)+$/u)
    .withMessage('Formato: Género (mayúscula) y especie (minúscula). Ej: "Parus major"')
    .trim()
    .escape(),
    
  // 3. order
  body('order')
    .notEmpty().withMessage('El orden taxonómico es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('Debe tener entre 3 y 100 caracteres')
    .matches(/^[A-Za-zÀ-ÿ\s-]+$/u)
    .withMessage('Solo letras, espacios y guiones')
    .trim()
    .escape(),
    
  // 4. family
  body('family')
    .notEmpty().withMessage('La familia taxonómica es obligatoria')
    .isLength({ min: 3, max: 100 }).withMessage('Debe tener entre 3 y 100 caracteres')
    .matches(/^[A-Za-zÀ-ÿ\s-]+$/u)
    .withMessage('Solo letras, espacios y guiones')
    .trim()
    .escape(),
    
  // 5. description
  body('description')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 20, max: 2000 }).withMessage('La descripción debe tener entre 20 y 2000 caracteres')
    .trim()
    .escape()
    .customSanitizer(value => value.replace(/\s+/g, ' ')),
    
  // 6. image
  body('image')
    .notEmpty().withMessage('La URL de la imagen es obligatoria')
    .isURL({
      protocols: ['http', 'https'],
      require_protocol: true
    }).withMessage('Debe ser una URL válida con http:// o https://')
    .custom((value) => {
      const urlPath = value.split('?')[0].split('#')[0];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      if (!validExtensions.some(ext => urlPath.toLowerCase().endsWith(ext))) {
        throw new Error(`La imagen debe terminar en: ${validExtensions.join(', ')}`);
      }
      return true;
    })
    .isLength({ max: 500 }).withMessage('Máximo 500 caracteres')
    .trim(),
    
  // 7. threat_level
  body('threat_level')
    .notEmpty().withMessage('El nivel de amenaza es obligatorio')
    .isIn(ALLOWED_THREAT_LEVELS)
    .withMessage(`Código UICN inválido. Valores permitidos: ${ALLOWED_THREAT_LEVELS.join(', ')}`),
    
  // Middleware de errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const groupedErrors = {};
      errors.array().forEach(err => {
        if (!groupedErrors[err.path]) groupedErrors[err.path] = [];
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
          order: 'Passeriformes',
          family: 'Paridae',
          description: 'Descripción del ave...',
          image: 'https://ejemplo.com/imagen.jpg',
          threat_level: 'LC, EN, VU...'
        }
      });
    }
    next();
  }
];

// =============================================================================================================================
// 2. VALIDACIÓN PARA ACTUALIZAR AVES (CAMPOS OPCIONALES)
// =============================================================================================================================

const validateBirdUpdate = [
  // 1. common_name
  body('common_name')
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 150 })
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s0-9.'-]+$/u) // REGEX CORREGIDA
    .trim()
    .escape(),
    
  // 2. scientific_name
  body('scientific_name')
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 200 })
    .matches(/^[A-ZÀ-ÿ][a-zà-ÿ]*(?:\s+[a-zà-ÿ.\-×&]+)+$/u)
    .trim()
    .escape(),
    
  // 3. order
  body('order')
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 100 })
    .matches(/^[A-Za-zÀ-ÿ\s-]+$/u)
    .trim()
    .escape(),
    
  // 4. family
  body('family')
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 100 })
    .matches(/^[A-Za-zÀ-ÿ\s-]+$/u)
    .trim()
    .escape(),
    
  // 5. description
  body('description')
    .optional({ checkFalsy: true })
    .isLength({ min: 20, max: 2000 })
    .trim()
    .escape()
    .customSanitizer(value => value.replace(/\s+/g, ' ')),
    
  // 6. image
  body('image')
    .optional({ checkFalsy: true })
    .isURL({
      protocols: ['http', 'https'],
      require_protocol: true
    })
    .custom((value) => {
      const urlPath = value.split('?')[0].split('#')[0];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      if (!validExtensions.some(ext => urlPath.toLowerCase().endsWith(ext))) {
        throw new Error(`La imagen debe terminar en: ${validExtensions.join(', ')}`);
      }
      return true;
    })
    .isLength({ max: 500 })
    .trim(),
    
  // 7. threat_level
  body('threat_level')
    .optional({ checkFalsy: true })
    .isIn(ALLOWED_THREAT_LEVELS),
    
  // Middleware de errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const groupedErrors = {};
      errors.array().forEach(err => {
        if (!groupedErrors[err.path]) groupedErrors[err.path] = [];
        groupedErrors[err.path].push(err.msg);
      });

      return res.status(400).json({
        success: false,
        error: 'Error de validación',
        message: 'Por favor corrige los siguientes errores:',
        errors: groupedErrors
      });
    }
    next();
  }
];

// =============================================================================================================================
// 3. VALIDACIÓN DE PARÁMETRO ID
// =============================================================================================================================

const validateIdParam = [
  param('id')
    .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
    .toInt(),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro inválido',
        message: 'El ID proporcionado no es válido',
        errors: errors.array()
      });
    }
    next();
  }
];

// =============================================================================================================================
// 4. EXPORTACIONES
// =============================================================================================================================

module.exports = {
  validateBird,
  validateBirdUpdate,
  validateIdParam,
  ALLOWED_THREAT_LEVELS
};
