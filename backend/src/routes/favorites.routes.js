/* 
🛣️ FAVORITES ROUTES → favorites.routes.js
    * Rutas para gestionar favoritos del usuario
    * TODAS requieren autenticación
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

// // GET /favoritos → Ver todas mis aves favoritas
//     // http://localhost:3001/favoritos
router.get('/', getAccessToken, decodeToken, userRoutes, favoritesController.getMyFavorites); 

// // DELETE /favoritos/:id → Eliminar un ave de mis favoritos
//     // http://localhost:3001/favoritos/:id
router.delete('/:id', getAccessToken, decodeToken, userRoutes, validateIdParam, favoritesController.removeFavorite);

// =================================================================================================
// VERSIÓN TEMPORAL PARA DESARROLLO (SIN AUTH)
// =================================================================================================

// // GET /favoritos → Ver todas mis aves favoritas
//     // http://localhost:3001/favoritos
// router.get('/', favoritesController.getMyFavorites); // Temporal sin auth

// // DELETE /favoritos/:id → Eliminar un ave de mis favoritos
//     // http://localhost:3001/favoritos/:id
// router.delete('/:id', validateIdParam, favoritesController.removeFavorite); // Temporal sin auth

module.exports = router;