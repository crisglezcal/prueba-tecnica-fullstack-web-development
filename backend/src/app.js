/* 
🚀 app.js - Archivo principal del servidor
    * Punto de entrada de la aplicación Node.js/Express
    * Configura el servidor y todas las rutas
*/

// =============================================================================================================================
// IMPORTAR DEPENDENCIAS
// =============================================================================================================================

const express = require('express'); // express: Framework web para Node.js (núcleo del servidor)
const cors = require('cors'); // cors: Middleware para permitir peticiones desde diferentes dominios (frontend)
require('dotenv').config(); // dotenv: Carga variables de entorno desde el archivo .env

// =============================================================================================================================
// CREAR LA APLICACIÓN EXPRESS Y CONFIRGURAR MIDDLEWARES
// =============================================================================================================================

const app = express(); // Crea una instancia de la aplicación Express → "encender" el motor del servidor
app.use(cors()); // Middleware CORS → Permite que EL frontend (ej: localhost:5173) se comunique con el backend (localhost:3001) 
app.use(express.json()); // Middleware para parsear JSON → Convierte el cuerpo de las peticiones POST/PUT a objetos JavaScript

// =============================================================================================================================
// IMPORTAR ARCHIVOS DE RUTAS
// =============================================================================================================================

const homeRoutes = require('./routes/home.routes.js');    
const gredosRoutes = require('./routes/gredos.routes.js'); 

// =============================================================================================================================
// CONFIGURAR LAS RUTAS DE LA APLICACIÓN
// =============================================================================================================================

app.use('/', homeRoutes); // http://localhost:3001/
app.use('/api/avila', gredosRoutes); // http://localhost:3001/api/avila/observations

// =============================================================================================================================
// INICIAR EL SERVIDOR
// =============================================================================================================================

const PORT = process.env.PORT || 3001; // Obtiene el puerto desde variables de entorno o usar 3001 por defecto

app.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en http://localhost:${PORT}`);
});

