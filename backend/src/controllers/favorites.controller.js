/* 
🎮 FAVORITES CONTROLLER → favorites.controller.js - VERSIÓN CORREGIDA
    * Controlador para gestionar favoritos del usuario
    * Auth: userId obtenido del token JWT
*/

const favoritesModel = require('../models/favorites.model.js');
const favoritesOperation = require('../utils/favorites.utils.js');

// ========================================================================================================================================  
// 1. GET MIS FAVORITOS - CORREGIDO
// ========================================================================================================================================  

async function getMyFavorites(req, res) {
  try {
    // Obtiene userId del token decodificado - CORREGIDO: usar req.user
    if (!req.user || !req.user.id_user) {
      return res.status(401).json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para ver tus favoritos'
      });
    }
    
    // Extrae información del usuario de req.user
    const userId = req.user.id_user;
    const userEmail = req.user.email;
    const userRole = req.user.role;
    
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
    // Error 500: Error interno del servidor
    res.status(500).json({
      success: false,
      error: 'Error al obtener favoritos',
      message: error.message
    });
  }
}

// ========================================================================================================================================  
// 2. ELIMINAR DE FAVORITOS - CORREGIDO
// ========================================================================================================================================  

async function removeFavorite(req, res) {
  try {
    // Obtiene ID del favorito desde los parámetros de la URL
    const favoriteId = parseInt(req.params.id);
    
    // Verifica token y obtiene userId - CORREGIDO: usar req.user
    if (!req.user || !req.user.id_user) {
      return res.status(401).json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para eliminar favoritos'
      });
    }
    
    const userId = req.user.id_user;
    const userEmail = req.user.email;
    
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