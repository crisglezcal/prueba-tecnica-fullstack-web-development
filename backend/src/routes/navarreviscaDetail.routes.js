/* 
🛣️ NAVARREVISCA-DETAIL ROUTES → navarreviscaDetail.routes.js
    * Rutas para vista detalle y favoritos
*/

const express = require('express');
const router = express.Router();
const navarreviscaDetailController = require('../controllers/navarreviscaDetail.controller.js');
const { validateIdParam } = require('../middlewares/validateBirds.middleware.js');
const getAccessToken = require('../middlewares/getAccessToken.js');
const decodeToken = require('../middlewares/decodeToken.js');
const userRoutes = require('../middlewares/auth.client.middleware.js');

// =============================================================================================================================
// 1. RUTAS PÚBLICAS
// =============================================================================================================================

/**
 * @swagger
 * /aves/navarrevisca/detalle/{id}:
 *   get:
 *     summary: Obtener detalles de un ave específica
 *     description: Devuelve información detallada de un ave específica, incluyendo si está marcada como favorita para el usuario autenticado.
 *     tags: [Aves - Detalle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del ave a consultar
 *         example: 1
 *     responses:
 *       200:
 *         description: Detalles del ave obtenidos exitosamente
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
 *                   example: "Detalles de 'Buitre leonado'"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre_comun:
 *                       type: string
 *                       example: "Buitre leonado"
 *                     nombre_cientifico:
 *                       type: string
 *                       example: "Gyps fulvus"
 *                     orden:
 *                       type: string
 *                       example: "Accipitriformes"
 *                     familia:
 *                       type: string
 *                       example: "Accipitridae"
 *                     descripcion_completa:
 *                       type: string
 *                       example: "Descripción detallada del ave..."
 *                     imagen:
 *                       type: string
 *                       example: "https://ejemplo.com/imagen.jpg"
 *                     nivel_amenaza:
 *                       type: string
 *                       example: "LC"
 *                     es_favorito:
 *                       type: boolean
 *                       example: false
 *                       description: "Indica si el usuario autenticado tiene esta ave como favorita"
 *                 user:
 *                   type: object
 *                   nullable: true
 *                   description: "Información del usuario si está autenticado"
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Ave no encontrada
 *       500:
 *         description: Error interno del servidor
 */

// GET /aves/navarrevisca/detalle/:id → Ver detalle de un ave específica
// validateIdParam valida que el ID sea un número válido
    // http://localhost:3001/aves/navarrevisca/detalle/1
router.get('/:id', validateIdParam, navarreviscaDetailController.getAveDetail);

// =============================================================================================================================
// 2. RUTAS PROTEGIDAS (AUTENTICACIÓN REQUERIDA)
// =============================================================================================================================

/**
 * @swagger
 * /aves/navarrevisca/detalle/{id}/favoritos:
 *   post:
 *     summary: Añadir ave a favoritos
 *     description: Añade un ave específica a la lista de favoritos del usuario autenticado.
 *     tags: [Aves - Favoritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del ave a añadir a favoritos
 *         example: 1
 *     responses:
 *       201:
 *         description: Ave añadida a favoritos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Ave añadida a favoritos correctamente"
 *                 id_favorito:
 *                   type: integer
 *                   example: 15
 *                 id_ave:
 *                   type: integer
 *                   example: 1
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     email:
 *                       type: string
 *                       example: "usuario@ejemplo.com"
 *                 ave:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre_comun:
 *                       type: string
 *                       example: "Buitre leonado"
 *                     nombre_cientifico:
 *                       type: string
 *                       example: "Gyps fulvus"
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Ave no encontrada
 *       409:
 *         description: El ave ya está en favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Ya en favoritos"
 *                 message:
 *                   type: string
 *                   example: "Esta ave ya está en tus favoritos"
 *       500:
 *         description: Error interno del servidor
 */

// POST /aves/navarrevisca/detalle/:id/favoritos → Añadir ave a favoritos
// validateIdParam valida el ID + auth required
    // http://localhost:3001/aves/navarrevisca/detalle/1/favoritos
router.post('/:id/favoritos', getAccessToken, decodeToken, userRoutes, validateIdParam, navarreviscaDetailController.addToFavorites);

module.exports = router;