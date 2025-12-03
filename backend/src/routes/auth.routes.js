/*
🛣️ AUTH ROUTES (Rutas) → auth.routes.js
    * Define los endpoints de autenticación de la API
    * Conecta URLs con funciones del auth.controller
    * Configura operaciones de registro, login y logout
*/

const express = require('express');
const router = express.Router();
const authController = require('./../controllers/auth.controller');
const getAccessToken = require('../middlewares/getAccessToken.js');
const decodeToken = require('../middlewares/decodeToken.js');

// =============================================================================================================================
// 1. RUTAS PÚBLICAS (no requieren autenticación)
// =============================================================================================================================

// 1. REGISTRO DE NUEVO USUARIO (SIGNUP)
    // http://localhost:3000/api/auth/signup
    // Body JSON requerido: {"email": "usuario@ejemplo.com", "password": "miContraseña123", "role": "user"}
    // Respuesta: { msg: "Signed Up" } (201 Created) o { msg: "error message" } (400 Bad Request)
router.post('/signup', authController.signup);

// 2. INICIO DE SESIÓN (LOGIN)
    // http://localhost:3000/api/auth/login
    // Body JSON requerido: {"email": "usuario@ejemplo.com", "password": "miContraseña123"}
    // Respuesta: Establece cookie 'access_token' y header 'Authorization' con JWT
    // Retorna: { role: "user" } (200 OK) o { msg: "wrong credentials" } (400 Bad Request)
router.post('/login', authController.login);

// =============================================================================================================================
// 2. RUTAS PROTEGIDAS (requieren autenticación)
// =============================================================================================================================

// 3. CIERRE DE SESIÓN (LOGOUT)
    // http://localhost:3000/api/auth/logout
    // Requiere: Token JWT válido en Authorization header o cookie
    // Acción: Elimina token de autorización y cookies del usuario autenticado
    // Respuesta: 200 OK (sesión cerrada) o 401 Unauthorized (sin token)
router.post('/logout', getAccessToken, decodeToken, authController.logout);

module.exports = router;