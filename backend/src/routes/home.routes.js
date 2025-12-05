/* 
🛣️ HOME ROUTES (Rutas) → home.routes.js
    * Define UNA sola ruta: GET /
*/

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller.js');

// =============================================================================================================================
// 1. RUTA PÚBLICA (no requiere autenticación)
// =============================================================================================================================

/**
 * @swagger
 * /:
 *   get:
 *     summary: Página de inicio de la API
 *     description: Devuelve información básica sobre la API y sus endpoints disponibles.
 *     tags: [Inicio]
 *     responses:
 *       200:
 *         description: Información de la API obtenida exitosamente
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
 *                   example: "¡Bienvenido a la API de Aves de Navarrevisca!"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 description:
 *                   type: string
 *                   example: "API para la gestión y observación de aves en Navarrevisca y Sierra de Gredos"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     aves:
 *                       type: string
 *                       example: "/aves/navarrevisca"
 *                     favoritos:
 *                       type: string
 *                       example: "/favoritos"
 *                     autenticacion:
 *                       type: string
 *                       example: "/auth"
 *                     ebird:
 *                       type: string
 *                       example: "/api/avila/observations"
 *                 documentation:
 *                   type: string
 *                   example: "/api-docs"
 *       500:
 *         description: Error interno del servidor
 */

// PÁGINA DE INICIO
    // http://localhost:3001/
router.get('/', homeController.getHome);

module.exports = router;