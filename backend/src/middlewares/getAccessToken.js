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
        console.log("✅ Token encontrado en query string (Google OAuth)");
        req.token = req.query.token;
        req.tokenSource = 'query';
        return next();
    }
    
    // 2. PRIORIDAD: Cabecera Authorization (estándar REST API)
    const { authorization, cookie } = req.headers;
    
    if (authorization && authorization.includes(`Bearer`)) {
        console.log("✅ Token encontrado en cabecera Authorization");
        
        // Extrae token del formato: "Bearer <token>"
        const token = authorization.split(' ')[1];
        
        if (token && token !== 'null' && token !== 'undefined') {
            req.token = token;
            req.tokenSource = 'header';
            console.log("Token extraído de Authorization header");
            return next();
        } else {
            console.warn("⚠️ Cabecera Authorization presente pero token vacío");
        }
    }

    // 3. ALTERNATIVA: Cookies (para aplicaciones web tradicionales)
    if (cookie && cookie.includes(`access_token=`)) {
        console.log("✅ Token encontrado en cookies");
        
        try {
            // Extraer token de las cookies
            const cookies = cookie.split(';').map(c => c.trim());
            const accessTokenCookie = cookies.find(c => c.startsWith('access_token='));
            
            if (accessTokenCookie) {
                const token = accessTokenCookie.split('=')[1];
                
                if (token && token !== 'null' && token !== 'undefined') {
                    req.token = token;
                    req.tokenSource = 'cookie';
                    console.log("Token extraído de cookies");
                    return next();
                }
            }
        } catch (error) {
            console.error("❌ Error procesando cookies:", error.message);
        }
    }

    // 4. ALTERNATIVA: Body JSON (para algunas APIs)
    if (req.body && req.body.token) {
        console.log("✅ Token encontrado en body JSON");
        req.token = req.body.token;
        req.tokenSource = 'body';
        return next();
    }

    // 5. NO se encontró token - IMPORTANTE: NO bloquear, solo continuar
    console.log("ℹ️ Token no encontrado en ninguna fuente");
    console.log("📋 Headers recibidos:", {
        hasAuthorization: !!authorization,
        hasCookie: !!cookie,
        authorization: authorization || 'AUSENTE',
        cookie: cookie ? 'PRESENTE' : 'AUSENTE'
    });
    
    // No establecer req.token, pero SIEMPRE continuar
    // Algunas rutas (como /login) no requieren token
    req.token = null;
    req.tokenSource = 'none';
    next();
});

// Exportar middleware
module.exports = getAccessToken;