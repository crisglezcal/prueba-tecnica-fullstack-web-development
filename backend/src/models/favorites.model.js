/* 
📩 FAVORITES MODEL → favorites.model.js
    * Modelo para manejar favoritos
    * Interactúa con la base de datos PostgreSQL
    * Proporciona métodos para CRUD de favoritos
*/

const pool = require('../config/database.js');
const queries = require('../queries/favorites.queries');

const getUserFavorites = async (userId) => {
  try {
    const result = await pool.query(queries.getUserFavorites, [userId]);
    return result.rows;
  } catch (error) {
    throw new Error('Error al obtener favoritos');
  }
};

const isFavorite = async (userId, birdId) => {
  const result = await pool.query(queries.isFavorite, [userId, birdId]);
  return result.rows.length > 0;
};

const addFavorite = async (userId, birdId) => {
  try {
    const result = await pool.query(queries.addFavorite, [userId, birdId]);
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new Error('Ya existe en favoritos');
    }
    throw error;
  }
};

const getUserFavoritesWithDetails = async (userId) => {
  try {
    const result = await pool.query(queries.getUserFavoritesWithDetails, [userId]);
    return result.rows;
  } catch (error) {
    throw new Error('Error al obtener favoritos con detalles');
  }
};

const removeFavorite = async (favoriteId, userId) => {
  try {
    const result = await pool.query(queries.removeFavorite, [favoriteId, userId]);
    
    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'Favorito no encontrado'
      };
    }
    
    return {
      success: true,
      removed_id: result.rows[0].id_favbird
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserFavorites,
  isFavorite,
  addFavorite,
  getUserFavoritesWithDetails,
  removeFavorite
};
