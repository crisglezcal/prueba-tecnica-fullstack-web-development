/* 
🎮 ADMIN CONTROLLER → admin.controller.js
    * Controlador para operaciones de administrador
    * AUTH: Verifica token y rol de administrador
*/

const adminModel = require('../models/admin.model.js');
const adminOperation = require('../utils/admin.utils.js');

// ========================================================================================================================================
// 1. CREAR AVE
// ========================================================================================================================================

async function createBird(req, res) {
  try {
    console.log('Admin controller: Creando nueva ave');
    
    // Verifica token
    if (!req.token || !req.token.id) {
      return res.status(401).json({
        success: false,
        error: 'Autenticación requerida'
      });
    }
    
    // Verifica si el usuario tiene rol de administrador
    if (req.token.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado',
        message: 'Se requiere rol de administrador',
        user_role: req.token.role
      });
    }
    
    // Extrae información del administrador del token
    const adminId = req.token.id;
    const adminEmail = req.token.email;
    
    // Transforma los datos del request al formato que necesita la base de datos
    const birdData = adminOperation.formatBirdForCreate(req.body, adminId);
    
    // Crea en base de datos a través del servicio
    const newBird = await adminModel.createBird(birdData);
    
    // Formatea respuesta para el cliente
    const formattedResponse = adminOperation.formatBirdResponse(newBird, 'created');
    
    // Envia respuesta exitosa
    res.status(201).json({
      success: true,
      ...formattedResponse,
      admin: {
        id: adminId,
        email: adminEmail
      }
    });
    
  } catch (error) {
    console.error('Admin Controller error en createBird:', error);
    
        // Error 409: Conflicto - Ave duplicada
    if (error.message.includes('Ya existe')) {
      return res.status(409).json({
        success: false,
        error: 'Ave duplicada',
        message: error.message
      });
    }
    
    // Error 500: Error interno del servidor
    res.status(500).json({
      success: false,
      error: 'Error al crear ave',
      message: error.message
    });
  }
}

// ========================================================================================================================================  
// 2. ACTUALIZAR AVE
// ========================================================================================================================================

async function updateBird(req, res) {
  try {
    // Obtener ID del ave desde los parámetros de la URL
    const birdId = parseInt(req.params.id);
    console.log(`Admin Controller: Actualizando ave ID ${birdId}`);
    
    // Verificar token y rol de admin (misma lógica que create)
    if (!req.token || !req.token.id) {
      return res.status(401).json({
        success: false,
        error: 'Autenticación requerida'
      });
    }
    
    if (req.token.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado',
        message: 'Se requiere rol de administrador',
        user_role: req.token.role
      });
    }
    
    const adminId = req.token.id;
    const adminEmail = req.token.email;
    
    // Formatea datos para actualización
    const updateData = adminOperation.formatBirdForUpdate(req.body, adminId);
    
    // Actualiza en base de datos
    const updatedBird = await adminModel.updateBird(birdId, updateData);
    
    // Formatea respuesta
    const formattedResponse = adminOperation.formatBirdResponse(updatedBird, 'updated');
    
    // Envia respuesta exitosa
    res.json({
      success: true,
      ...formattedResponse,
      admin: {
        id: adminId,
        email: adminEmail
      }
    });
    
  } catch (error) {
    console.error(`Admin Controller error en updateBird:`, error);
    
    // Error 404: Ave no encontrada
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        error: 'Ave no encontrada',
        message: `No existe un ave con ID ${req.params.id}`
      });
    }
    
    // Error 500: Error interno del servidor
    res.status(500).json({
      success: false,
      error: 'Error al actualizar ave',
      message: error.message
    });
  }
}

// ========================================================================================================================================  
// 3. ELIMINAR AVE
// ========================================================================================================================================

async function deleteBird(req, res) {
  try {
    // Obtener ID del ave desde los parámetros de la URL
    const birdId = parseInt(req.params.id);
    console.log(`Admin Controller: Eliminando ave ID ${birdId}`);
    
    // Verificar token y rol de admin
    if (!req.token || !req.token.id) {
      return res.status(401).json({
        success: false,
        error: 'Autenticación requerida'
      });
    }
    
    if (req.token.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado',
        message: 'Se requiere rol de administrador',
        user_role: req.token.role
      });
    }
    
    const adminId = req.token.id;
    const adminEmail = req.token.email;
    
    // Eliminar de la base de datos
    // El servicio también elimina registros relacionados en favoritos
    const result = await adminModel.deleteBird(birdId);
    
    // Formatea respuesta
    const formattedResponse = adminOperation.formatBirdResponse({ id_bird: birdId }, 'deleted');
    
    // Envia respuesta exitosa con metadata
    res.json({
      success: true,
      ...formattedResponse,
      admin: {
        id: adminId,
        email: adminEmail
      },
      metadata: {
        favorites_deleted: result.favoritesDeleted || 0  // Número de favoritos eliminados
      }
    });
    
  } catch (error) {
    console.error(`Admin Controller error en deleteBird:`, error);
    
    // Error 404: Ave no encontrada
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        error: 'Ave no encontrada',
        message: `No existe un ave con ID ${req.params.id}`
      });
    }
    
    // Error 500: Error interno del servidor
    res.status(500).json({
      success: false,
      error: 'Error al eliminar ave',
      message: error.message
    });
  }
}

// Exportar funciones del controlador
module.exports = {
  createBird,
  updateBird,
  deleteBird
};