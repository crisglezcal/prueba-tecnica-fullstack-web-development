-- ##################################################### 1️⃣ CREACIÓN DE TABLAS #############################################################

-- ===================================================================================================================================
-- 1. CREAR TABLA Users
-- ===================================================================================================================================
-- CREATE TABLE IF NOT EXISTS "Users" (
--     id_user SERIAL PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     surname VARCHAR(100) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin'))
-- );

-- ===================================================================================================================================
-- 2. CREAR TABLA Navarrevisca_birds
-- ===================================================================================================================================
-- CREATE TABLE IF NOT EXISTS "Navarrevisca_birds" (
--     id_bird SERIAL PRIMARY KEY,
--     common_name VARCHAR(150) NOT NULL,
--     scientific_name VARCHAR(150),
--     "order" VARCHAR(100) NOT NULL,
--     family VARCHAR(100) NOT NULL,
--     description TEXT,
--     image VARCHAR(500),  -- <-- URL de la imagen
--     threat_level VARCHAR(50)
-- );

-- ===================================================================================================================================
-- 3. CREAR TABLA Favorites_birds
-- ===================================================================================================================================
-- CREATE TABLE IF NOT EXISTS "Favorites_birds" (
--     id_favbird SERIAL PRIMARY KEY,
--     id_user INTEGER NOT NULL,
--     id_bird INTEGER NOT NULL,
    
--     -- Claves foráneas CON ON DELETE CASCADE
--     CONSTRAINT fk_user
--         FOREIGN KEY (id_user)
--         REFERENCES "Users"(id_user)
--         ON DELETE CASCADE,
    
--     CONSTRAINT fk_bird
--         FOREIGN KEY (id_bird)
--         REFERENCES "Navarrevisca_birds"(id_bird)
--         ON DELETE CASCADE
-- );

-- ##################################################### 2️⃣ CONTENIDO TABLAS #############################################################

-- ===================================================================================================================================
-- INSERTS VACÍOS (SÓLO COLUMNAS ESPECIFICADAS)
-- ===================================================================================================================================

-- -- 1. Users 
-- INSERT INTO "Users" (name, surname, email, password, role) 
-- VALUES 
-- ('', '', '', '', 'user');

-- -- 2. Navarrevisca_birds 
-- INSERT INTO "Navarrevisca_birds" 
-- (common_name, scientific_name, "order", family, description, image, threat_level) 
-- VALUES 
-- ('', '', '', '', '', '', '');

-- -- 3. Favorites_birds
-- INSERT INTO "Favorites_birds" (id_user, id_bird)
-- VALUES (1, 1);