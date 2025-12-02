/* 
🎮 CONTROLLER → navarreviscaDetail.controller.js
    * Controlador para vista detalle y favoritos
    * Variables en inglés, comentarios en castellano
*/

const navarreviscaService = require('../services/navarrevisca.service.js');
const favoritesService = require('../services/favorites.service.js');
const navarreviscaDetailModel = require('../models/navarreviscaDetail.model.js');

// =================================================================================================
// 1. GET DETALLE DE AVE (GET /aves/navarrevisca/detalle/:id)
// =================================================================================================

async function getAveDetail(req, res) {
  try {
    const birdId = parseInt(req.params.id);
    
    const bird = await navarreviscaService.getBirdById(birdId);
    
    let userFavorites = [];
    const userId = req.user?.id;
    if (userId) {
      userFavorites = await favoritesService.getUserFavorites(userId);
    }
    
    const formattedBird = navarreviscaDetailModel.formatAveDetailComplete(bird, userFavorites);
    
    res.json({
      success: true,
      message: `Detalles de "${bird.common_name}"`,
      data: formattedBird
    });
    
  } catch (error) {
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        error: 'Ave no encontrada'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al obtener detalle del ave'
    });
  }
}

// =================================================================================================
// 2. AÑADIR A FAVORITOS (POST /aves/navarrevisca/detalle/:id/favoritos)
// =================================================================================================

async function addToFavorites(req, res) {
  try {
    const birdId = parseInt(req.params.id);
    
    // Temporal: usuario fijo hasta implementar auth
    const userId = 1;
    
    // Verificar que el ave existe
    await navarreviscaService.getBirdById(birdId);
    
    // Verificar si ya es favorito
    const alreadyFavorite = await favoritesService.isFavorite(userId, birdId);
    if (alreadyFavorite) {
      return res.status(409).json({
        success: false,
        error: 'Esta ave ya está en tus favoritos'
      });
    }
    
    // Añadir a favoritos
    const newFavorite = await favoritesService.addFavorite(userId, birdId);
    
    res.status(201).json({
      success: true,
      mensaje: 'Ave añadida a favoritos correctamente',
      id_favorito: newFavorite.id_favbird,
      id_ave: birdId,
      id_usuario: userId
    });
    
  } catch (error) {
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        error: 'Ave no encontrada'
      });
    }
    
    if (error.message.includes('Ya existe en favoritos')) {
      return res.status(409).json({
        success: false,
        error: 'Esta ave ya está en tus favoritos'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al añadir a favoritos'
    });
  }
}

// Exportar funciones
module.exports = {
  getAveDetail,
  addToFavorites
};