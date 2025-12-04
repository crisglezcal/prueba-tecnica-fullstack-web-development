/* 
🛣️ ADMIN ROUTES → admin.routes.js
    * Rutas para administradores (CRUD completo de aves)
    * IMPORTANTE: Temporalmente sin auth para desarrollo
    * Cuando haya auth: verificar que el usuario tenga rol 'admin'
*/

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const { validateBird, validateIdParam } = require('../middlewares/validateBirds.middleware.js');
const getAccessToken = require('../middlewares/getAccessToken.js');
const decodeToken = require('../middlewares/decodeToken.js');
const adminRoutes = require('../middlewares/auth.admin.middleware.js'); 

// =============================================================================================================================
// 1. RUTAS PROTEGIDAS (requieren autenticación)
// =============================================================================================================================

// POST /admin/aves → Crear nueva ave (sólo admin)
    // http://localhost:3001/admin/aves
router.post('/aves', getAccessToken, decodeToken, adminRoutes, validateBird, adminController.createBird);

// PUT /admin/aves/:id → Actualizar ave existente (sólo admin)
    // http://localhost:3001/admin/aves/1
router.put('/aves/:id', getAccessToken, decodeToken, adminRoutes,validateIdParam, validateBird, adminController.updateBird); 

// DELETE /admin/aves/:id → Eliminar ave (sólo admin)
    // http://localhost:3001/admin/aves/1
router.delete('/aves/:id', getAccessToken, decodeToken, adminRoutes,validateIdParam, adminController.deleteBird);

// PRUEBA DE RUTA PROTEGIDA
router.get('/test-auth', getAccessToken, decodeToken, adminRoutes, (req, res) => {
    res.json({
        success: true,
        message: 'Autenticación exitosa',
        user: req.user
    });
});

module.exports = router;