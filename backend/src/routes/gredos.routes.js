/*
🛣️ GREDOS ROUTES (Rutas) → gredos.routes.js
    * Define las URL (endpoints) de tu API
    * Conecta URLs con funciones del controller
    * Configura verbos HTTP (GET, POST, PUT, DELETE)
*/

const express = require('express');
const router = express.Router();
const gredosController = require('../controllers/gredos.controller.js');

// =============================================================================================================================
// 1. RUTAS PÚBLICAS (no requieren autenticación)
// =============================================================================================================================

/**
 * @swagger
 * /api/avila/observations:
 *   get:
 *     summary: Obtener observaciones de aves en Ávila/Gredos
 *     description: Devuelve observaciones recientes de aves en la Sierra de Gredos desde la API de eBird.
 *     tags: [eBird - Observaciones]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 30
 *           default: 7
 *         description: Número de días hacia atrás para buscar observaciones
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 30
 *         description: Número máximo de observaciones a devolver
 *       - in: query
 *         name: hotspot
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Filtrar solo observaciones en hotspots
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitud para buscar observaciones cercanas (opcional)
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitud para buscar observaciones cercanas (opcional)
 *     responses:
 *       200:
 *         description: Observaciones obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 region:
 *                   type: string
 *                   example: "Ávila"
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 datos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       comName:
 *                         type: string
 *                         example: "Great Tit"
 *                       sciName:
 *                         type: string
 *                         example: "Parus major"
 *                       locName:
 *                         type: string
 *                         example: "Sierra de Gredos"
 *                       obsDt:
 *                         type: string
 *                         example: "2024-01-15 08:30"
 *                       howMany:
 *                         type: integer
 *                         example: 3
 *                       lat:
 *                         type: number
 *                         format: float
 *                         example: 40.2500
 *                       lng:
 *                         type: number
 *                         format: float
 *                         example: -5.2525
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     dias:
 *                       type: integer
 *                       example: 7
 *                     limite:
 *                       type: integer
 *                       example: 30
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Error al obtener observaciones de eBird
 */
router.get('/observations', gredosController.getObservations);

/**
 * @swagger
 * /api/avila/species:
 *   get:
 *     summary: Obtener lista de especies de Ávila
 *     description: Devuelve la lista completa de especies de aves observadas en Ávila desde eBird.
 *     tags: [eBird - Especies]
 *     responses:
 *       200:
 *         description: Lista de especies obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 region:
 *                   type: string
 *                   example: "Ávila"
 *                 totalEspecies:
 *                   type: integer
 *                   example: 150
 *                 especies:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "butbut"
 *       500:
 *         description: Error al obtener especies de eBird
 */
router.get('/species', gredosController.getSpecies);

/**
 * @swagger
 * /api/avila/species/search:
 *   get:
 *     summary: Buscar especie por nombre
 *     description: Busca especies de aves por nombre común o científico.
 *     tags: [eBird - Búsqueda]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Término de búsqueda (nombre común o científico)
 *     responses:
 *       200:
 *         description: Resultados de búsqueda obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 busqueda:
 *                   type: string
 *                   example: "águila"
 *                 resultados:
 *                   type: integer
 *                   example: 5
 *                 datos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       comName:
 *                         type: string
 *                         example: "Golden Eagle"
 *                       sciName:
 *                         type: string
 *                         example: "Aquila chrysaetos"
 *                       speciesCode:
 *                         type: string
 *                         example: "goleag"
 *       400:
 *         description: Parámetro de búsqueda requerido
 *       500:
 *         description: Error al buscar especies
 */
router.get('/species/search', gredosController.searchSpecies);

/**
 * @swagger
 * /api/avila/species/{code}:
 *   get:
 *     summary: Obtener información detallada de una especie
 *     description: Devuelve información detallada de una especie específica y sus observaciones recientes en Ávila.
 *     tags: [eBird - Detalles]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de la especie (ej: "butbut" para Buteo buteo)
 *     responses:
 *       200:
 *         description: Información de especie obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 especie:
 *                   type: object
 *                   properties:
 *                     comName:
 *                       type: string
 *                       example: "Common Buzzard"
 *                     sciName:
 *                       type: string
 *                       example: "Buteo buteo"
 *                     speciesCode:
 *                       type: string
 *                       example: "comuzz"
 *                     category:
 *                       type: string
 *                       example: "species"
 *                 observacionesRecientes:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 10
 *                     datos:
 *                       type: array
 *                       items:
 *                         type: object
 *                 metadata:
 *                   type: object
 *       404:
 *         description: Especie no encontrada
 *       500:
 *         description: Error al obtener detalles de la especie
 */
router.get('/species/:code', gredosController.getSpeciesDetail);

/**
 * @swagger
 * /api/avila/hotspots:
 *   get:
 *     summary: Obtener puntos calientes de observación
 *     description: Devuelve los hotspots (puntos calientes) de observación de aves en Ávila.
 *     tags: [eBird - Hotspots]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitud para buscar hotspots cercanos (opcional)
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitud para buscar hotspots cercanos (opcional)
 *       - in: query
 *         name: dist
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Distancia en kilómetros para búsqueda por coordenadas
 *     responses:
 *       200:
 *         description: Hotspots obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 region:
 *                   type: string
 *                   example: "Ávila"
 *                 totalPuntos:
 *                   type: integer
 *                   example: 45
 *                 puntosCalientes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       locId:
 *                         type: string
 *                         example: "L1234567"
 *                       name:
 *                         type: string
 *                         example: "Sierra de Gredos"
 *                       latitude:
 *                         type: number
 *                         format: float
 *                       longitude:
 *                         type: number
 *                         format: float
 *       500:
 *         description: Error al obtener hotspots
 */
router.get('/hotspots', gredosController.getHotspots);

module.exports = router;