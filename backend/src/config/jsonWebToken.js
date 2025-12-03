/* 
🔏 jsonWebToken.js - Configuración de JSON Web Token (JWT)
    * Usa la librería jsonwebtoken
    * Proporciona funciones para crear y decodificar tokens
    * Exporta las funciones para usar en otros módulos
*/

const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET

const createToken = (payload, expirationTime = "10min") => {

    return jwt.sign(payload, SECRET, {
        expiresIn: expirationTime
    });

};

const decodeToken = (token) => JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

module.exports = { createToken, decodeToken };