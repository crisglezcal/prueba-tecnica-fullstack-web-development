/*
🔍 GET ACCESS TOKEN MIDDLEWARE → getAccessToken.js
    * Middleware para extraer token JWT de diferentes fuentes
    * Busca token en: Authorization header → Cookies
    * Estándar para APIs REST y aplicaciones web
*/

const express = require("express");
const getAccessToken = express.Router();

// Middleware para extraer token de la petición
    // Este es generalmente el PRIMER middleware de autenticación en la cadena
getAccessToken.use(async (req, res, next) => {
    // Obtiene cabeceras relevantes para autenticación
    const { cookie, authorization } = req.headers;
    console.log("Buscando token en petición...");

    // 1. PRIORIDAD: Cabecera Authorization (estándar REST API)
    if (authorization && authorization.includes(`Bearer`)) {
        console.log("Token encontrado en cabecera Authorization");
        
        // Extrae token del formato: "Bearer <token>"
        const token = authorization.split(' ')[1];
        
        if (token && token !== 'null' && token !== 'undefined') {
            // Token válido encontrado en cabecera
            req.token = token;
            console.log("Token extraído de Authorization header");
            next(); // Continua con el siguiente middleware
        } else {
            // Cabecera presente pero token vacío o inválido
            console.warn("Cabecera Authorization presente pero token vacío");
            res.status(403).json({
                success: false,
                error: 'Token inválido',
                message: 'El token en la cabecera Authorization está vacío',
                help: 'Formato correcto: Authorization: Bearer <tu_token_jwt>'
            });
        }

    // 2. ALTERNATIVA: Cookies (para aplicaciones web tradicionales)
    } else if (cookie && cookie.includes(`access_token=`)) {
        console.log("Token encontrado en cookies");
        
        try {

            // Extraer token de las cookies
                // Las cookies vienen como: "access_token=abc123; otra_cookie=valor"
            const cookies = cookie.split(';').map(c => c.trim());
            
            // Buscar la cookie access_token
            const accessTokenCookie = cookies.find(c => c.startsWith('access_token='));
            
            if (accessTokenCookie) {
                const token = accessTokenCookie.split('=')[1];
                
                if (token && token !== 'null' && token !== 'undefined') {
                    // Token válido encontrado en cookies
                    req.token = token;
                    console.log("Token extraído de cookies");
                    next();
                } else {
                    throw new Error('Cookie access_token vacía');
                }
            } else {
                throw new Error('Cookie access_token no encontrada');
            }
            
        } catch (error) {
            console.error("Error procesando cookies:", error.message);
            res.status(403).json({
                success: false,
                error: 'Error en cookies',
                message: 'No se pudo extraer el token de las cookies',
                help: 'Asegúrate de tener una cookie llamada "access_token" con un token JWT válido'
            });
        }
        
    } else {
        // No se encontró token en ninguna fuente
        console.warn("Token no encontrado en headers ni cookies");
        console.log("Headers recibidos:", {
            hasAuthorization: !!authorization,
            hasCookie: !!cookie,
            authorization: authorization ? "PRESENTE" : "AUSENTE",
            cookie: cookie ? "PRESENTE" : "AUSENTE"
        });
        
        res.status(403).json({
            success: false,
            error: 'Acceso denegado',
            message: 'No se proporcionó token de autenticación',
            help: 'Incluye un token JWT en la cabecera Authorization (Bearer token) o en cookies (access_token)',
            examples: {
                header: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                cookie: 'Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        });
    }
});

// Exportar middleware
module.exports = getAccessToken;