/*
🔍 GET ACCESS TOKEN MIDDLEWARE → getAccessToken.js
    * Middleware para extraer token JWT de diferentes fuentes
    * Busca token en: Query String → Authorization header → Cookies
    * IMPORTANTE: NO bloquea si no hay token, solo lo extrae si existe
*/

const express = require("express");
const getAccessToken = express.Router();

// Middleware para extraer token de la petición
getAccessToken.use(async (req, res, next) => {
    // 1. PRIORIDAD: Query string (para Google OAuth callback)
    if (req.query && req.query.token) {
        req.token = req.query.token;
        req.tokenSource = 'query';
        return next();
    }
    
    // 2. PRIORIDAD: Cabecera Authorization (estándar REST API)
    const { authorization, cookie } = req.headers;
    
    if (authorization && authorization.includes(`Bearer`)) {
        // Extrae token del formato: "Bearer <token>"
        const token = authorization.split(' ')[1];
        
        if (token && token !== 'null' && token !== 'undefined') {
            req.token = token;
            req.tokenSource = 'header';
            return next();
        }
    }

    // 3. ALTERNATIVA: Cookies (para aplicaciones web tradicionales)
    if (cookie && cookie.includes(`access_token=`)) {
        try {
            // Extraer token de las cookies
            const cookies = cookie.split(';').map(c => c.trim());
            const accessTokenCookie = cookies.find(c => c.startsWith('access_token='));
            
            if (accessTokenCookie) {
                const token = accessTokenCookie.split('=')[1];
                
                if (token && token !== 'null' && token !== 'undefined') {
                    req.token = token;
                    req.tokenSource = 'cookie';
                    return next();
                }
            }
        } catch (error) {
        }
    }

    // 4. ALTERNATIVA: Body JSON (para algunas APIs)
    if (req.body && req.body.token) {
        req.token = req.body.token;
        req.tokenSource = 'body';
        return next();
    }

    // 5. NO se encontró token - IMPORTANTE: NO bloquear, solo continuar
    req.token = null;
    req.tokenSource = 'none';
    next();
});

// Exportar middleware
module.exports = getAccessToken;