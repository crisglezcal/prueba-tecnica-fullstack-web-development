/*
🙅🏽‍♂️ AUTH ADMIN MIDDLEWARE → auth.admin.middleware.js
    * Middleware para verificar rol de administrador
    * Protege rutas exclusivas para administradores (rol 'admin')
    * IMPORTANTE: Usa req.user.role, NO req.token.role
*/

const express = require("express");
const adminRoutes = express.Router();

adminRoutes.use(async (req, res, next) => {
    console.log('🔍 Verificando rol de administrador...');
    console.log('📋 req.user:', req.user);
    
    // Verificar que el usuario esté autenticado
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: "No autenticado",
            message: "Debes iniciar sesión como administrador"
        });
    }
    
    // Verifica si el usuario tiene rol de "admin"
    if (req.user.role === "admin") {
        console.log("✅ ADMIN USER - Acceso autorizado");
        next();
    } else {
        // 403 Forbidden (autenticado pero sin permisos de admin)
        res.status(403).json({
            success: false,
            error: "Acceso denegado",
            message: "Se requiere rol de administrador (rol: admin)",
            user_role: req.user?.role || "no-autenticado",
            user_email: req.user?.email || "desconocido",
            help: "Contacta con el administrador del sistema para obtener permisos"
        });
    }
});

module.exports = adminRoutes;