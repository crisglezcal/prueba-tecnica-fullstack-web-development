
// QUERIES PARA AUTENTICACIÓN DE USUARIOS

const queries = {

    signup: `
        INSERT INTO "Users" (email, password, role, name, surname) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id_user, email, role, name, surname
        `,

    login: `
        SELECT * 
        FROM "Users" 
        WHERE email = $1
        `
}

module.exports = queries;