/* 
🧰 ADMIN UTILS → admin.utils.js
*/

// ======================================================================================================================================
// 1. FORMATEAR DATOS PARA CREAR AVE
// ======================================================================================================================================

function formatBirdForCreate(birdData /*, adminId */) {
  
  // Todos los campos son requeridos (ya validados por middleware)
  return {
    common_name: birdData.common_name.trim(),
    scientific_name: birdData.scientific_name.trim(),
    order: birdData.order.trim(),
    family: birdData.family.trim(),
    description: birdData.description.trim(),
    image: birdData.image.trim(),
    threat_level: birdData.threat_level
  };
}

// ======================================================================================================================================
// // 2. FORMATEAR DATOS PARA ACTUALIZAR AVE
// ======================================================================================================================================

function formatBirdForUpdate(birdData /*, adminId */) {
  
  // Solo incluir campos que vienen en la petición
  const updateData = {};
  
  if (birdData.common_name !== undefined) {
    updateData.common_name = birdData.common_name.trim();
  }
  if (birdData.scientific_name !== undefined) {
    updateData.scientific_name = birdData.scientific_name.trim();
  }
  if (birdData.order !== undefined) {
    updateData.order = birdData.order.trim();
  }
  if (birdData.family !== undefined) {
    updateData.family = birdData.family.trim();
  }
  if (birdData.description !== undefined) {
    updateData.description = birdData.description.trim();
  }
  if (birdData.image !== undefined) {
    updateData.image = birdData.image.trim();
  }
  if (birdData.threat_level !== undefined) {
    updateData.threat_level = birdData.threat_level;
  }
  
  return updateData;
}

// ======================================================================================================================================
// 3. FORMATEAR RESPUESTA PARA OPERACIONES CRUD
// ======================================================================================================================================

function formatBirdResponse(birdFromDb, action) {
  
  const messages = {
    'created': 'Ave creada exitosamente',
    'updated': 'Ave actualizada exitosamente', 
    'deleted': 'Ave eliminada exitosamente'
  };
  
  return {
    id: birdFromDb.id_bird,
    nombre_comun: birdFromDb.common_name || 'N/A',
    nombre_cientifico: birdFromDb.scientific_name || 'N/A',
    mensaje: messages[action] || 'Operación completada',
    action: action,
    timestamp: new Date().toISOString()
  };
}

// ======================================================================================================================================
// 4. VALIDAR PERMISOS DE ADMINISTRADOR (PARA CUANDO HAYA AUTH)
// ======================================================================================================================================

function validateAdminPermissions(user) {
  return user && user.role === 'admin';
}

// Exportar funciones
module.exports = {
  formatBirdForCreate,
  formatBirdForUpdate,
  formatBirdResponse,
  validateAdminPermissions
};