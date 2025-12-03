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

// PÁGINA DE INICIO
    // http://localhost:3001/
router.get('/', homeController.getHome);

module.exports = router;