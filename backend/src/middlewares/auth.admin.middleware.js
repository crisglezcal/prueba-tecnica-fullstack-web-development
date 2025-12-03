/*
🙅🏽‍♂️ AUTH ADMIN MIDDLEWARE → auth.admin.middleware.js
    * Middleware para verificar rol de administrador
    * Protege rutas exclusivas para administradores (rol 'admin')
*/

const express = require("express");
const adminRoutes = express.Router();

adminRoutes.use(async (req, res, next) => {
    // Verifica si el usuario tiene rol de "admin"
    if (req.token.role === "admin") {
        console.log("✅ ADMIN USER - Acceso autorizado");
        next();
    } else {
        // 403 Forbidden (autenticado pero sin permisos de admin)
        res.status(403).json({
            success: false,
            error: "Acceso denegado",
            message: "Se requiere rol de administrador (rol: admin)",
            user_role: req.token?.role || "no-autenticado"
        });
    }
});

module.exports = adminRoutes;