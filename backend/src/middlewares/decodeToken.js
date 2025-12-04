/*
🔓 DECODE TOKEN MIDDLEWARE → decodeToken.js
    * Middleware para decodificar y verificar tokens JWT
    * Transforma el token string en objeto con datos del usuario
    * Valida la firma y expiración del token
*/

const express = require("express");
const jwt = require('jsonwebtoken');

// Clave secreta para verificar la firma JWT
const SECRET = process.env.JWT_SECRET;

const decodeToken = express.Router();

// Middleware de decodificación de token JWT
decodeToken.use(async (req, res, next) => {
    console.log("Token recibido:", req.token ? "PRESENTE" : "AUSENTE");
    console.log("Fuente del token:", req.tokenSource || 'desconocida');
    
    // IMPORTANTE: Si no hay token, simplemente continuar
    // Algunas rutas pueden ser públicas o el token se añadirá después
    if (!req.token) {
        console.log("No hay token, continuando sin autenticación");
        req.user = null;
        return next();
    }
    
    if (!SECRET) {
        console.error("ERROR: JWT_SECRET no está definida en .env");
        return res.status(500).json({
            success: false,
            msg: 'Error de configuración del servidor',
            error: 'Clave JWT no configurada'
        });
    }
    
    // Verificar que se proporcionó un token
    jwt.verify(req.token, SECRET, (err, decoded) => {
        if (err) {
            // Error en la verificación del token
            console.error("Error verificando token:", err.message);
            
            // Para rutas públicas, podemos continuar sin usuario
            // Para rutas protegidas, el siguiente middleware debe verificar req.user
            req.user = null;
            return res.status(401).json({
                success: false,
                msg: 'Token inválido o expirado',
                error: err.message,
                help: 'Renueva tu token o inicia sesión nuevamente'
            });
        } else {
            // Token válido y decodificado correctamente
            console.log("Token decodificado correctamente");
            console.log("Datos decodificados:", {
                id_user: decoded.id_user,  // ← ¡IMPORTANTE! id_user, NO id
                email: decoded.email,
                role: decoded.role,
                name: decoded.name,
                exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'no-exp'
            });
            
            // Guardar el usuario en req.user (NO en req.token)
            req.user = {
                id_user: decoded.id_user,  // ← ¡CORREGIDO! id_user
                email: decoded.email,
                role: decoded.role || 'user',
                name: decoded.name || '',
                surname: decoded.surname || '',
                loginMethod: decoded.loginMethod || 'traditional'
            };
            
            // También mantener el token decodificado por compatibilidad
            req.decodedToken = decoded;
            
            console.log("Usuario establecido en req.user:", req.user.email);
            next();
        }
    });
});

// Exportar middleware
module.exports = decodeToken;