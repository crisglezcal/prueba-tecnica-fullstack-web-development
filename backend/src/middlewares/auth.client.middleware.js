/*
🙆🏽‍♂️ AUTH USER MIDDLEWARE → auth.user.middleware.js
    * Middleware para verificar rol de usuario normal (no admin)
    * Protege rutas exclusivas para usuarios registrados con rol 'user'
*/

const express = require("express");

// Crea un router específico para rutas de usuario normal
const userRoutes = express.Router();

// Middleware de autorización para usuarios (rol 'user')
userRoutes.use(async (req, res, next) => {
    // Verifica si el usuario tiene rol de "user"
    if (req.token.role === "user") {
        console.log("✅ USER ROLE - Acceso autorizado");
        // Si es usuario normal, permite continuar
        next();
    } else {
        // Si NO es usuario normal, responde con 403 (Forbidden)
            // 403: Usuario está autenticado pero no tiene el rol adecuado
        res.status(403).json({
            success: false,
            error: "Acceso denegado",
            message: "Esta ruta es exclusiva para usuarios registrados (rol: user)",
            user_role: req.token?.role || "no-autenticado",
            help: "Los administradores (rol: admin) no pueden acceder a esta ruta específica"
        });
    }

});

// Exportar el router con el middleware incorporado
module.exports = userRoutes;