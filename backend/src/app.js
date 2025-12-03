/* 
🚀 app.js - Archivo principal del servidor
    * Punto de entrada de la aplicación Node.js/Express
    * Configura el servidor y todas las rutas
    * Maneja errores globales y rutas no encontradas
    * Configura CORS para conexión con frontend React/Vite
*/

// =============================================================================================================================
// IMPORTAR DEPENDENCIAS
// =============================================================================================================================

const express = require('express'); // Framework web para Node.js
const cors = require('cors'); // Middleware para peticiones entre dominios
require('dotenv').config(); // Variables de entorno desde .env

// 📌 Descomentar estas dependencias para Google OAuth
// const passport = require('passport'); // Para autenticación con Google
// const session = require('express-session'); // Para manejar sesiones de OAuth

// =============================================================================================================================
// CREAR LA APLICACIÓN EXPRESS Y CONFIGURAR MIDDLEWARES
// =============================================================================================================================

const app = express(); // Instancia de la aplicación Express

// Configuración CORS - Permite conexión con frontend React/Vite
app.use(cors({
  origin: 'http://localhost:5173', // Origen exacto del frontend
  credentials: true // Permite envío de cookies/credenciales (JWT)
}));

// 📌 Descomentar para configurar sesiones para OAuth
/*
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu-secreto-session', // Secreto para firmar sesiones
  resave: false, // No guardar sesión si no hay cambios
  saveUninitialized: false, // No guardar sesiones vacías
  cookie: {
    secure: false, // true en producción con HTTPS
    httpOnly: true, // Cookie solo accesible por HTTP
    maxAge: 24 * 60 * 60 * 1000 // 1 día de duración
  }
}));
*/

// 📌 Inicializar Passport para OAuth
/*
app.use(passport.initialize()); // Inicializa Passport
app.use(passport.session()); // Habilita sesiones persistentes de login
*/

app.use(express.json()); // Parsear JSON en el cuerpo de las peticiones

// =============================================================================================================================
// IMPORTAR ARCHIVOS DE RUTAS
// =============================================================================================================================

const homeRoutes = require('./routes/home.routes.js');
const authRoutes = require('./routes/auth.routes.js'); // RUTAS ACTUALES: signup, login, logout - AÑADIR OAuth 
const gredosRoutes = require('./routes/gredos.routes.js');
const navarreviscaRoutes = require('./routes/navarrevisca.routes.js');
const navarreviscaDetailRoutes = require('./routes/navarreviscaDetail.routes.js');
const favoritesRoutes = require('./routes/favorites.routes.js');
const adminRoutes = require('./routes/admin.routes.js');

// =============================================================================================================================
// CONFIGURAR LAS RUTAS DE LA APLICACIÓN
// =============================================================================================================================

app.use('/', homeRoutes); // Ruta raíz: http://localhost:3001/
app.use('/api/auth', authRoutes); // Autenticación: http://localhost:3001/api/auth/signup, /login, /logout
app.use('/api/avila', gredosRoutes); // Aves de la Sierra de Gredos: http://localhost:3001/api/avila/observations
app.use('/aves/navarrevisca', navarreviscaRoutes); // Aves de Navarrevisca: http://localhost:3001/aves/navarrevisca
app.use('/aves/navarrevisca/detalle', navarreviscaDetailRoutes); // Detalle de ave de Navarrevisca: http://localhost:3001/aves/navarrevisca/detalle/:id
app.use('/favoritos', favoritesRoutes); // Gestión de favoritos (Aves de Navarrevisca): http://localhost:3001/favoritos 
app.use('/admin', adminRoutes); // Panel de administración: http://localhost:3001/admin

// =============================================================================================================================
// MIDDLEWARE PARA MANEJAR RUTAS NO ENCONTRADAS (404)
// =============================================================================================================================

app.use((req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        path: req.path,
        method: req.method
    });
});

// =============================================================================================================================
// MIDDLEWARE PARA MANEJAR ERRORES GLOBALES
// =============================================================================================================================

app.use((err, req, res, next) => {
    console.error('Error del servidor:', err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Contacta al administrador'
    });
});

// =============================================================================================================================
// INICIAR EL SERVIDOR
// =============================================================================================================================

const PORT = process.env.PORT || 3001; // Puerto desde .env o 3001 por defecto

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
  console.log(`Frontend: http://localhost:5173`);
  
  // 📌 Descomentar para verificar configuración OAuth
  /*
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log(`Google OAuth configurado para: ${process.env.GOOGLE_CALLBACK_URL}`);
  } else {
    console.warn(`Google OAuth NO configurado - añade credenciales en .env`);
  }
  */
});