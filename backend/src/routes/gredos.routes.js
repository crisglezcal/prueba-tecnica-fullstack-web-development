
const express = require('express');
const router = express.Router();
const gredosController = require('../controllers/gredos.controller.js');

// =============================================================================================================================
// 1. RUTAS PÚBLICAS (no requieren autenticación)
// =============================================================================================================================

router.get('/observations', gredosController.getObservations);
router.get('/species', gredosController.getSpecies);
router.get('/species/search', gredosController.searchSpecies);
router.get('/species/:code', gredosController.getSpeciesDetail);
router.get('/hotspots', gredosController.getHotspots);

module.exports = router;