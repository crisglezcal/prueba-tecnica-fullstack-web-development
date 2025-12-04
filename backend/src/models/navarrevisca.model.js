/* 
📩 NAVARREVISCA MODEL → navarrevisca.model.js
    * Servicio ESENCIAL para la tabla Navarrevisca_birds
    * Hace consultas SQL a la base de datos PostgreSQL
    * Maneja errores de conexión y de consultas
    * No transforma datos, solo los obtiene crudos
*/

const pool = require('../config/database.js');
const queries = require('../queries/navarrevisca.queries');

const getAllBirds = async () => {
  try {
    const result = await pool.query(queries.getAllBirds);
    return result.rows;
  } catch (error) {
    throw new Error('Error al obtener aves: ' + error.message);
  }
};

const getBirdById = async (id) => {
  const result = await pool.query(queries.getBirdById, [id]);
  if (result.rows.length === 0) throw new Error(`Ave con ID ${id} no encontrada`);
  return result.rows[0];
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

module.exports = {
  getAllBirds,
  getBirdById,
  createBird
};
