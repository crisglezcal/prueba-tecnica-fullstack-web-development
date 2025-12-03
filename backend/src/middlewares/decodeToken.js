/*
🔓 DECODE TOKEN MIDDLEWARE → decodeToken.js
    * Middleware para decodificar y verificar tokens JWT
    * Transforma el token string en objeto con datos del usuario
    * Valida la firma y expiración del token
*/

const express = require("express");

// Clave secreta para verificar la firma JWT
const SECRET = process.env.JWT_SECRET;

// Librería para trabajar con JWT (JSON Web Tokens)
const jwt = require('jsonwebtoken');

// Crea router middleware para decodificación de tokens
const decodeToken = express.Router();

// Middleware de decodificación de token JWT
decodeToken.use(async (req, res, next) => {
    console.log("Encoded Token recibido:", req.token ? "PRESENTE" : "AUSENTE");
    
    // IMPORTANTE: Añadir verificación para debug
    if (!SECRET) {
        console.error("ERROR: JWT_SECRET no está definida en las variables de entorno");
        return res.status(500).json({
            success: false,
            msg: 'Error de configuración del servidor',
            error: 'Clave JWT no configurada'
        });
    }
    
    // Verificar que se proporcionó un token
    if (req.token) {
        // jwt.verify() valida: firma, expiración (exp), emisor (iss), etc.
        jwt.verify(req.token, SECRET, (err, decoded) => {
            if (err) {
                // Error en la verificación del token
                console.error("Error verificando token:", err.message);
                
                return res.status(400).json({
                    success: false,
                    msg: 'Error en el token',
                    error: err.message,
                    help: 'El token puede estar expirado, mal formado o tener firma inválida'
                });
            } else {
                // Token válido y decodificado correctamente
                console.log("Token decodificado:", {
                    id: decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                    exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'no-exp'
                });
                
                // Sobrescribir req.token con el objeto decodificado
                    // Ahora req.token contiene {id, email, role, ...} en lugar del string
                req.token = decoded;
                
                // Continua al siguiente middleware o controlador
                next();
            }
        });
    } else {
        // No se proporcionó token en la request
        console.warn("Token no proporcionado en la petición");
        
        res.status(401).json({
            success: false,
            msg: 'Token no proporcionado.',
            help: 'Incluye un token JWT válido en la cabecera Authorization o cookie'
        });
    }
});

// Exportar middleware
module.exports = decodeToken;