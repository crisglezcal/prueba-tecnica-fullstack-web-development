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
            console.log('Login exitoso para usuario id_user:', result.user.id_user);
            
            res.status(200)
                .set('Authorization', `Bearer ${result.token}`)  // Cabecera HTTP
                .cookie('access_token', result.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 24 * 60 * 60 * 1000 // 24 horas
                })           
                .json({ 
                    success: true,
                    role: result.user.role,
                    id_user: result.user.id_user,    
                    email: result.user.email,
                    name: result.user.name,
                    surname: result.user.surname,
                    token: result.token
                });
        } else {
            // Error 401: Unauthorized - Credenciales incorrectas
            res.status(401).json({ 
                success: false,
                msg: result.error 
            });
        }
        
    } catch (error) {
        // Error 400: Bad Request
        console.error('Error en login controller:', error);
        res.status(400).json({ 
            success: false,
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
            .clearCookie('access_token')       // Limpiar cookie correctamente
            .json({ 
                success: true,
                msg: "Sesión cerrada" 
            });
    } catch (error) {
        // Error 400: Bad Request
        res.status(400).json({ 
            success: false,
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