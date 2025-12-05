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
const passport = require('passport'); // Para autenticación con Google
const session = require('express-session'); // Para manejar sesiones de OAuth

// =============================================================================================================================
// CREAR LA APLICACIÓN EXPRESS Y CONFIGURAR MIDDLEWARES
// =============================================================================================================================

const app = express(); // Instancia de la aplicación Express

// Configuración CORS - Permite conexión con frontend React/Vite
app.use(cors({
  origin: 'http://localhost:5173', // Origen exacto del frontend
  credentials: true // Permite envío de cookies/credenciales (JWT)
}));

// Configuración de sesiones para OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-change-in-production', // Secreto para firmar sesiones
  resave: false, // No guardar sesión si no hay cambios
  saveUninitialized: false, // No guardar sesiones vacías
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true en producción con HTTPS
    httpOnly: true, // Cookie solo accesible por HTTP
    maxAge: 24 * 60 * 60 * 1000, // 1 día de duración
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Inicializar Passport para OAuth
app.use(passport.initialize()); // Inicializa Passport
app.use(passport.session()); // Habilita sesiones persistentes de login

app.use(express.json()); // Parsear JSON en el cuerpo de las peticiones

// =============================================================================================================================
// CONFIGURAR PASSPORT (ESTRATEGIAS DE AUTENTICACIÓN)
// =============================================================================================================================

// Importar configuración de Passport - Asegúrate de que este archivo existe
try {
  require('./config/passport');
  // console.log('Configuración de Passport cargada correctamente');
} catch (error) {
  // console.error('Error cargando configuración de Passport:', error.message);
  // console.log('Creando archivo básico de configuración...');
  
  // Configuración básica temporal si no existe el archivo
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, (accessToken, refreshToken, profile, done) => {
      // console.log('🔑 Perfil de Google:', profile.emails[0].value);
      return done(null, { 
        id: profile.id, 
        email: profile.emails[0].value,
        name: profile.displayName 
      });
    }));
  }
}

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
// RUTA PARA VERIFICAR SESIÓN (DEBUG)
// =============================================================================================================================

app.get('/api/session-debug', (req, res) => {
  res.json({
    sessionId: req.sessionID,
    session: req.session,
    user: req.user,
    isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
    passport: req._passport ? 'Passport inicializado' : 'Passport no inicializado'
  });
});

// =============================================================================================================================
// MIDDLEWARE PARA MANEJAR RUTAS NO ENCONTRADAS (404)
// =============================================================================================================================

app.use((req, res) => {
    // console.log(`Ruta no encontrada: ${req.method} ${req.path}`);
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
    // console.error('Error del servidor:', err);
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
  // console.log(`Servidor funcionando en http://localhost:${PORT}`);
  // console.log(`Frontend: http://localhost:5173`);
  // console.log(`Google OAuth configurado: ${process.env.GOOGLE_CLIENT_ID ? 'SÍ' : 'NO'}`);
  
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    // console.log(`Google OAuth configurado para: ${process.env.GOOGLE_CALLBACK_URL}`);
    // console.log(`Client ID: ${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...`);
  } else {
    // console.warn(`Google OAuth NO configurado - añade credenciales en .env`);
    // console.warn(`Necesitas: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL`);
  }
  
  // console.log(`Session Secret: ${process.env.SESSION_SECRET ? 'Configurado' : 'NO configurado'}`);
  // console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Configurado' : 'NO configurado'}`);
  
  // Mostrar rutas disponibles
  // console.log('\n📋 Rutas disponibles:');
  // console.log('   GET  /api/auth/google              - Iniciar Google OAuth');
  // console.log('   GET  /api/auth/google/callback     - Callback Google OAuth');
  // console.log('   POST /api/auth/signup              - Registro');
  // console.log('   POST /api/auth/login               - Login tradicional');
  // console.log('   GET  /api/auth/debug               - Debug auth');
  // console.log('   GET  /api/session-debug            - Debug sesión');
});