/* 
🛣️ FAVORITES ROUTES → favorites.routes.js
    * Rutas para gestionar favoritos del usuario
    * TODAS requieren autenticación
    * Documentación con Swagger
*/

const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller.js');
const { validateIdParam } = require('../middlewares/validateBirds.middleware.js');
const getAccessToken = require('../middlewares/getAccessToken.js');
const decodeToken = require('../middlewares/decodeToken.js');
const userRoutes = require('../middlewares/auth.client.middleware.js');

// =============================================================================================================================
// 1. RUTAS PROTEGIDAS (requieren autenticación)
// =============================================================================================================================

/**
 * @swagger
 * /favoritos:
 *   get:
 *     summary: Obtener todas mis aves favoritas
 *     description: Devuelve la lista completa de aves que el usuario ha marcado como favoritas.
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término para buscar por nombre común, científico o familia
 *       - in: query
 *         name: nivel_amenaza
 *         schema:
 *           type: string
 *           enum: [todos, LC, NT, VU, EN, CR]
 *         description: Filtrar por nivel de amenaza
 *     responses:
 *       200:
 *         description: Lista de aves favoritas obtenida exitosamente
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
 *                   example: "Tus aves favoritas (5)"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_favorito:
 *                         type: integer
 *                         example: 1
 *                       id_ave:
 *                         type: integer
 *                         example: 3
 *                       ave_info:
 *                         type: object
 *                         properties:
 *                           nombre_comun:
 *                             type: string
 *                             example: "Buitre leonado"
 *                           nombre_cientifico:
 *                             type: string
 *                             example: "Gyps fulvus"
 *                           familia:
 *                             type: string
 *                             example: "Accipitridae"
 *                           imagen:
 *                             type: string
 *                             example: "https://ejemplo.com/imagen.jpg"
 *                           nivel_amenaza:
 *                             type: string
 *                             example: "LC"
 *                 total:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', getAccessToken, decodeToken, userRoutes, favoritesController.getMyFavorites); 

/**
 * @swagger
 * /favoritos/{id}:
 *   delete:
 *     summary: Eliminar un ave de mis favoritos
 *     description: Elimina un ave específica de la lista de favoritos del usuario.
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del favorito a eliminar
 *     responses:
 *       200:
 *         description: Ave eliminada de favoritos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 id_favorito_eliminado:
 *                   type: integer
 *                   example: 1
 *                 id_usuario:
 *                   type: integer
 *                   example: 1
 *                 mensaje:
 *                   type: string
 *                   example: "Ave eliminada de favoritos correctamente"
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Favorito no encontrado o ya eliminado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', getAccessToken, decodeToken, userRoutes, validateIdParam, favoritesController.removeFavorite);

module.exports = router;