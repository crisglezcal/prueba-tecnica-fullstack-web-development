/* 
📦 database.js - Configuración de la conexión a PostgreSQL
    * Usa la librería pg (node-postgres)
    * Configura la conexión usando variables de entorno
    * Exporta el pool de conexiones para usar en otros módulos
*/

const { Pool } = require('pg');
require('dotenv').config();

console.log('Conectando a:', process.env.PG_HOST);

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: process.env.PG_SSL === 'true' // BBDD local (false) o remota (true)
  // ssl: { rejectUnauthorized: false }, // Requerido para Render
  // connectionTimeoutMillis: 5000
});

// Test al iniciar
pool.on('connect', () => {
  console.log('PostgreSQL CONECTADO');
});

module.exports = pool;