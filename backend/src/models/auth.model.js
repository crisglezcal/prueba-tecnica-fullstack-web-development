/* 
🔐 MODEL → auth.model.js
    * Modelo para operaciones de autenticación (signup/login)
    * Manejo seguro de contraseñas con bcrypt
    * Interacción con base de datos PostgreSQL
*/

const pool = require('../config/database');
const bcrypt = require('bcrypt');
const queries = require('../queries/auth.queries');

const signup = async (email, password, role, name = '', surname = '') => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            queries.signup,
            [email, hashedPassword, role || 'user', name, surname]
        );
        
        return result.rows[0];
        
    } catch (error) {
        if (error.code === '23505') {
            throw new Error('El email ya está registrado');
        }
        
        if (error.code === '23502') {
            throw new Error('Error: Campos name y surname son requeridos');
        }
        
        if (error.code === '42703') {
            throw new Error('Error en la estructura de la tabla Users');
        }
        
        throw error;
    }
};


const login = async (email, password) => {
    try {
        const result = await pool.query(queries.login, [email]);
        
        if (result.rows.length === 0) {
            return [];
        }
        
        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return [];
        }
        
        const { password: _, ...userWithoutPassword } = user;
        return [userWithoutPassword];
        
    } catch (error) {
        throw error;
    }
};

module.exports = {
    signup,
    login
};
