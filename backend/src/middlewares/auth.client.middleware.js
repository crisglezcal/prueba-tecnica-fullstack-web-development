/*
🙆🏽‍♂️ AUTH USER MIDDLEWARE → auth.user.middleware.js
    * Middleware para verificar rol de usuario normal (no admin)
    * Protege rutas exclusivas para usuarios registrados con rol 'user'
    * IMPORTANTE: Usa req.user.role, NO req.token.role
*/

const express = require("express");

// Crea un router específico para rutas de usuario normal
const userRoutes = express.Router();

// Middleware de autorización para usuarios (rol 'user')
userRoutes.use(async (req, res, next) => {
    console.log('🔍 Verificando rol de usuario en user middleware...');
    console.log('📋 req.user:', req.user);
    
    // Verificar que el usuario esté autenticado
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: "No autenticado",
            message: "Debes iniciar sesión para acceder a esta ruta"
        });
    }
    
    // Verifica si el usuario tiene rol de "user" o "admin" (los admins pueden acceder a rutas de user)
    if (req.user.role === "user" || req.user.role === "admin") {
        console.log(`✅ USER/ADMIN ROLE (${req.user.role}) - Acceso autorizado`);
        next();
    } else {
        // Si NO es usuario normal o admin, responde con 403 (Forbidden)
        res.status(403).json({
            success: false,
            error: "Acceso denegado",
            message: "Esta ruta es exclusiva para usuarios registrados",
            user_role: req.user?.role || "no-autenticado",
            help: "Necesitas tener una cuenta de usuario para acceder"
        });
    }
});

// Exportar el router con el middleware incorporado
module.exports = userRoutes;