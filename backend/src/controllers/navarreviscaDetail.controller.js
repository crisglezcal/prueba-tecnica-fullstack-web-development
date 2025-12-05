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
    
    if (req.user && req.user.id_user) {
      userInfo = {
        id: req.user.id_user,
        email: req.user.email,
        role: req.user.role
      };
      // Obtiene lista de favoritos del usuario para marcar si esta ave es favorita
      userFavorites = await favoritesModel.getUserFavorites(req.user.id_user);
    }
    
    // Formatea detalle completo del ave
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
// 2. AÑADIR A FAVORITOS - VERSIÓN CORREGIDA
// ========================================================================================================================================  

async function addToFavorites(req, res) {
  try {
    console.log('🎯 === CONTROLADOR addToFavorites EJECUTADO ===');
    console.log('req.user:', req.user);
    console.log('req.params:', req.params);
    
    // Obtiene ID del ave desde los parámetros de la URL
    const birdId = parseInt(req.params.id);
    
    // DEBUG: Mostrar qué hay en req
    console.log('🔍 DEBUG req object:');
    console.log('- req.user:', req.user);
    console.log('- req.token:', req.token);
    console.log('- req.user?.id_user:', req.user?.id_user);
    console.log('- req.user?.id:', req.user?.id);
    console.log('- req.token?.id:', req.token?.id);
    console.log('- req.token?.id_user:', req.token?.id_user);
    
    // Requiere usuario autenticado - IMPORTANTE: usar req.user que viene de decodeToken
    if (!req.user || !req.user.id_user) {
      console.log('❌ ERROR: No hay req.user o req.user.id_user');
      return res.status(401).json({
        success: false,
        error: 'Autenticación requerida',
        message: 'Debes iniciar sesión para añadir favoritos'
      });
    }
    
    const userId = req.user.id_user;
    const userEmail = req.user.email;
    
    console.log(`✅ Usuario autenticado: id_user=${userId}, email=${userEmail}`);
    console.log(`✅ Añadiendo ave ${birdId} a favoritos`);
    
    // Verifica que el ave existe antes de añadir a favoritos
    const bird = await navarreviscaModel.getBirdById(birdId);
    console.log(`✅ Ave encontrada: ${bird.common_name} (ID: ${bird.id_bird})`);
    
    // Verifica si ya es favorito para evitar duplicados
    const alreadyFavorite = await favoritesModel.isFavorite(userId, birdId);
    if (alreadyFavorite) {
      console.log(`ℹ️ Ave ${birdId} ya está en favoritos del usuario ${userId}`);
      return res.status(409).json({
        success: false,
        message: 'Esta ave ya está en tus favoritos'
      });
    }
    
    // Añade a favoritos
    const newFavorite = await favoritesModel.addFavorite(userId, birdId);
    
    console.log(`✅ ÉXITO: Ave ${birdId} añadida a favoritos del usuario ${userId}`);
    console.log(`✅ ID del favorito: ${newFavorite.id_favbird}`);
    
    // Envia respuesta exitosa (201 Created)
    res.status(201).json({
      success: true,
      mensaje: 'Ave añadida a favoritos correctamente',
      id_favorito: newFavorite.id_favbird,
      id_ave: birdId,
      usuario: {
        id: userId,
        email: userEmail
      },
      ave: {
        id: bird.id_bird,
        nombre_comun: bird.common_name,
        nombre_cientifico: bird.scientific_name
      }
    });
    
  } catch (error) {
    console.error('💥 ERROR en addToFavorites:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Error 404: Ave no encontrada
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        error: 'Ave no encontrada',
        message: 'El ave especificada no existe'
      });
    }
    
    // Error 409: Conflicto - Ya existe en favoritos
    if (error.message.includes('Ya existe en favoritos') || error.message.includes('duplicate key')) {
      return res.status(409).json({
        success: false,
        error: 'Ya en favoritos',
        message: 'Esta ave ya está en tus favoritos'
      });
    }
    
    // Error 500: Error interno del servidor
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo añadir a favoritos'
    });
  }
}

// Exportar funciones del controlador
module.exports = {
  getAveDetail,
  addToFavorites
};