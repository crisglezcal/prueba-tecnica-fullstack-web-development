/* 
🔐 MODEL → auth.model.js
    * Modelo para operaciones de autenticación (signup/login)
    * Manejo seguro de contraseñas con bcrypt
    * Interacción con base de datos PostgreSQL
*/

const pool = require('../config/database');
const bcrypt = require('bcrypt');

// ======================================================================================================================================
// 1. REGISTRO DE USUARIO (SIGNUP)
// ======================================================================================================================================

const signup = async (email, password, role, name = '', surname = '') => {
    console.log(`SIGNUP: ${email}, role: ${role}`);
    
    try {
        // Generar hash seguro de la contraseña
        console.log('1. Generando hash de contraseña...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hash generado (contraseña segura)');
        
        // Preparar e insertar en base de datos
        console.log('2. Ejecutando INSERT en base de datos...');
        console.log('Parámetros:', { 
            email, 
            role: role || 'user',  // Asegurar que role siempre tenga valor
            name: name || '', 
            surname: surname || '' 
        });
        
        // IMPORTANTE: Solo devolver las columnas que EXISTEN en la tabla
        const result = await pool.query(
            `INSERT INTO "Users" (email, password, role, name, surname) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id_user, email, role, name, surname`,  // ← NO incluir created_at
            [email, hashedPassword, role || 'user', name, surname]
        );
        
        // Retornar usuario creado exitosamente
        const newUser = result.rows[0];
        console.log(`INSERT exitoso - ID: ${newUser.id_user}`);
        return newUser;
        
    } catch (error) {
        // Manejar errores específicos de PostgreSQL
        console.error(`ERROR en signup:`);
        console.error('Mensaje:', error.message);
        console.error('Código:', error.code);
        console.error('Detalle:', error.detail);
        
        // Email ya registrado
        if (error.code === '23505') {
            throw new Error('El email ya está registrado');
        }
        
        // Campos requeridos faltantes
        if (error.code === '23502') {
            throw new Error('Error: Campos name y surname son requeridos');
        }
        
        // Error en estructura de tabla (columna no existe)
        if (error.code === '42703') {
            throw new Error('Error en la estructura de la tabla Users');
        }
        
        throw error;
    }
};

// ======================================================================================================================================
// 2. INICIO DE SESIÓN (LOGIN)
// ======================================================================================================================================

const login = async (email, password) => {
    console.log(`LOGIN: ${email}`);
    
    try {
        // Buscar usuario por email
        console.log('1. Buscando usuario en base de datos...');
        const result = await pool.query(
            'SELECT * FROM "Users" WHERE email = $1',
            [email]
        );
        
        console.log(`Usuarios encontrados: ${result.rows.length}`);
        
        // Si no existe usuario, retornar array vacío
        if (result.rows.length === 0) {
            console.log('Usuario no encontrado');
            return [];
        }
        
        // Obtener datos del usuario encontrado
        const user = result.rows[0];
        console.log('Usuario encontrado:', { 
            id: user.id_user, 
            email: user.email, 
            role: user.role 
        });
        
        // Comparar contraseña proporcionada con hash almacenado
        console.log('2. Verificando contraseña...');
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        // Si contraseña no coincide, retornar array vacío
        if (!passwordMatch) {
            console.log('Contraseña incorrecta');
            return [];
        }
        
        // Login exitoso
        console.log('Login exitoso');
        
        // Remover contraseña del objeto de respuesta por seguridad
        const { password: _, ...userWithoutPassword } = user;
        
        // Retornar usuario sin contraseña
        return [userWithoutPassword];
        
    } catch (error) {
        // Manejar errores en el proceso de login
        console.error(`ERROR en login: ${error.message}`);
        throw error;
    }
};

// ======================================================================================================================================
// 3. CONFIGURAR ROLE POR DEFECTO EN LA BASE DE DATOS (OPCIONAL)
// ======================================================================================================================================

module.exports = {
    signup,
    login
};