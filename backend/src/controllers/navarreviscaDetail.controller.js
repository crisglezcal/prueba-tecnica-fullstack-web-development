/* 
🎮 NAVARREVISCA-DETAIL CONTROLLER → navarreviscaDetail.controller.js
    * Controlador para vista detalle y favoritos
    * Auth: userId obtenido del token JWT
*/

const navarreviscaModel = require('../models/navarrevisca.model.js');
const favoritesModel = require('../models/favorites.model.js');
const navarreviscaDetailOperation = require('../utils/navarreviscaDetail.utils.js');

// ========================================================================================================================================  
// 1. GET DETALLE DE AVE 
// ========================================================================================================================================  

async function getAveDetail(req, res) {
  try {
    // Obtiene ID del ave desde los parámetros de la URL
    const birdId = parseInt(req.params.id);
    
    // Obtiene información completa del ave desde el servicio
    const bird = await navarreviscaModel.getBirdById(birdId);
    
    // Obtiene userId del token si está autenticado
    let userFavorites = [];
    let userInfo = null;
    
    if (req.token && req.token.id) {
      userInfo = {
        id: req.token.id,
        email: req.token.email,
        role: req.token.role
      };
      // Obtiene lista de favoritos del usuario para marcar si esta ave es favorita
      userFavorites = await favoritesModel.getUserFavorites(req.token.id);
    }
    
    // Formatea detalle completo del ave
      // Incluye información sobre si es favorita del usuario autenticado
    const formattedBird = navarreviscaDetailOperation.formatAveDetailComplete(bird, userFavorites);
    
    // Envia respuesta exitosa
    res.json({
      success: true,
      message: `Detalles de "${bird.common_name}"`,
      data: formattedBird,
      user: userInfo 
    });
    
  } catch (error) {
    // Error 404: Ave no encontrada
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        error: 'Ave no encontrada'
      });
    }
    
    // Error 500: Error interno del servidor
    res.status(500).json({
      success: false,
      error: 'Error al obtener detalle del ave'
    });
  }
}

// ========================================================================================================================================  
// 2. AÑADIR A FAVORITOS
// ========================================================================================================================================  

async function addToFavorites(req, res) {
  try {
    // Obtiene ID del ave desde los parámetros de la URL
    const birdId = parseInt(req.params.id);
    
    // Requiere token válido
    if (!req.token || !req.token.id) {
      return res.status(401).json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para añadir favoritos'
      });
    }
    
    const userId = req.token.id;
    const userEmail = req.token.email;
    
    // Verifica que el ave existe antes de añadir a favoritos
    await navarreviscaModel.getBirdById(birdId);
    
    // Verifica si ya es favorito para evitar duplicados
    const alreadyFavorite = await favoritesModel.isFavorite(userId, birdId);
    if (alreadyFavorite) {
      return res.status(409).json({
        success: false,
        error: 'Esta ave ya está en tus favoritos'
      });
    }
    
    // Añade a favoritos
    const newFavorite = await favoritesModel.addFavorite(userId, birdId);
    
    // Envia respuesta exitosa (201 Created)
    res.status(201).json({
      success: true,
      mensaje: 'Ave añadida a favoritos correctamente',
      id_favorito: newFavorite.id_favbird,  // ID del nuevo registro en favoritos
      id_ave: birdId,
      usuario: {
        id: userId,
        email: userEmail
      }
    });
    
  } catch (error) {
    // Error 404: Ave no encontrada
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        error: 'Ave no encontrada'
      });
    }
    
    // Error 409: Conflicto - Ya existe en favoritos
    if (error.message.includes('Ya existe en favoritos')) {
      return res.status(409).json({
        success: false,
        error: 'Esta ave ya está en tus favoritos'
      });
    }
    
    // Error 500: Error interno del servidor
    res.status(500).json({
      success: false,
      error: 'Error al añadir a favoritos'
    });
  }
}

// Exportar funciones del controlador
module.exports = {
  getAveDetail,
  addToFavorites
};