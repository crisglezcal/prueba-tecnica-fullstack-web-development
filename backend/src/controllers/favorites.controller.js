/* 
🎮 FAVORITES CONTROLLER → favorites.controller.js
    * Controlador para gestionar favoritos del usuario
    * Auth: userId obtenido del token JWT
*/

const favoritesModel = require('../models/favorites.model.js');
const favoritesOperation = require('../utils/favorites.utils.js');

// ========================================================================================================================================  
// 1. GET MIS FAVORITOS
// ========================================================================================================================================  

async function getMyFavorites(req, res) {
  try {
    // Obtiene userId del token decodificado
      // Verifica que el token sea válido y contenga ID de usuario
    if (!req.token || !req.token.id) {
      return res.status(401).json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Token no válido o expirado'
      });
    }
    
    // Extrae información del usuario del token
    const userId = req.token.id;
    const userEmail = req.token.email;
    const userRole = req.token.role;
    
    console.log(`Controller: GET /favoritos para usuario ${userId} (${userEmail}, ${userRole})`);
    
    // Obtiene favoritos del usuario con detalles completos de las aves
    const favorites = await favoritesModel.getUserFavoritesWithDetails(userId);
    
    // Formatea la lista de favoritos para la respuesta
    const formattedFavorites = favoritesOperation.formatFavoritesList(favorites);
    
    // Envia respuesta exitosa
    res.json({
      success: true,
      message: `Tus aves favoritas (${formattedFavorites.length})`,
      data: formattedFavorites,      
      total: formattedFavorites.length, 
      user: {
        id: userId,
        email: userEmail,
        role: userRole
      }
    });
    
  } catch (error) {
    console.error('Controller error en getMyFavorites:', error);
    
    // Error 500: Error interno del servidor
    res.status(500).json({
      success: false,
      error: 'Error al obtener favoritos',
      message: error.message
    });
  }
}

// ========================================================================================================================================  
// 2. ELIMINAR DE FAVORITOS
// ========================================================================================================================================  

async function removeFavorite(req, res) {
  try {
    // Obtiene ID del favorito desde los parámetros de la URL
    const favoriteId = parseInt(req.params.id);
    
    // Verifica token y obtiene userId
    if (!req.token || !req.token.id) {
      return res.status(401).json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Token no válido o expirado'
      });
    }
    
    const userId = req.token.id;
    const userEmail = req.token.email;
    
    console.log(`Controller: DELETE /favoritos/${favoriteId} para usuario ${userId} (${userEmail})`);
    
    // Elimina favorito a través del servicio
    const result = await favoritesModel.removeFavorite(favoriteId, userId);
    
    // Verifica si la eliminación fue exitosa
    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.message || 'Favorito no encontrado',
        user_id: userId,
        favorite_id: favoriteId
      });
    }
    
    // Formatea respuesta de eliminación
    const formattedResponse = favoritesOperation.formatRemoveResponse(favoriteId, userId);
    
    // Envia respuesta exitosa
    res.json({
      success: true,
      ...formattedResponse,
      user: {
        id: userId,
        email: userEmail
      }
    });
    
  } catch (error) {
    console.error(`Controller error en removeFavorite:`, error);
    
    // Error 500: Error interno del servidor
    res.status(500).json({
      success: false,
      error: 'Error al eliminar de favoritos',
      message: error.message
    });
  }
}

// Exportar funciones del controlador
module.exports = {
  getMyFavorites,
  removeFavorite
};