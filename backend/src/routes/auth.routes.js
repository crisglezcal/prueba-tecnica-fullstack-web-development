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

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// =============================================================================================================================
// 2. RUTAS GOOGLE OAUTH
// =============================================================================================================================

// 1. Iniciar autenticación con Google
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['email', 'profile'], 
    prompt: 'select_account',
    session: true
  })
);

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

router.post('/logout', getAccessToken, decodeToken, authController.logout);

// Ruta para obtener usuario actual
router.get('/me', getAccessToken, decodeToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  res.json(req.user);
});



module.exports = router;