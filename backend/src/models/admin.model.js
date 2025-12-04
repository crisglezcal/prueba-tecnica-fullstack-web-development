/* 
📩 ADMIN MODEL → admin.model.js
    * Modelo para operaciones de administrador
*/

const pool = require('../config/database.js');

class AdminModel {
  
  // 1. CREAR NUEVA AVE
  async createBird(birdData) {
    try {
      console.log('Admin Model: Creando nueva ave...');
      
      const query = `
        INSERT INTO "Navarrevisca_birds" (
          common_name,
          scientific_name,
          "order",
          family,
          description,
          image,
          threat_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const params = [
        birdData.common_name,
        birdData.scientific_name,
        birdData.order,
        birdData.family,
        birdData.description,
        birdData.image,
        birdData.threat_level
      ];
      
      const result = await pool.query(query, params);
      return result.rows[0];
      
    } catch (error) {
      console.error('Admin Model Error en createBird:', error);
      
      if (error.code === '23505') {
        throw new Error(`Ya existe un ave con el nombre científico: ${birdData.scientific_name}`);
      }
      
      throw error;
    }
  }
  
  // 2. ACTUALIZAR AVE EXISTENTE
  async updateBird(birdId, updateData) {
    try {
      console.log(`Admin Model: Actualizando ave ID ${birdId}...`);
      
      // Verificar que el ave existe primero
      const birdExists = await this.birdExists(birdId);
      if (!birdExists) {
        throw new Error(`Ave con ID ${birdId} no encontrada`);
      }
      
      // Construir la query dinámicamente
      const fields = [];
      const values = [];
      let paramIndex = 1;
      
      Object.keys(updateData).forEach(key => {
        fields.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      });
      
      // Agregar el ID al final de los valores
      values.push(birdId);
      
      const query = `
        UPDATE "Navarrevisca_birds"
        SET ${fields.join(', ')}
        WHERE id_bird = $${paramIndex}
        RETURNING *
      `;
      
      const result = await pool.query(query, values);
      return result.rows[0];
      
    } catch (error) {
      console.error(`Admin Model Error en updateBird(${birdId}):`, error);
      throw error;
    }
  }
  
  // 3. ELIMINAR AVE
  async deleteBird(birdId) {
    try {
      console.log(`Admin Model: Eliminando ave ID ${birdId}...`);
      
      // Verificar que el ave existe primero
      const birdExists = await this.birdExists(birdId);
      if (!birdExists) {
        throw new Error(`Ave con ID ${birdId} no encontrada`);
      }
      
      // Primero eliminar referencias en favoritos (si existen)
      let favoritesDeleted = 0;
      try {
        const deleteFavoritesQuery = `
          DELETE FROM "Favorites_birds" 
          WHERE id_bird = $1
          RETURNING id_favbird
        `;
        const favoritesResult = await pool.query(deleteFavoritesQuery, [birdId]);
        favoritesDeleted = favoritesResult.rowCount || 0;
      } catch (error) {
        // Si falla, continuar igual (puede que no exista la tabla de favoritos aún)
        console.log('No se pudieron eliminar favoritos:', error.message);
      }
      
      // Luego eliminar el ave
      const query = `
        DELETE FROM "Navarrevisca_birds" 
        WHERE id_bird = $1
        RETURNING id_bird, common_name
      `;
      
      const result = await pool.query(query, [birdId]);
      
      return {
        success: true,
        bird_id: birdId,
        bird_name: result.rows[0]?.common_name || 'Desconocido',
        favoritesDeleted: favoritesDeleted
      };
      
    } catch (error) {
      console.error(`Admin Model Error en deleteBird(${birdId}):`, error);
      throw error;
    }
  }
  
  // 4. VERIFICAR SI EL AVE EXISTE (método auxiliar)
  async birdExists(birdId) {
    try {
      const query = 'SELECT id_bird FROM "Navarrevisca_birds" WHERE id_bird = $1';
      const result = await pool.query(query, [birdId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error(`Admin Model Error en birdExists(${birdId}):`, error);
      return false;
    }
  }
}

// Exportar instancia
module.exports = new AdminModel();