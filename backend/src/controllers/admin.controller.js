/* 
🎮 CONTROLLER → admin.controller.js
    * Controlador para operaciones de administrador
    * CRUD completo de aves (crear, editar y eliminar)
*/

const adminService = require('../services/admin.service.js');
const adminModel = require('../models/admin.model.js');

// =================================================================================================
// 1. CREAR AVE (POST /admin/aves)
// =================================================================================================

async function createBird(req, res) {
  try {
    console.log('Admin controller: Creando nueva ave');
    
    // TEMPORAL: Sin autenticación para desarrollo
    // const adminId = req.user?.id;
    // if (!adminId) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Autenticación requerida'
    //   });
    // }
    // Verificar rol de admin cuando haya auth
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Acceso denegado',
    //     message: 'Se requiere rol de administrador'
    //   });
    // }
    
    // Formatear datos para creación
    const birdData = adminModel.formatBirdForCreate(req.body/* , adminId */);
    
    // Crear en base de datos
    const newBird = await adminService.createBird(birdData);
    
    // Formatear respuesta
    const formattedResponse = adminModel.formatBirdResponse(newBird, 'created');
    
    res.status(201).json({
      success: true,
      ...formattedResponse,
      metadata: {
        action: 'bird_created',
        timestamp: new Date().toISOString(),
        auth_status: 'temp_admin' // Temporal para desarrollo
      }
    });
    
  } catch (error) {
    console.error('Admin Controller error en createBird:', error);
    
    // Manejo de errores específicos
    if (error.message.includes('Ya existe')) {
      return res.status(409).json({
        success: false,
        error: 'Ave duplicada',
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al crear ave',
      message: error.message
    });
  }
}

// =================================================================================================
// 2. ACTUALIZAR AVE (PUT /admin/aves/:id)
// =================================================================================================

async function updateBird(req, res) {
  try {
    const birdId = parseInt(req.params.id);
    console.log(`Admin Controller: Actualizando ave ID ${birdId}`);
    
    // TEMPORAL: Sin autenticación para desarrollo
    // const adminId = req.user?.id;
    // if (!adminId || req.user.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Se requiere rol de administrador'
    //   });
    // }
    
    // Formatear datos para actualización
    const updateData = adminModel.formatBirdForUpdate(req.body/* , adminId */);
    
    // Actualizar en base de datos
    const updatedBird = await adminService.updateBird(birdId, updateData);
    
    // Formatear respuesta
    const formattedResponse = adminModel.formatBirdResponse(updatedBird, 'updated');
    
    res.json({
      success: true,
      ...formattedResponse,
      metadata: {
        action: 'bird_updated',
        timestamp: new Date().toISOString(),
        auth_status: 'temp_admin'
      }
    });
    
  } catch (error) {
    console.error(`Admin Controller error en updateBird:`, error);
    
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        error: 'Ave no encontrada',
        message: `No existe un ave con ID ${req.params.id}`
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al actualizar ave',
      message: error.message
    });
  }
}

// =================================================================================================
// 3. ELIMINAR AVE (DELETE /admin/aves/:id)
// =================================================================================================

async function deleteBird(req, res) {
  try {
    const birdId = parseInt(req.params.id);
    console.log(`Admin Controller: Eliminando ave ID ${birdId}`);
    
    // TEMPORAL: Sin autenticación para desarrollo
    // const adminId = req.user?.id;
    // if (!adminId || req.user.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     error: 'Se requiere rol de administrador'
    //   });
    // }
    
    // Eliminar de la base de datos
    const result = await adminService.deleteBird(birdId);
    
    // Formatear respuesta
    const formattedResponse = adminModel.formatBirdResponse({ id_bird: birdId }, 'deleted');
    
    res.json({
      success: true,
      ...formattedResponse,
      metadata: {
        action: 'bird_deleted',
        timestamp: new Date().toISOString(),
        auth_status: 'temp_admin',
        favorites_deleted: result.favoritesDeleted || 0
      }
    });
    
  } catch (error) {
    console.error(`Admin Controller error en deleteBird:`, error);
    
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        error: 'Ave no encontrada',
        message: `No existe un ave con ID ${req.params.id}`
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al eliminar ave',
      message: error.message
    });
  }
}

// Exportar funciones
module.exports = {
  createBird,
  updateBird,
  deleteBird
};