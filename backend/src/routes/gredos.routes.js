const express = require('express');
const router = express.Router();
const gredosController = require('../controllers/gredos.controller.js');


// 1. OBSERVACIONES EN ÁVILA
    // http://localhost:3001/api/avila/observations
        // http://localhost:3001/api/avila/observations?days=3&limit=15&hotspot=true
        //http://localhost:3001/api/avila/observations?lat=40.65&lng=-4.68&dist=20
router.get('/observations', gredosController.getObservations);

// 2. ESPECIES DE ÁVILA
    // http://localhost:3001/api/avila/species
router.get('/species', gredosController.getSpecies);

// 3. BUSCAR ESPECIE
    // http://localhost:3001/api/avila/species/search?q=águila
    // http://localhost:3001/api/avila/species/search?q=buitre
    // http://localhost:3001/api/avila/species/search?q=gorrión
router.get('/species/search', gredosController.searchSpecies);

// 4. INFORMACIÓN DETALLADA DE ESPECIE
    // http://localhost:3001/api/avila/species/[CODIGO_ESPECIE]
        // Primero obtener códigos buscando: http://localhost:3001/api/avila/species/search?q=buzzard
            // http://localhost:3001/api/avila/species/butbut
            // http://localhost:3001/api/avila/species/gyfful
            // http://localhost:3001/api/avila/species/aquchr
router.get('/species/:code', gredosController.getSpeciesDetail);

// 5. PUNTOS CALIENTES DE OBSERVACIÓN
    // http://localhost:3001/api/avila/hotspots
        // http://localhost:3001/api/avila/hotspots?lat=40.25&lng=-5.28&dist=30
        // http://localhost:3001/api/avila/hotspots?lat=40.65&lng=-4.68&dist=50
router.get('/hotspots', gredosController.getHotspots);

module.exports = router;