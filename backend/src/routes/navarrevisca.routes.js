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

// GET /aves/navarrevisca → Lista TODAS las aves
    // http://localhost:3001/aves/navarrevisca
router.get('/', navarreviscaController.getAves);

// =============================================================================================================================
// 2. RUTAS PROTEGIDAS (requieren autenticación)
// =============================================================================================================================

// POST /aves/navarrevisca → Crear nueva ave
// validateBird verifica que TODOS los campos estén presentes y sean válidos
    // http://localhost:3001/aves/navarrevisca
router.post('/', getAccessToken, decodeToken, validateBird, navarreviscaController.createAve);

module.exports = router;