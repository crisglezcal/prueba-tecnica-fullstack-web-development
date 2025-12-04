/* 
📩 ADMIN MODEL → admin.model.js
    * Modelo para operaciones de administrador
*/

const pool = require('../config/database.js');
const queries = require('../queries/admin.queries');

const birdExists = async (birdId) => {
  try {
    const result = await pool.query(queries.checkBirdExists, [birdId]);
    return result.rows.length > 0;
  } catch (error) {
    return false;
  }
};


const createBird = async (birdData) => {
  try {
    const result = await pool.query(queries.createBird, [
      birdData.common_name,
      birdData.scientific_name,
      birdData.order,
      birdData.family,
      birdData.description,
      birdData.image,
      birdData.threat_level
    ]);
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') throw new Error(`Ya existe un ave con el nombre científico: ${birdData.scientific_name}`);
    throw error;
  }
};


const updateBird = async (birdId, updateData) => {
  const exists = await birdExists(birdId);
  if (!exists) throw new Error(`Ave con ID ${birdId} no encontrada`);
  
  const result = await pool.query(queries.updateBird, [
    updateData.common_name || null,
    updateData.scientific_name || null,
    updateData.order || null,
    updateData.family || null,
    updateData.description || null,
    updateData.image || null,
    updateData.threat_level || null,
    birdId
  ]);
  return result.rows[0];
};


const deleteBird = async (birdId) => {
  const exists = await birdExists(birdId);
  if (!exists) throw new Error(`Ave con ID ${birdId} no encontrada`);
  
  let favoritesDeleted = 0;
  try {
    const favoritesResult = await pool.query(queries.deleteFavoritesByBirdId, [birdId]);
    favoritesDeleted = favoritesResult.rowCount || 0;
  } catch (error) {
    // Continuar si falla
  }
  
  const result = await pool.query(queries.deleteBird, [birdId]);
  
  return {
    success: true,
    bird_id: birdId,
    bird_name: result.rows[0]?.common_name || 'Desconocido',
    favoritesDeleted
  };
};

module.exports = {
  createBird,
  updateBird,
  deleteBird,
  birdExists
};
