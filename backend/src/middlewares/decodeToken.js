/*
🔓 DECODE TOKEN MIDDLEWARE → decodeToken.js
    * Middleware para decodificar y verificar tokens JWT
*/

const express = require("express");
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

const decodeToken = express.Router();

decodeToken.use(async (req, res, next) => {
    if (!req.token) {
        req.user = null;
        return next();
    }
    
    if (!SECRET) {
        return res.status(500).json({
            success: false,
            error: 'Error de configuración del servidor'
        });
    }
    
    try {
        // Convertir jwt.verify a promesa para sincronización
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(req.token, SECRET, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
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
        
        return next();
        
    } catch (error) {
        // En caso de error, continuar sin usuario
        req.user = null;
        return next();
    }
});

// Exportar middleware
module.exports = decodeToken;