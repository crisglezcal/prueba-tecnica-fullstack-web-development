/*
🔓 DECODE TOKEN MIDDLEWARE → decodeToken.js
    * Middleware para decodificar y verificar tokens JWT
*/

const express = require("express");
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

const decodeToken = express.Router();

decodeToken.use(async (req, res, next) => {
    console.log("=== DECODE TOKEN MIDDLEWARE ===");
    console.log("Token recibido:", req.token ? "PRESENTE" : "AUSENTE");
    
    if (!req.token) {
        console.log("No hay token, estableciendo req.user = null");
        req.user = null;
        return next();
    }
    
    if (!SECRET) {
        console.error("ERROR: JWT_SECRET no configurada");
        return res.status(500).json({
            success: false,
            error: 'Error de configuración del servidor'
        });
    }
    
    try {
        // USAR PROMESA - Esto es CLAVE para la sincronización
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(req.token, SECRET, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        
        console.log("✅ Token decodificado correctamente");
        console.log("Datos decodificados:", {
            id_user: decoded.id_user,
            email: decoded.email,
            role: decoded.role,
            exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'no-exp'
        });
        
        // Guardar el usuario en req.user
        req.user = {
            id_user: decoded.id_user,
            email: decoded.email,
            role: decoded.role || 'user',
            name: decoded.name || '',
            surname: decoded.surname || '',
            loginMethod: decoded.loginMethod || 'traditional'
        };
        
        console.log("✅ Usuario establecido en req.user:", req.user.email);
        return next();
        
    } catch (error) {
        console.error("❌ Error verificando token:", error.message);
        
        // IMPORTANTE: No responder, solo establecer req.user = null
        req.user = null;
        
        // Continuar al siguiente middleware
        console.log("Continuando con req.user = null");
        return next();
    }
});

// Exportar middleware
module.exports = decodeToken;