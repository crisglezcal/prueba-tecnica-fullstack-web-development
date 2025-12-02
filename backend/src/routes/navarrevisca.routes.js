/* 
🛣️ ROUTES → navarrevisca.routes.js
    * Rutas con validación express-validator (TODOS los campos requeridos)
*/

const express = require('express');
const router = express.Router();
const navarreviscaController = require('../controllers/navarrevisca.controller.js');
const { validateBird } = require('../middlewares/validateBirds.middleware.js');

// =============================================================================================================================
// 1. RUTA PÚBLICA
// =============================================================================================================================

// GET /aves/navarrevisca → Lista TODAS las aves
    // http://localhost:3001/aves/navarrevisca
router.get('/', navarreviscaController.getAves);

// =============================================================================================================================
// 2. RUTA PROTEGIDA CON VALIDACIÓN (TODOS LOS CAMPOS REQUERIDOS)
// =============================================================================================================================

// POST /aves/navarrevisca → Crear nueva ave
// validateBird verifica que TODOS los campos estén presentes y sean válidos
    // http://localhost:3001/aves/navarrevisca
router.post('/', validateBird, navarreviscaController.createAve); // Temporal sin auth
// router.post('/', authenticateToken, validateBird, navarreviscaController.createAve); // Con auth

module.exports = router;