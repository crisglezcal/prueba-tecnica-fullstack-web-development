/* 
🛣️ NAVARREVISCA ROUTES → navarrevisca.routes.js
    * Rutas con validación express-validator (TODOS los campos requeridos)
*/

const express = require('express');
const router = express.Router();
const navarreviscaController = require('../controllers/navarrevisca.controller.js');
const { validateBird } = require('../middlewares/validateBirds.middleware.js');
const getAccessToken = require('../middlewares/getAccessToken.js');
const decodeToken = require('../middlewares/decodeToken.js');

// =============================================================================================================================
// 1. RUTA PÚBLICA (no requiere autenticación)
// =============================================================================================================================

/**
 * @swagger
 * /aves/navarrevisca:
 *   get:
 *     summary: Obtener todas las aves de Navarrevisca
 *     description: Devuelve la lista completa de aves registradas en la base de datos de Navarrevisca con opciones de filtrado y búsqueda.
 *     tags: [Aves - Navarrevisca]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término para buscar por nombre común, científico o familia
 *         example: "buitre"
 *       - in: query
 *         name: nivel_amenaza
 *         schema:
 *           type: string
 *           enum: [todos, LC, NT, VU, EN, CR]
 *           default: "todos"
 *         description: Filtrar por nivel de amenaza
 *         example: "LC"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de resultados a devolver
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de resultados a omitir (para paginación)
 *     responses:
 *       200:
 *         description: Lista de aves obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Aves de Navarrevisca obtenidas"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_bird:
 *                         type: integer
 *                         example: 1
 *                       common_name:
 *                         type: string
 *                         example: "Buitre leonado"
 *                       scientific_name:
 *                         type: string
 *                         example: "Gyps fulvus"
 *                       family:
 *                         type: string
 *                         example: "Accipitridae"
 *                       description:
 *                         type: string
 *                         example: "Ave rapaz de gran tamaño..."
 *                       image:
 *                         type: string
 *                         example: "https://ejemplo.com/imagen.jpg"
 *                       threat_level:
 *                         type: string
 *                         example: "LC"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 filtros:
 *                   type: object
 *                   properties:
 *                     search:
 *                       type: string
 *                     nivel_amenaza:
 *                       type: string
 *       500:
 *         description: Error interno del servidor
 */

// GET /aves/navarrevisca → Lista TODAS las aves
    // http://localhost:3001/aves/navarrevisca
router.get('/', navarreviscaController.getAves);

// =============================================================================================================================
// 2. RUTAS PROTEGIDAS (requieren autenticación)
// =============================================================================================================================

/**
 * @swagger
 * /aves/navarrevisca:
 *   post:
 *     summary: Crear nueva ave en Navarrevisca
 *     description: Crea un nuevo registro de ave en la base de datos de Navarrevisca. Requiere autenticación.
 *     tags: [Aves - Navarrevisca]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - common_name
 *               - scientific_name
 *               - family
 *               - description
 *               - threat_level
 *             properties:
 *               common_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Buitre leonado"
 *               scientific_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Gyps fulvus"
 *               family:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Accipitridae"
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: "Ave rapaz de gran tamaño, con envergadura de hasta 2.8 metros..."
 *               image:
 *                 type: string
 *                 format: uri
 *                 maxLength: 500
 *                 example: "https://ejemplo.com/imagen-buitre.jpg"
 *               threat_level:
 *                 type: string
 *                 enum: [LC, NT, VU, EN, CR]
 *                 example: "LC"
 *                 description: |
 *                   LC - Preocupación menor
 *                   NT - Casi amenazado  
 *                   VU - Vulnerable
 *                   EN - En peligro
 *                   CR - En peligro crítico
 *     responses:
 *       201:
 *         description: Ave creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Ave creada correctamente en Navarrevisca"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_bird:
 *                       type: integer
 *                       example: 25
 *                     common_name:
 *                       type: string
 *                     scientific_name:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Error de validación - Datos incompletos o inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "common_name"
 *                       message:
 *                         type: string
 *                         example: "El nombre común es requerido"
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos suficientes
 *       500:
 *         description: Error interno del servidor
 */

// POST /aves/navarrevisca → Crear nueva ave
// validateBird verifica que TODOS los campos estén presentes y sean válidos
    // http://localhost:3001/aves/navarrevisca
router.post('/', getAccessToken, decodeToken, validateBird, navarreviscaController.createAve);

module.exports = router;