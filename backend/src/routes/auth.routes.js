const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('./../controllers/auth.controller');
const getAccessToken = require('../middlewares/getAccessToken.js');
const decodeToken = require('../middlewares/decodeToken.js');
const jwt = require('jsonwebtoken');

// =============================================================================================================================
// 1. RUTAS PÚBLICAS
// =============================================================================================================================

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Crea una nueva cuenta de usuario en el sistema con los datos proporcionados.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@ejemplo.com"
 *                 description: "Correo electrónico del usuario"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "Password123"
 *                 description: "Contraseña del usuario (mínimo 6 caracteres)"
 *               role:
 *                 type: string
 *                 enum: [user, admin, client]
 *                 default: "user"
 *                 example: "user"
 *                 description: "Rol del usuario en el sistema"
 *               name:
 *                 type: string
 *                 example: "Juan"
 *                 description: "Nombre del usuario"
 *               surname:
 *                 type: string
 *                 example: "Pérez"
 *                 description: "Apellido del usuario"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Signed Up"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_user:
 *                       type: integer
 *                       example: 1
 *                       description: "ID único del usuario"
 *                     email:
 *                       type: string
 *                       example: "usuario@ejemplo.com"
 *       400:
 *         description: Error en los datos proporcionados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Email y contraseña son requeridos"
 *       409:
 *         description: El email ya está registrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión con credenciales
 *     description: Autentica un usuario con email y contraseña, devuelve un token JWT válido por 24 horas.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@ejemplo.com"
 *                 description: "Correo electrónico registrado"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123"
 *                 description: "Contraseña del usuario"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Max-Age=86400"
 *               description: "Cookie HTTP-only con el token JWT"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 role:
 *                   type: string
 *                   example: "user"
 *                   description: "Rol del usuario autenticado"
 *                 id_user:
 *                   type: integer
 *                   example: 1
 *                   description: "ID del usuario autenticado"
 *                 email:
 *                   type: string
 *                   example: "usuario@ejemplo.com"
 *                 name:
 *                   type: string
 *                   example: "Juan"
 *                 surname:
 *                   type: string
 *                   example: "Pérez"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   description: "Token JWT para autenticación en API"
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: "Credenciales incorrectas"
 *       400:
 *         description: Error en los datos proporcionados
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login', authController.login);

// =============================================================================================================================
// 2. RUTAS GOOGLE OAUTH
// =============================================================================================================================

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Iniciar autenticación con Google OAuth
 *     description: Redirige al usuario a la página de autenticación de Google para autorizar la aplicación.
 *     tags: [Autenticación - Google OAuth]
 *     responses:
 *       302:
 *         description: Redirección a Google OAuth
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               example: "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=..."
 *               description: "URL de autorización de Google"
 */
// 1. Iniciar autenticación con Google
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['email', 'profile'], 
    prompt: 'select_account',
    session: true
  })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback de Google OAuth
 *     description: Endpoint de callback procesado por Google después de la autenticación. Genera un token JWT y redirige al frontend.
 *     tags: [Autenticación - Google OAuth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: "Código de autorización devuelto por Google"
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: "Parámetro de estado para prevenir ataques CSRF"
 *     responses:
 *       302:
 *         description: Redirección al frontend con token JWT
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               example: "http://localhost:5173/login?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               description: "URL del frontend con el token JWT como parámetro de query"
 *       302:
 *         description: Redirección a página de error
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               example: "http://localhost:5173/login?error=google_auth_failed"
 */
// 2. Callback de Google - Convierte sesión a JWT
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
    session: true
  }),
  (req, res) => {
    try {
      console.log('Google auth exitosa, usuario:', req.user?.email);
      console.log('Datos de req.user:', {
        id_user: req.user?.id_user,
        email: req.user?.email,
        name: req.user?.name
      });
      
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_user`);
      }
      
      // Generar JWT usando id_user (NO id)
      const token = jwt.sign(
        { 
          id_user: req.user.id_user,  // ← id_user, NO userId
          email: req.user.email, 
          role: req.user.role || 'user',
          name: req.user.name || '',
          surname: req.user.surname || '',
          loginMethod: 'google'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      console.log('Token JWT generado para id_user:', req.user.id_user);
      
      // Redirigir al frontend con el token
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}`;
      console.log('Redirigiendo a:', redirectUrl);
      res.redirect(redirectUrl);
      
    } catch (error) {
      console.error('Error en callback de Google:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_error&message=${error.message}`);
    }
  }
);

/**
 * @swagger
 * /auth/google/logout:
 *   get:
 *     summary: Cerrar sesión de Google OAuth
 *     description: Cierra la sesión de Google y redirige a la página de login del frontend.
 *     tags: [Autenticación - Google OAuth]
 *     responses:
 *       302:
 *         description: Redirección a la página de login
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               example: "http://localhost:5173/login"
 */
// 3. Ruta para cerrar sesión de Google
router.get('/google/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error al cerrar sesión de Google:', err);
    }
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`);
  });
});

// =============================================================================================================================
// 3. RUTAS PROTEGIDAS (JWT)
// =============================================================================================================================

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión del sistema
 *     description: Invalida el token JWT actual y limpia las cookies de autenticación.
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "access_token=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
 *               description: "Cookie vacía para eliminar el token"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: "Sesión cerrada"
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/logout', getAccessToken, decodeToken, authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener información del usuario actual
 *     description: Devuelve la información del usuario autenticado extraída del token JWT.
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_user:
 *                   type: integer
 *                   example: 1
 *                   description: "ID único del usuario"
 *                 email:
 *                   type: string
 *                   example: "usuario@ejemplo.com"
 *                   description: "Correo electrónico del usuario"
 *                 role:
 *                   type: string
 *                   example: "user"
 *                   description: "Rol del usuario en el sistema"
 *                 name:
 *                   type: string
 *                   example: "Juan"
 *                   description: "Nombre del usuario"
 *                 surname:
 *                   type: string
 *                   example: "Pérez"
 *                   description: "Apellido del usuario"
 *                 loginMethod:
 *                   type: string
 *                   example: "traditional"
 *                   description: "Método de autenticación usado (traditional, google)"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No autenticado"
 */
// Ruta para obtener usuario actual
router.get('/me', getAccessToken, decodeToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  res.json(req.user);
});

module.exports = router;