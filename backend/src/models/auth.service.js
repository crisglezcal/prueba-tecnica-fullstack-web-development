/* 
📩 AUTH SERVICE → auth.service.js
    * Servicio para operaciones de autenticación
    * Maneja lógica de negocio para signup y login
    * Genera tokens JWT al iniciar sesión
*/

const authModel = require('./auth.model');
const { createToken } = require('../config/jsonWebToken');

// Servicio de autenticación
    // Objeto con métodos para signup y login
class AuthService {
    
    // 1. Registrar nuevo usuario
    async signup(email, password, role, name = '', surname = '') {
        try {
            // Validaciones básicas
            if (!email || !password) {
                throw new Error('Email y contraseña son requeridos');
            }
            
            if (password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }
            
            // Validar role permitido
            const validRoles = ['user', 'admin', 'client'];
            if (!validRoles.includes(role)) {
                role = 'user'; // Role por defecto
            }
            
            // Crear usuario
            const newUser = await authModel.signup(
                email, 
                password, 
                role, 
                name,   
                surname 
            );
            
            return {
                success: true,
                user: newUser  
            };
            
        } catch (error) {
            console.error('AuthService - Error en signup:', error.message);
            throw error;
        }
    }
    
    // 2. Iniciar sesión
    async login(email, password) {
        try {
            // Validaciones básicas
            if (!email || !password) {
                throw new Error('Email y contraseña son requeridos');
            }
            
            // Verificar credenciales
            const users = await authModel.login(email, password);
            
            if (users.length === 0) {
                return {
                    success: false,
                    error: 'Credenciales incorrectas'
                };
            }
            
            const user = users[0];
            
            // El token debe contener id_user para que decodeToken.js funcione correctamente
            const token = createToken({ 
                id_user: user.id_user,     
                email: user.email, 
                role: user.role,
                name: user.name || '',
                surname: user.surname || '',
                loginMethod: 'traditional'
            });
            
            // Debug: verificar que el token se generó
            console.log("Token generado para login:", token ? "OK" : "ERROR");
            
            return {
                success: true,
                user: {
                    id_user: user.id_user,  
                    email: user.email,
                    role: user.role,
                    name: user.name || '',
                    surname: user.surname || ''
                },
                token: token
            };
            
        } catch (error) {
            console.error('AuthService - Error en login:', error.message);
            throw error;
        }
    }
}

// Exportar instancia del servicio
module.exports = new AuthService();