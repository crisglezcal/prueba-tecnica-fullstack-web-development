/* 
📩 FAVORITES MODEL → favorites.model.js
    * Modelo para manejar favoritos
    * Interactúa con la base de datos PostgreSQL
    * Proporciona métodos para CRUD de favoritos
*/

const pool = require('../config/database.js');

class FavoritesModel {
  
  // 1. Obtener favoritos básicos de un usuario
  async getUserFavorites(userId) {
    try {
      console.log(`Model: Obteniendo favoritos del usuario ${userId}...`);
      
      const query = `
        SELECT * FROM "Favorites_birds" 
        WHERE id_user = $1
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows;
      
    } catch (error) {
      console.error(`Model Error en getUserFavorites(${userId}):`, error);
      throw new Error('Error al obtener favoritos');
    }
  }
  
  // 2. Verificar si ya es favorito
  async isFavorite(userId, birdId) {
    try {
      console.log(`Model: Verificando si ave ${birdId} es favorito de usuario ${userId}...`);
      
      const query = `
        SELECT id_favbird FROM "Favorites_birds" 
        WHERE id_user = $1 AND id_bird = $2
        LIMIT 1
      `;
      
      const result = await pool.query(query, [userId, birdId]);
      return result.rows.length > 0;
      
    } catch (error) {
      console.error(`Model Error en isFavorite(${userId}, ${birdId}):`, error);
      throw error;
    }
  }
  
  // 3. Añadir a favoritos
  async addFavorite(userId, birdId) {
    try {
      console.log(`Model: Añadiendo ave ${birdId} a favoritos del usuario ${userId}...`);
      
      const query = `
        INSERT INTO "Favorites_birds" (id_user, id_bird)
        VALUES ($1, $2)
        RETURNING id_favbird, id_user, id_bird
      `;
      
      const result = await pool.query(query, [userId, birdId]);
      return result.rows[0];
      
    } catch (error) {
      console.error(`Model Error en addFavorite(${userId}, ${birdId}):`, error);
      
      if (error.code === '23505') {
        throw new Error('Ya existe en favoritos');
      }
      throw error;
    }
  }
  
  // 4. Obtener favoritos con detalles
  async getUserFavoritesWithDetails(userId) {
    try {
      console.log(`Model: Obteniendo favoritos con detalles para usuario ${userId}...`);
      
      const query = `
        SELECT 
          f.id_favbird,
          f.id_user,
          f.id_bird,
          b.common_name,
          b.scientific_name,
          b.family,
          b.image,
          b.threat_level
        FROM "Favorites_birds" f
        JOIN "Navarrevisca_birds" b ON f.id_bird = b.id_bird
        WHERE f.id_user = $1
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows;
      
    } catch (error) {
      console.error(`Model Error en getUserFavoritesWithDetails(${userId}):`, error);
      throw new Error('Error al obtener favoritos con detalles');
    }
  }
  
  // 5. Eliminar favorito (verificando que pertenezca al usuario)
  async removeFavorite(favoriteId, userId) {
    try {
      console.log(`Model: Eliminando favorito ${favoriteId} del usuario ${userId}...`);
      
      const query = `
        DELETE FROM "Favorites_birds" 
        WHERE id_favbird = $1 AND id_user = $2
        RETURNING id_favbird
      `;
      
      const result = await pool.query(query, [favoriteId, userId]);
      
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
      console.error(`Model Error en removeFavorite(${favoriteId}, ${userId}):`, error);
      throw error;
    }
  }
}

// Exportar instancia
module.exports = new FavoritesModel();