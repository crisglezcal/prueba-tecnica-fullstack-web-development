/* 
🛣️ ROUTES → navarreviscaDetail.routes.js
    * Rutas para vista detalle y favoritos
*/

const express = require('express');
const router = express.Router();
const navarreviscaDetailController = require('../controllers/navarreviscaDetail.controller.js');
const { validateIdParam } = require('../middlewares/validateBirds.middleware.js');

// =============================================================================================================================
// 1. RUTAS PÚBLICAS
// =============================================================================================================================

// GET /aves/navarrevisca/detalle/:id → Ver detalle de un ave específica
// validateIdParam valida que el ID sea un número válido
    // http://localhost:3001/aves/navarrevisca/detalle/1
router.get('/:id', validateIdParam, navarreviscaDetailController.getAveDetail);

// =============================================================================================================================
// 2. RUTAS PROTEGIDAS (AUTENTICACIÓN REQUERIDA)
// =============================================================================================================================

// POST /aves/navarrevisca/detalle/:id/favoritos → Añadir ave a favoritos
// validateIdParam valida el ID + auth required
    // http://localhost:3001/aves/navarrevisca/detalle/1/favoritos
router.post('/:id/favoritos', validateIdParam, navarreviscaDetailController.addToFavorites); // Temporal sin auth
// router.post('/:id/favoritos', authenticateToken, validateIdParam, navarreviscaDetailController.addToFavorites); // Con auth

module.exports = router;