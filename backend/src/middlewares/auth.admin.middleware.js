/*
🙅🏽‍♂️ AUTH ADMIN MIDDLEWARE → auth.admin.middleware.js
    * Middleware para verificar rol de administrador
    * Protege rutas exclusivas para administradores (rol 'admin')
    * IMPORTANTE: Usa req.user.role, NO req.token.role
*/

const express = require("express");
const adminRoutes = express.Router();

adminRoutes.use(async (req, res, next) => {
    console.log('=== AUTH ADMIN MIDDLEWARE ===');
    console.log('req.user:', req.user);
    
    // Pequeño delay para sincronización
    await new Promise(resolve => setTimeout(resolve, 10));
    
    if (!req.user) {
        console.log("❌ Usuario no autenticado");
        return res.status(401).json({
            success: false,
            error: "Autenticación requerida",
            message: "Debes iniciar sesión como administrador"
        });
    }
    
    console.log("Rol del usuario:", req.user.role);
    if (req.user.role !== "admin") {
        console.log("❌ Usuario no es administrador");
        return res.status(403).json({
            success: false,
            error: "Acceso denegado",
            message: "Se requiere rol de administrador"
        });
    }
    
    console.log("✅ ADMIN USER - Acceso autorizado");
    
    // ¡IMPORTANTE! Pasar al siguiente middleware/controller
    return next();
});

module.exports = adminRoutes;