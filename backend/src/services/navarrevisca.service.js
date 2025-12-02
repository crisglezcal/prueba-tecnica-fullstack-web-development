/* 
📩 NAVARREVISCA SERVICE → navarrevisca.service.js
    * Servicio ESENCIAL para la tabla navarrevisca_birds
    * Solo lo necesario: obtener todas y crear nueva
*/

const pool = require('../config/database.js');

class NavarreviscaService {
  
  // 1. OBTENER TODAS LAS AVES (para GET /aves/navarrevisca)
  async getAllBirds() {
    try {
      console.log('Service: Obteniendo todas las aves...');
      
      const query = `
        SELECT * FROM navarrevisca_birds
        ORDER BY common_name ASC
      `;
      
      const result = await pool.query(query);
      
      return result.rows;
      
    } catch (error) {
      console.error('Service Error en getAllBirds:', error);
      throw new Error('Error al obtener aves: ' + error.message);
    }
  }
  
  // 2. OBTENER AVE POR ID (para navarreviscaDetail)
  async getBirdById(id) {
    try {
      console.log(`Service: Obteniendo ave ID ${id}...`);
      
      const query = 'SELECT * FROM navarrevisca_birds WHERE id_bird = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error(`Ave con ID ${id} no encontrada`);
      }
      
      return result.rows[0];
      
    } catch (error) {
      console.error(`Service Error en getBirdById(${id}):`, error);
      throw error;
    }
  }
  
  // 3. CREAR NUEVA AVE (para POST /aves/navarrevisca)
  async createBird(birdData) {
    try {
      console.log('Service: Creando nueva ave...');
      
      const query = `
        INSERT INTO navarrevisca_birds (
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
      return result.rows[0]; // Solo devolver el ave creada
      
    } catch (error) {
      console.error('Service Error en createBird:', error);
      
      // Solo manejar error de duplicado, el resto pasa al controller
      if (error.code === '23505') {
        throw new Error(`Ya existe un ave con el nombre científico: ${birdData.scientific_name}`);
      }
      
      throw error; // Pasar otros errores al controller
    }
  }
}

// Exportar instancia
module.exports = new NavarreviscaService();