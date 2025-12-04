-- ##################################################### 1️⃣ CREACIÓN DE TABLAS #############################################################

-- ===================================================================================================================================
-- 1. CREAR TABLA Users
-- ===================================================================================================================================
CREATE TABLE IF NOT EXISTS "Users" (
    id_user SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

-- ===================================================================================================================================
-- 2. CREAR TABLA Navarrevisca_birds
-- ===================================================================================================================================
CREATE TABLE IF NOT EXISTS "Navarrevisca_birds" (
    id_bird SERIAL PRIMARY KEY,
    common_name VARCHAR(150) NOT NULL,
    scientific_name VARCHAR(150),
    "order" VARCHAR(100) NOT NULL,
    family VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(500),  -- <-- URL de la imagen
    threat_level VARCHAR(50)
);

-- ===================================================================================================================================
-- 3. CREAR TABLA Favorites_birds
-- ===================================================================================================================================
CREATE TABLE IF NOT EXISTS "Favorites_birds" (
    id_favbird SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    id_bird INTEGER NOT NULL,
    
    -- Claves foráneas CON ON DELETE CASCADE
    CONSTRAINT fk_user
        FOREIGN KEY (id_user)
        REFERENCES "Users"(id_user)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_bird
        FOREIGN KEY (id_bird)
        REFERENCES "Navarrevisca_birds"(id_bird)
        ON DELETE CASCADE
);

-- ##################################################### 2️⃣ CONTENIDO TABLAS #############################################################

-- ===================================================================================================================================
-- INSERTS VACÍOS (SÓLO COLUMNAS ESPECIFICADAS)
-- ===================================================================================================================================

-- 1. Users 
INSERT INTO "Users" (name, surname, email, password, role) 
VALUES 
('', '', '', '', 'user');

-- 2. Navarrevisca_birds 
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('', '', '', '', '', '', '');

-- 3. Favorites_birds
INSERT INTO "Favorites_birds" (id_user, id_bird)
VALUES (1, 1);

-- ===================================================================================================================================
-- INSERTS "Navarrevisca birds"
-- ===================================================================================================================================

-- 1. Buitre leonado
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Buitre leonado', 'Gyps fulvus', 'Accipitriformes', 'Accipitridae', 'Gran buitre de color ocre, planea en grupos sobre montañas. Habitante emblemático de Gredos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Gyps_fulvus_01.jpg/800px-Gyps_fulvus_01.jpg', 'LC');

-- 2. Águila real
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Águila real', 'Aquila chrysaetos', 'Accipitriformes', 'Accipitridae', 'Majestuosa rapaz con envergadura hasta 2,3 m. Nidifica en riscos de Gredos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Golden_Eagle_in_flight_%285522336925%29.jpg/800px-Golden_Eagle_in_flight_%285522336925%29.jpg', 'LC');

-- 3. Roquero rojo
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Roquero rojo', 'Monticola saxatilis', 'Passeriformes', 'Muscicapidae', 'Pájaro colorido que habita en pedreras y canchales de alta montaña. Macho con pecho naranja.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Rufous-tailed_Rock_Thrush_%28Monticola_saxatilis%29.jpg/800px-Rufous-tailed_Rock_Thrush_%28Monticola_saxatilis%29.jpg', 'LC');

-- 4. Acentor alpino
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Acentor alpino', 'Prunella collaris', 'Passeriformes', 'Prunellidae', 'Pájaro de alta montaña, frecuente en la zona alpina de Gredos. Con pecho moteado.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Prunella_collaris_-_Alpine_Accentor_XC434206.jpg/800px-Prunella_collaris_-_Alpine_Accentor_XC434206.jpg', 'LC');

-- 5. Chova piquirroja
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Chova piquirroja', 'Pyrrhocorax pyrrhocorax', 'Passeriformes', 'Corvidae', 'Ave negra con pico rojo curvado, muy social. Habita en cortados rocosos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Red-billed_Chough_%28Pyrrhocorax_pyrrhocorax%29.jpg/800px-Red-billed_Chough_%28Pyrrhocorax_pyrrhocorax%29.jpg', 'LC');

-- 6. Colirrojo tizón
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Colirrojo tizón', 'Phoenicurus ochruros', 'Passeriformes', 'Muscicapidae', 'Común en pueblos y zonas rocosas. Macho con plumaje oscuro y cola rojiza.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Phoenicurus_ochruros_1_%28Martin_Mecnarowski%29.jpg/800px-Phoenicurus_ochruros_1_%28Martin_Mecnarowski%29.jpg', 'LC');

-- 7. Halcón peregrino
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Halcón peregrino', 'Falco peregrinus', 'Falconiformes', 'Falconidae', 'Rapaz velocísima que caza otras aves en vuelo. Habita en cortados de Gredos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Falco_peregrinus_-_01.jpg/800px-Falco_peregrinus_-_01.jpg', 'LC');

-- 8. Alimoche
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Alimoche', 'Neophron percnopterus', 'Accipitriformes', 'Accipitridae', 'Buitre pequeño blanco y negro, con cara amarilla. Estival en Gredos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Egyptian_Vulture_%28Neophron_percnopterus%29.jpg/800px-Egyptian_Vulture_%28Neophron_percnopterus%29.jpg', 'EN');

-- 9. Agateador común
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Agateador común', 'Certhia brachydactyla', 'Passeriformes', 'Certhiidae', 'Pájaro pequeño que trepa en espiral por troncos en busca de insectos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Certhia_brachydactyla_-_01.jpg/800px-Certhia_brachydactyla_-_01.jpg', 'LC');

-- 10. Pinzón vulgar
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Pinzón vulgar', 'Fringilla coelebs', 'Passeriformes', 'Fringillidae', 'Uno de los pájaros más comunes en bosques y zonas habitadas de Gredos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Common_Chaffinch_%28Fringilla_coelebs%29_male.jpg/800px-Common_Chaffinch_%28Fringilla_coelebs%29_male.jpg', 'LC');

-- 11. Petirrojo europeo
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Petirrojo europeo', 'Erithacus rubecula', 'Passeriformes', 'Muscicapidae', 'Conocido por su pecho naranja. Presente todo el año en bosques y jardines.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Erithacus_rubecula_-_European_robin.jpg/800px-Erithacus_rubecula_-_European_robin.jpg', 'LC');

-- 12. Carbonero común
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Carbonero común', 'Parus major', 'Passeriformes', 'Paridae', 'Pequeño pájaro con capucha negra y pecho amarillo. Común en bosques de robles.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Parus_major_-_Great_Tit_%28song%29.jpg/800px-Parus_major_-_Great_Tit_%28song%29.jpg', 'LC');

-- 13. Mirlo común
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Mirlo común', 'Turdus merula', 'Passeriformes', 'Turdidae', 'Macho negro con pico naranja. Habita en bosques, setos y zonas de matorral.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Common_Blackbird.jpg/800px-Common_Blackbird.jpg', 'LC');

-- 14. Búho real
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Búho real', 'Bubo bubo', 'Strigiformes', 'Strigidae', 'Gran búho con "orejas" prominentes. Habita en cortados rocosos de la sierra.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Bubo_bubo_-_Eurasian_Eagle-owl.jpg/800px-Bubo_bubo_-_Eurasian_Eagle-owl.jpg', 'LC');

-- 15. Trepador azul
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Trepador azul', 'Sitta europaea', 'Passeriformes', 'Sittidae', 'Pájaro azulado que desciende por troncos cabeza abajo. De bosques caducifolios.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Sitta_europaea_-_01.jpg/800px-Sitta_europaea_-_01.jpg', 'LC');

-- 16. Collalba gris
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Collalba gris', 'Oenanthe oenanthe', 'Passeriformes', 'Muscicapidae', 'Ave migratoria que cría en zonas pedregosas de montaña. Característica por su obispillo blanco.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Northern_Wheatear_%28Oenanthe_oenanthe%29_%2836542033102%29.jpg/800px-Northern_Wheatear_%28Oenanthe_oenanthe%29_%2836542033102%29.jpg', 'LC');

-- 17. Cuervo grande
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Cuervo grande', 'Corvus corax', 'Passeriformes', 'Corvidae', 'El mayor pájaro de los córvidos, con cola en forma de cuña. Inteligente y adaptable.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Corvus_corax_-_Common_Raven.jpg/800px-Corvus_corax_-_Common_Raven.jpg', 'LC');

-- 18. Bisbita campestre
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Bisbita campestre', 'Anthus campestris', 'Passeriformes', 'Motacillidae', 'Pájaro terrestre de tonos arenosos. Habita en pastizales secos y zonas abiertas.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Tawny_Pipit_%28Anthus_campestris%29_%2814512330049%29.jpg/800px-Tawny_Pipit_%28Anthus_campestris%29_%2814512330049%29.jpg', 'LC');

-- 19. Escribano montesino
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Escribano montesino', 'Emberiza cia', 'Passeriformes', 'Emberizidae', 'Identificable por su cabeza listada en gris y negro. Común en laderas pedregosas con matorral.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Rock_Bunting_%28Emberiza_cia%29.jpg/800px-Rock_Bunting_%28Emberiza_cia%29.jpg', 'LC');

-- 20. Avión roquero
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Avión roquero', 'Ptyonoprogne rupestris', 'Passeriformes', 'Hirundinidae', 'La más montañera de las golondrinas. Construye nidos de barro bajo aleros y rocas.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Eurasian_Crag_Martin_%28Ptyonoprogne_rupestris%29.jpg/800px-Eurasian_Crag_Martin_%28Ptyonoprogne_rupestris%29.jpg', 'LC');

-- 21. Alondra común
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Alondra común', 'Alauda arvensis', 'Passeriformes', 'Alaudidae', 'Canta en vuelo sobre campos abiertos. Presente en pastizales de montaña.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Skylark_%28Alauda_arvensis%29_%2814510293692%29.jpg/800px-Skylark_%28Alauda_arvensis%29_%2814510293692%29.jpg', 'NT');

-- 22. Herrerillo capuchino
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Herrerillo capuchino', 'Lophophanes cristatus', 'Passeriformes', 'Paridae', 'Pequeño pájaro con cresta puntiaguda. Habita en bosques de coníferas de Gredos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crested_Tit_Lophophanes_cristatus.jpg/800px-Crested_Tit_Lophophanes_cristatus.jpg', 'LC');

-- 23. Gorrión chillón
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Gorrión chillón', 'Petronia petronia', 'Passeriformes', 'Passeridae', 'Gorrión de tonos listados, con mancha amarilla en el pecho. De zonas rocosas.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Petronia_petronia_-_Rock_Sparrow.jpg/800px-Petronia_petronia_-_Rock_Sparrow.jpg', 'LC');

-- 24. Curruca rabilarga
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Curruca rabilarga', 'Sylvia undata', 'Passeriformes', 'Sylviidae', 'Pequeña curruca de cola larga y tonos rojizos. Habita en matorrales densos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Dartford_Warbler_%28Sylvia_undata%29.jpg/800px-Dartford_Warbler_%28Sylvia_undata%29.jpg', 'NT');

-- 25. Aguililla calzada
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Aguililla calzada', 'Hieraaetus pennatus', 'Accipitriformes', 'Accipitridae', 'Pequeña águila migradora que cría en bosques de Gredos. Existe fase clara y oscura.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Booted_eagle_%28Hieraaetus_pennatus%29.jpg/800px-Booted_eagle_%28Hieraaetus_pennatus%29.jpg', 'LC');

-- 26. Piquituerto común
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Piquituerto común', 'Loxia curvirostra', 'Passeriformes', 'Fringillidae', 'Pico cruzado para extraer piñones de piñas. Nómada según disponibilidad de comida.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Common_Crossbill_%28Loxia_curvirostra%29_male.jpg/800px-Common_Crossbill_%28Loxia_curvirostra%29_male.jpg', 'LC');

-- 27. Verderón serrano
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Verderón serrano', 'Carduelis citrinella', 'Passeriformes', 'Fringillidae', 'Endemismo del suroeste europeo. Habita en bosques de montaña, especialmente de coníferas.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Citril_Finch_%28Carduelis_citrinella%29.jpg/800px-Citril_Finch_%28Carduelis_citrinella%29.jpg', 'LC');

-- 28. Cernícalo vulgar
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Cernícalo vulgar', 'Falco tinnunculus', 'Falconiformes', 'Falconidae', 'Pequeño halcón que cernese en vuelo. Común en campos abiertos y cercanías de pueblos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Common_Kestrel_%28Falco_tinnunculus%29_male.jpg/800px-Common_Kestrel_%28Falco_tinnunculus%29_male.jpg', 'LC');

-- 29. Mito común
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Mito común', 'Aegithalos caudatus', 'Passeriformes', 'Aegithalidae', 'Pequeño pájaro de cola muy larga. Se mueve en bandos ruidosos por bosques y setos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Long-tailed_Tit_%28Aegithalos_caudatus%29.jpg/800px-Long-tailed_Tit_%28Aegithalos_caudatus%29.jpg', 'LC');

-- 30. Arrendajo euroasiático
INSERT INTO "Navarrevisca_birds" 
(common_name, scientific_name, "order", family, description, image, threat_level) 
VALUES 
('Arrendajo euroasiático', 'Garrulus glandarius', 'Passeriformes', 'Corvidae', 'Córvido colorido que habita bosques. Importante dispersor de bellotas.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Eurasian_Jay_%28Garrulus_glandarius%29_%2814550025465%29.jpg/800px-Eurasian_Jay_%28Garrulus_glandarius%29_%2814550025465%29.jpg', 'LC');