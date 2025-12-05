/*
🙅🏽‍♂️ AUTH ADMIN MIDDLEWARE → auth.admin.middleware.js
    * Middleware para verificar rol de administrador
    * Protege rutas exclusivas para administradores (rol 'admin')
    * IMPORTANTE: Usa req.user.role, NO req.token.role
*/

const express = require("express");
const adminRoutes = express.Router();

adminRoutes.use(async (req, res, next) => {
    // Pequeño delay para sincronización
    await new Promise(resolve => setTimeout(resolve, 10));
    
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: "Autenticación requerida",
            message: "Debes iniciar sesión como administrador"
        });
    }
    
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            error: "Acceso denegado",
            message: "Se requiere rol de administrador"
        });
    }
    
    // Pasar al siguiente middleware/controller
    return next();
});

module.exports = adminRoutes;