const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas
const gredosRoutes = require('./routes/gredos.routes.js');

// Usar rutas
app.use('/api/avila', gredosRoutes);

// Ruta principal (prueba)
app.get('/', (req, res) => {
  res.json({
    message: 'API Aves de Gredos - Ávila',
    version: '1.0.0',
    endpoints: {
      observaciones: 'GET /api/avila/observations',
      especies: 'GET /api/avila/species',
      buscarEspecie: 'GET /api/avila/species/search?q=nombre',
      detalleEspecie: 'GET /api/avila/species/:codigo',
      puntosCalientes: 'GET /api/avila/hotspots'
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en http://localhost:${PORT}`);
});