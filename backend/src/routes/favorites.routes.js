/* 
🛣️ ROUTES → favorites.routes.js
    * Rutas para gestionar favoritos del usuario
    * TODAS requieren autenticación
*/

const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller.js');
const { validateIdParam } = require('../middlewares/validateBirds.middleware.js');
// const { authenticateToken } = require('../middlewares/auth.middleware.js'); // Middleware de autenticación (REVISAR)

// =================================================================================================
// RUTAS PROTEGIDAS (AUTENTICACIÓN REQUERIDA - REVISAR)
// =================================================================================================

// // GET /favoritos → Ver todas mis aves favoritas
//     // http://localhost:3001/favoritos
// router.get('/', authenticateToken, favoritesController.getMyFavorites); // Con auth

// // DELETE /favoritos/:id → Eliminar un ave de mis favoritos
//     // http://localhost:3001/favoritos/:id
// router.delete('/:id', authenticateToken, validateIdParam, favoritesController.removeFavorite); // Con auth

// =================================================================================================
// VERSIÓN TEMPORAL PARA DESARROLLO (SIN AUTH)
// =================================================================================================

// GET /favoritos → Ver todas mis aves favoritas
    // http://localhost:3001/favoritos
router.get('/', favoritesController.getMyFavorites); // Temporal sin auth

// DELETE /favoritos/:id → Eliminar un ave de mis favoritos
    // http://localhost:3001/favoritos/:id
router.delete('/:id', validateIdParam, favoritesController.removeFavorite); // Temporal sin auth

module.exports = router;