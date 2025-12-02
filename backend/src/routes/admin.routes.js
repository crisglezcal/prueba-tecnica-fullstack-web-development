/* 
🛣️ ROUTES → admin.routes.js
    * Rutas para administradores (CRUD completo de aves)
    * IMPORTANTE: Temporalmente sin auth para desarrollo
    * Cuando haya auth: verificar que el usuario tenga rol 'admin'
*/

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const { validateBird, validateIdParam } = require('../middlewares/validateBirds.middleware.js');
// const { authenticateToken, isAdmin } = require('../middlewares/auth.middleware.js'); // Para producción

// =============================================================================================================================
// RUTAS PARA ADMINISTRADORES (CRUD COMPLETO)
// =============================================================================================================================

// POST /admin/aves → Crear nueva ave (sólo admin)
    // http://localhost:3001/admin/aves
// router.post('/aves', authenticateToken, isAdmin, validateBird, adminController.createBird); // Con auth
router.post('/aves', validateBird, adminController.createBird); // Temporal sin auth

// PUT /admin/aves/:id → Actualizar ave existente (sólo admin)
    // http://localhost:3001/admin/aves/1
// router.put('/aves/:id', authenticateToken, isAdmin, validateIdParam, validateBird, adminController.updateBird); // Con auth
router.put('/aves/:id', validateIdParam, validateBird, adminController.updateBird); // Temporal sin auth

// DELETE /admin/aves/:id → Eliminar ave (sólo admin)
    // http://localhost:3001/admin/aves/1
// router.delete('/aves/:id', authenticateToken, isAdmin, validateIdParam, adminController.deleteBird); // Con auth
router.delete('/aves/:id', validateIdParam, adminController.deleteBird); // Temporal sin auth

module.exports = router;