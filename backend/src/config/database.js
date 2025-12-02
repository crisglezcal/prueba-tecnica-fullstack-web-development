const { Pool } = require('pg');
require('dotenv').config();

// 1. Crear la conexión
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',     // Dirección de PostgreSQL
  port: process.env.DB_PORT || 5432,            // Puerto (5432 es el de PostgreSQL)
  database: process.env.DB_NAME,                // Nombre base de datos
  user: process.env.DB_USER,                    // Usuario de PostgreSQL
  password: process.env.DB_PASSWORD             // Contraseña de PostgreSQL
});

// 2. Probar que funciona
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

// 3. Exportar para usarlo en services
module.exports = pool;