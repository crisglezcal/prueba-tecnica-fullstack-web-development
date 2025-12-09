/* 
🚀 app.js - Archivo principal del servidor
    * Punto de entrada de la aplicación Node.js/Express
    * Configura el servidor y todas las rutas
    * Maneja errores globales y rutas no encontradas
    * Configura CORS para conexión con frontend React/Vite
    * Configura Swagger para documentación API
*/

// =============================================================================================================================
// IMPORTAR DEPENDENCIAS
// =============================================================================================================================

const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');

// =============================================================================================================================
// CREAR LA APLICACIÓN EXPRESS Y CONFIGURAR MIDDLEWARES
// =============================================================================================================================

const app = express();

// Configuración CORS - Permite conexión con frontend React/Vite
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Configuración de sesiones para OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Inicializar Passport para OAuth
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// =============================================================================================================================
// CONFIGURAR SWAGGER PARA DOCUMENTACIÓN API
// =============================================================================================================================

// Configuración básica de Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Aves - Navarrevisca & Sierra de Gredos',
    version: '1.0.0',
    description: 'API RESTful para gestión y observación de aves',
    contact: {
      name: 'API Support',
      email: 'support@avesnavarrevisca.es'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor de desarrollo'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.js']
};

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Configurar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'API de Aves - Documentación',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true
  }
}));

// =============================================================================================================================
// CONFIGURAR PASSPORT (ESTRATEGIAS DE AUTENTICACIÓN)
// =============================================================================================================================

try {
  require('./config/passport');
} catch (error) {
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, (accessToken, refreshToken, profile, done) => {
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
const authRoutes = require('./routes/auth.routes.js');
const gredosRoutes = require('./routes/gredos.routes.js');
const navarreviscaRoutes = require('./routes/navarrevisca.routes.js');
const navarreviscaDetailRoutes = require('./routes/navarreviscaDetail.routes.js');
const favoritesRoutes = require('./routes/favorites.routes.js');
const adminRoutes = require('./routes/admin.routes.js');

// =============================================================================================================================
// CONFIGURAR LAS RUTAS DE LA APLICACIÓN
// =============================================================================================================================

app.use('/', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/avila', gredosRoutes);
app.use('/aves/navarrevisca', navarreviscaRoutes);
app.use('/aves/navarrevisca/detalle', navarreviscaDetailRoutes);
app.use('/favoritos', favoritesRoutes);
app.use('/admin', adminRoutes);

// =============================================================================================================================
// SERVIR FRONTEND EN PRODUCCIÓN
// =============================================================================================================================

if (process.env.NODE_ENV==="production") {
  // Servir archivos estáticos del frontend con React
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  // Manejar cualquier ruta que no sea de la API y servir el index.html de React
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}



// =============================================================================================================================
// RUTA PARA VERIFICAR SESIÓN (DEBUG)
// =============================================================================================================================

app.get('/api/session-debug', (req, res) => {
  res.json({
    sessionId: req.sessionID,
    session: req.session,
    user: req.user,
    isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false
  });
});

// =============================================================================================================================
// RUTA PARA VERIFICAR SALUD DE LA API
// =============================================================================================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

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
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Contacta al administrador'
  });
});

// =============================================================================================================================
// INICIAR EL SERVIDOR
// =============================================================================================================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  // El servidor se inicia sin logs
});