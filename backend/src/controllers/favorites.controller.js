/* 
🎮 CONTROLLER → favorites.controller.js
    * Controlador para gestionar favoritos del usuario
    * NOTA: userId está temporalmente como 1 hasta implementar auth
*/

const favoritesService = require('../services/favorites.service.js');
const favoritesModel = require('../models/favorites.model.js');

// =================================================================================================
// 1. GET MIS FAVORITOS
// =================================================================================================

async function getMyFavorites(req, res) {
  try {
    // TEMPORAL: usuario fijo hasta implementar auth
    // const userId = req.user?.id;
    // if (!userId) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Autenticación requerida'
    //   });
    // }
    const userId = 1; // TEMPORAL
    
    console.log(`Controller: GET /favoritos para usuario ${userId}`);
    
    const favorites = await favoritesService.getUserFavoritesWithDetails(userId);
    
    const formattedFavorites = favoritesModel.formatFavoritesList(favorites);
    
    res.json({
      success: true,
      message: `Tus aves favoritas (${formattedFavorites.length})`,
      data: formattedFavorites,
      total: formattedFavorites.length,
      user_id: userId,
      auth_status: 'temp_user' // Indica que es usuario temporal
    });
    
  } catch (error) {
    console.error('Controller error en getMyFavorites:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error al obtener favoritos',
      message: error.message
    });
  }
}

// =================================================================================================
// 2. ELIMINAR DE FAVORITOS
// =================================================================================================

async function removeFavorite(req, res) {
  try {
    const favoriteId = parseInt(req.params.id);
    
    // TEMPORAL: usuario fijo hasta implementar auth
    // const userId = req.user?.id;
    // if (!userId) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Autenticación requerida'
    //   });
    // }
    const userId = 1; // TEMPORAL
    
    console.log(`Controller: DELETE /favoritos/${favoriteId} para usuario ${userId}`);
    
    const result = await favoritesService.removeFavorite(favoriteId, userId);
    
    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.message || 'Favorito no encontrado',
        user_id: userId,
        favorite_id: favoriteId,
        auth_status: 'temp_user'
      });
    }
    
    const formattedResponse = favoritesModel.formatRemoveResponse(favoriteId, userId);
    
    res.json({
      success: true,
      ...formattedResponse,
      metadata: {
        timestamp: new Date().toISOString(),
        auth_status: 'temp_user' // Indica que es usuario temporal
      }
    });
    
  } catch (error) {
    console.error(`Controller error en removeFavorite:`, error);
    
    res.status(500).json({
      success: false,
      error: 'Error al eliminar de favoritos',
      message: error.message
    });
  }
}

// Exportar funciones
module.exports = {
  getMyFavorites,
  removeFavorite
};