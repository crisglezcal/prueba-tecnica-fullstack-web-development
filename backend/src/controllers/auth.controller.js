/* 
🎮 AUTH CONTROLLER → auth.controller.js
    * Controlador para autenticación (signup, login, logout)
    * Maneja tokens JWT
*/

const authService = require('../services/auth.service');

// ========================================================================================================================================  
// 1. SIGNUP - Registro de usuario
// ========================================================================================================================================

const signup = async (req, res) => {
    try {
        // Obtener datos del cuerpo de la petición
            // Valores por defecto para name y surname en caso de que no se envíen
        const { email, password, role, name = '', surname = '' } = req.body;
        
        // Pasar TODOS los parámetros al servicio
        const result = await authService.signup(
            email, 
            password, 
            role, 
            name,    
            surname  
        );
        
        // Envia respuesta exitosa (201 Created)
        res.status(201).json({ 
            msg: "Signed Up",
            user: result.user
        });
        
    } catch (error) {
        // Error 400: Bad Request - Error en los datos enviados
        res.status(400).json({ msg: error.message });
    }
};

// ========================================================================================================================================  
// 2. LOGIN - Inicio de sesión
// ========================================================================================================================================

const login = async (req, res) => {
    try {
        // Obtiene credenciales del cuerpo de la petición
        const { email, password } = req.body;
        
        // Autentica usuario a través del servicio
        const result = await authService.login(email, password);
        
        if (result.success) {
            // Login exitoso
            // IMPORTANTE: Ahora envía el token en el cuerpo JSON también
            res.status(200)
                .set('Authorization', `Bearer ${result.token}`)  // Cabecera HTTP
                .cookie('access_token', result.token)           // Cookie HTTP-only
                .json({ 
                    success: true,  // Añadir success para consistencia
                    role: result.user.role,
                    id: result.user.id,    
                    email: result.user.email,
                    token: result.token  // ← ¡ESTO ES LO QUE FALTA!
                });
        } else {
            // Error 401: Unauthorized - Credenciales incorrectas
            res.status(401).json({ 
                success: false,  // Añadir success para consistencia
                msg: result.error 
            });
        }
        
    } catch (error) {
        // Error 400: Bad Request
        res.status(400).json({ 
            success: false,  // Añadir success para consistencia
            msg: error.message 
        });
    }
};

// ========================================================================================================================================  
// 3. LOGOUT - Cierre de sesión
// ========================================================================================================================================

const logout = async (req, res) => {
    try {
        // Cerrar sesión eliminando el token
        res.status(200)
            .set('Authorization', "")          // Limpiar cabecera
            .cookie('access_token', "")       // Limpiar cookie
            .json({ 
                success: true,  // Añadir success para consistencia
                msg: "Sesión cerrada" 
            });
    } catch (error) {
        // Error 400: Bad Request
        res.status(400).json({ 
            success: false,  // Añadir success para consistencia
            msg: error.message 
        });
    }
};

// Exportar funciones del controlador
module.exports = {
    signup,
    login,
    logout
};